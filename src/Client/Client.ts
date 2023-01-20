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
  constructor(
    private projectId: string,
    private APIUrl: string,
    private fetchImpl: FetchImpl = fetch
  ) {
    if (projectId.length === 0) {
      throw new Error('CNTRL SDK: Project ID is empty. Did you forget to pass it?');
    }
    if (APIUrl.length === 0) {
      throw new Error('CNTRL SDK: API URL is empty. Did you forget to pass it?');
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

  async getPageArticle(pageSlug: string): Promise<TArticle> {
    try {
      const projectResponse = await this.fetchProject();
      const data = await projectResponse.json();
      const project = ProjectSchema.parse(data);
      const articleId = this.findArticleIdByPageSlug(pageSlug, project.pages);
      const articleResponse = await this.fetchArticle(articleId);
      const articleData = await articleResponse.json();
      const article = ArticleSchema.parse(articleData);
      return article;
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

  async getKeyframes(articleId: string): Promise<TKeyframeAny[]> {
    const response = await this.fetchKeyframes(articleId);
    const data = await response.json();
    const keyframes = KeyframesSchema.parse(data);
    return keyframes;
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
    const url = new URL(`/projects/${this.projectId}`, this.APIUrl);
    const response = await this.fetchImpl(url.href);
    if (!response.ok) {
      throw new Error(`Failed to fetch project with id #${this.projectId}: ${response.statusText}`);
    }
    return response;
  }

  private async fetchArticle(articleId: string): Promise<FetchImplResponse> {
    const url = new URL(`/articles/${articleId}`, this.APIUrl);
    const response = await this.fetchImpl(url.href);
    if (!response.ok) {
      throw new Error(`Failed to fetch article with id #${articleId}: ${response.statusText}`);
    }
    return response;
  }

  private async fetchKeyframes(articleId: string): Promise<FetchImplResponse> {
    const url = new URL(`/keyframes/${articleId}`, this.APIUrl);
    const response = await this.fetchImpl(url.href);
    if (!response.ok) {
      throw new Error(`Failed to fetch keyframes for the article with id #${articleId}: ${response.statusText}`);
    }
    return response;
  }

  private async fetchTypePresets(): Promise<FetchImplResponse> {
    const url = new URL(`/projects/${this.projectId}/type-presets`, this.APIUrl);
    const response = await this.fetchImpl(url.href);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch type presets for the project with id #${this.projectId}: ${response.statusText}`
      );
    }
    return response;
  }

  private findArticleIdByPageSlug(slug: string, pages: TPage[]): string {
    const page = pages.find((page) => page.slug === slug);
    if (!page) {
      throw new Error(`Page with a slug ${slug} was not found in project with id #${this.projectId}`);
    }
    return page.articleId;
  }
}

interface FetchImplResponse {
  ok: boolean;
  json(): Promise<any>;
  statusText: string;
}

type FetchImpl = (url: string) => Promise<FetchImplResponse>;
