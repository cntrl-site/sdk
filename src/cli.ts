#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import { config } from 'dotenv';
import { program } from 'commander';
import { Client } from './Client/Client';
import { Layout } from './types/project/Layout';
import { Page } from './types/project/Page';

program
  .command('generate-layouts')
  .option('-o, --output <outputFilePath>', 'Output file path', 'cntrl.scss')
  .option('-e, --env <envFilename>', 'Name of the .env file', '.env.local')
  .action(async (options) => {
    try {
      config({ path: options.env });
      const templateFilePath = path.resolve(__dirname, '../resources/template.scss.ejs');
      const scssTemplate = fs.readFileSync(templateFilePath, 'utf-8');
      const apiUrl = process.env.CNTRL_API_URL;
      if (!apiUrl) {
        throw new Error('Environment variable "CNTRL_API_URL" must be set.');
      }
      const client = new Client(apiUrl);
      const layouts = await client.getLayouts();
      const ranges = convertLayouts(layouts);

      const compiledTemplate = ejs.compile(scssTemplate);
      const renderedTemplate = compiledTemplate({ ranges });
      const outputFilePath = path.resolve(process.cwd(), options.output);
      fs.writeFileSync(outputFilePath, renderedTemplate);

      console.log(`Generated .scss file at ${outputFilePath}`);
    } catch (error) {
      console.error('An error occurred:', error);
      process.exit(1);
    }
  });

program
  .command('generate-sitemap')
  .description('Generate sitemap.xml and robots.txt for the published site')
  .option('-o, --output <outputDir>', 'Output directory', 'public')
  .option('-e, --env <envFilename>', 'Name of the .env file', '.env.local')
  .action(async (options) => {
    try {
      config({ path: options.env });
      const apiUrl = process.env.CNTRL_API_URL;
      if (!apiUrl) {
        console.warn('[sitemap] CNTRL_API_URL is not set — skipping sitemap/robots generation.');
        return;
      }
      const client = new Client(apiUrl);
      const project = await client.getProject();
      const siteUrl = resolveSiteUrl(project.primaryDomain, process.env.SITE_URL);
      if (!siteUrl) {
        console.warn(
          '[sitemap] Could not resolve a canonical site URL — skipping sitemap/robots generation.\n' +
          '          The project has no primary domain in the API response and SITE_URL is not set.\n' +
          '          Either publish the site (so a primary domain exists) or set SITE_URL.'
        );
        return;
      }
      const indexable = project.pages.filter(isIndexablePage);
      const fallbackLastmod = formatLastmod(new Date().toISOString());
      const outputDir = path.resolve(process.cwd(), options.output);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      const sitemapPath = path.resolve(outputDir, 'sitemap.xml');
      const robotsPath = path.resolve(outputDir, 'robots.txt');
      fs.writeFileSync(sitemapPath, renderSitemap(indexable, siteUrl, fallbackLastmod));
      fs.writeFileSync(robotsPath, renderRobots(siteUrl));
      console.log(`Generated sitemap.xml at ${sitemapPath} (${indexable.length} of ${project.pages.length} pages)`);
      console.log(`Generated robots.txt at ${robotsPath}`);
    } catch (error: any) {
      console.warn(`[sitemap] Failed to generate sitemap/robots: ${error?.message || error}`);
      console.warn('[sitemap] Continuing without updated sitemap.');
    }
  });

function resolveSiteUrl(primaryDomain: string | null | undefined, override: string | undefined): URL | null {
  const host = override || primaryDomain;
  if (!host) return null;
  return parseAsUrl(host);
}

function isIndexablePage(page: Page): boolean {
  if (typeof page.slug !== 'string') return false;
  if (page.isPublished === false) return false;
  if (page.isAuthProtected === true) return false;
  return true;
}

function renderSitemap(pages: Page[], siteUrl: URL, fallbackLastmod: string): string {
  const entries = pages.map(page => {
    const loc = escapeXml(buildPageUrl(siteUrl, page.slug));
    const lastmod = page.lastModified ? formatLastmod(page.lastModified) : fallbackLastmod;
    const priority = page.slug === '' ? '1.00' : '0.80';
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <priority>${priority}</priority>`,
      '  </url>'
    ].join('\n');
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    ''
  ].join('\n');
}

function formatLastmod(iso: string): string {
  // YYYY-MM-DD is sitemap-spec valid and avoids hour-of-rebuild noise.
  return iso.slice(0, 10);
}

function renderRobots(siteUrl: URL): string {
  const sitemapUrl = new URL('/sitemap.xml', siteUrl.origin).toString();
  return [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${sitemapUrl}`,
    ''
  ].join('\n');
}

function buildPageUrl(siteUrl: URL, slug: string): string {
  const base = new URL(siteUrl.href);
  if (!base.pathname.endsWith('/')) base.pathname += '/';
  const relative = stripSlashes(slug);
  const target = relative ? new URL(`${relative}/`, base) : base;
  target.search = '';
  target.hash = '';
  return target.toString();
}

function parseAsUrl(input: string): URL | null {
  return tryParseUrl(input) ?? tryParseUrl(`https://${input}`);
}

function tryParseUrl(input: string): URL | null {
  try {
    return new URL(input);
  } catch {
    return null;
  }
}

function stripSlashes(value: string): string {
  let start = 0;
  let end = value.length;
  while (start < end && value[start] === '/') start += 1;
  while (end > start && value[end - 1] === '/') end -= 1;
  return value.slice(start, end);
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function convertLayouts(layouts: Layout[], maxLayoutWidth: number = Number.MAX_SAFE_INTEGER): LayoutRange[] {
  const sorted = layouts.slice().sort((la, lb) => la.startsWith - lb.startsWith);
  const mapped = sorted.map<LayoutRange>((layout, i, ls) => {
    const next = ls[i + 1];
    return {
      start: layout.startsWith,
      end: next ? next.startsWith - 1 : maxLayoutWidth,
      exemplary: layout.exemplary,
      name: layout.title,
      isFirst: i === 0,
      isLast: !next
    };
  });
  return mapped;
}

export interface LayoutRange {
  /** closed range [start, end] */
  start: number;
  end: number;
  exemplary: number;
  name: string;
  isFirst: boolean;
  isLast: boolean;
}

program.parse(process.argv);
