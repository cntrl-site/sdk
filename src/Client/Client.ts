import {
  TProject,
  ProjectSchema,
  TArticle,
  ArticleSchema,
  TMeta,
  TPageMeta,
  TTypePresets,
  TypePresetsSchema,
  TPage,
  TKeyframeAny,
  KeyframesSchema,
  TLayout
} from '@cntrl-site/core';
import fetch from 'isomorphic-fetch';
import { URL } from 'url';

export class Client {
  private url: URL;
  constructor(
    APIUrl: string,
    private fetchImpl: FetchImpl = fetch
  ) {
    this.url = new URL(APIUrl);
    if (!this.url.username) {
      throw new Error('Project ID is missing in the URL.');
    }
    if (!this.url.password) {
      throw new Error('API key is missing in the URL.');
    }
  }

  private static getPageMeta(projectMeta: TMeta, pageMeta: TPageMeta): TMeta {
    return pageMeta.enabled ? {
      title: pageMeta.title ? pageMeta.title : projectMeta.title,
      description: pageMeta.description ? pageMeta.description : projectMeta.description,
      keywords: pageMeta.keywords ? pageMeta.keywords : projectMeta.keywords,
      opengraphThumbnail: pageMeta.opengraphThumbnail ? pageMeta.opengraphThumbnail : projectMeta.opengraphThumbnail,
      favicon: projectMeta.favicon
    } : projectMeta;
  }

  async getPageData(pageSlug: string): Promise<CntrlPageData> {
    try {
      const project = await this.fetchProject();
      const articleId = this.findArticleIdByPageSlug(pageSlug, project.pages);
      const [{ article, keyframes }, typePresets] = await Promise.all([
        this.fetchArticle(articleId),
        this.fetchTypePresets()
      ]);
      const page = project.pages.find(page => page.slug === pageSlug)!;
      const meta = Client.getPageMeta(project.meta, page?.meta!);
      return {
        project,
        typePresets,
        article,
        keyframes,
        meta
      };
    } catch (e) {
      throw e;
    }
  }

  async getProjectPagesPaths(): Promise<string[]> {
    try {
      const { pages } = await this.fetchProject();
      return pages.map(p => p.slug);
    } catch (e) {
      throw e;
    }
  }

  async getLayouts(): Promise<TLayout[]> {
    try {
      const { layouts } = await this.fetchProject();
      return layouts;
    } catch (e) {
      throw e;
    }
  }

  async getTypePresets(): Promise<TTypePresets> {
    const response = await this.fetchTypePresets();
    return response;
  }

  private async fetchProject(): Promise<TProject> {
    const { username: projectId, password: apiKey, origin } = this.url;
    const url = new URL(`/projects/${projectId}`, origin);
    const response = await this.fetchImpl(url.href, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch project with id #${projectId}: ${response.statusText}`);
    }
    const data = await response.json();
    const project = ProjectSchema.parse(data);
    return project;
  }

  private async fetchArticle(articleId: string): Promise<ArticleData> {
    const { username: projectId, password: apiKey, origin } = this.url;
    const url = new URL(`/projects/${projectId}/articles/${articleId}`, origin);
    const response = await this.fetchImpl(url.href, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch article with id #${articleId}: ${response.statusText}`);
    }
    const data = await response.json();
    const article = ArticleSchema.parse(data.article);
    const keyframes = KeyframesSchema.parse(data.keyframes);
    return { article, keyframes };
  }

  private async fetchTypePresets(): Promise<TTypePresets> {
    const { username: projectId, password: apiKey, origin } = this.url;
    const url = new URL(`/projects/${projectId}/type-presets`, origin);
    const response = await this.fetchImpl(url.href, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch type presets for the project with id #${projectId}: ${response.statusText}`
      );
    }
    const data = await response.json();
    const typePresets = TypePresetsSchema.parse(data);
    return typePresets;
  }

  private findArticleIdByPageSlug(slug: string, pages: TPage[]): string {
    const { username: projectId } = this.url;
    const page = pages.find((page) => page.slug === slug);
    if (!page) {
      throw new Error(`Page with a slug ${slug} was not found in project with id #${projectId}`);
    }
    return page.articleId;
  }
}

interface FetchImplResponse {
  ok: boolean;
  json(): Promise<any>;
  statusText: string;
}

type FetchImpl = (url: string, init?: RequestInit) => Promise<FetchImplResponse>;
interface ArticleData {
  article: TArticle;
  keyframes: TKeyframeAny[];
}
interface CntrlPageData extends ArticleData {
  project: TProject;
  typePresets: TTypePresets;
  meta: TMeta;
}
