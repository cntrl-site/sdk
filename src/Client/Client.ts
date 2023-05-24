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
  KeyframesSchema
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
      throw new Error('API Key is missing in the URL.');
    }
  }

  async getProject(): Promise<TProject> {
    try {
      const response = await this.fetchProject();
      const data = await response.json();
      const project = ProjectSchema.parse(data);
      return project;
    } catch (e) {
      throw e;
    }
  }

  async getPageArticle(pageSlug: string): Promise<{ article: TArticle, keyframes: TKeyframeAny[] }> {
    try {
      const projectResponse = await this.fetchProject();
      const data = await projectResponse.json();
      const project = ProjectSchema.parse(data);
      const articleId = this.findArticleIdByPageSlug(pageSlug, project.pages);
      const articleResponse = await this.fetchArticle(articleId);
      const articleData = await articleResponse.json();
      const article = ArticleSchema.parse(articleData.article);
      const keyframes = KeyframesSchema.parse(articleData.keyframes);
      return { article, keyframes };
    } catch (e) {
      throw e;
    }
  }

  async getTypePresets(): Promise<TTypePresets> {
    const response = await this.fetchTypePresets();
    const data = await response.json();
    const typePresets = TypePresetsSchema.parse(data);
    return typePresets;
  }

  public static getPageMeta(projectMeta: TMeta, pageMeta: TPageMeta): TMeta {
    return pageMeta.enabled ? {
      title: pageMeta.title ? pageMeta.title : projectMeta.title,
      description: pageMeta.description ? pageMeta.description : projectMeta.description,
      keywords: pageMeta.keywords ? pageMeta.keywords : projectMeta.keywords,
      opengraphThumbnail: pageMeta.opengraphThumbnail ? pageMeta.opengraphThumbnail : projectMeta.opengraphThumbnail,
      favicon: projectMeta.favicon
    } : projectMeta;
  }

  private async fetchProject(): Promise<FetchImplResponse> {
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
    return response;
  }

  private async fetchArticle(articleId: string): Promise<FetchImplResponse> {
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
    return response;
  }

  private async fetchTypePresets(): Promise<FetchImplResponse> {
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
    return response;
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
