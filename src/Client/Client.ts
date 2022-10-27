import { TProject, ProjectSchema, TArticle, ArticleSchema, TMeta, TPageMeta } from '@cntrl-site/core';
import fetch from 'isomorphic-fetch';
import { URL } from 'url';

export class Client {
  constructor(
    private projectId: string,
    private APIUrl: string,
    private fetchImpl = fetch
  ) {
    if (projectId.length === 0) {
      throw new Error('CNTRL SDK: Project ID is empty. Did you forget to pass it?');
    }
    if (APIUrl.length === 0) {
      throw new Error('CNTRL SDK: API URL is empty. Did you forget to pass it?');
    }
  }

  async getProject(): Promise<TProject> {
    const projectUrl = new URL(`/projects/${this.projectId}`, this.APIUrl);
    const response = await this.fetchImpl(projectUrl.href);
    if (!response.ok) {
      throw new Error(`Failed to fetch project with id #${this.projectId}: ${response.statusText}`);
    }
    const data = await response.json();
    const project = ProjectSchema.parse(data);
    return project;
  }

  async getPageArticle(pageSlug: string): Promise<TArticle> {
    const projectUrl = new URL(`/projects/${this.projectId}`, this.APIUrl);
    const projectResponse = await this.fetchImpl(projectUrl.href);
    if (!projectResponse.ok) {
      throw new Error(`Failed to fetch project with id #${this.projectId}: ${projectResponse.statusText}`);
    }
    const data = await projectResponse.json();
    const project = ProjectSchema.parse(data);
    const page = project.pages.find((page) => page.slug === pageSlug);
    if (!page) {
      throw new Error(`Page with a slug ${pageSlug} was not found in project with id #${this.projectId}`);
    }
    const url = new URL(`/articles/${page.articleId}`, this.APIUrl);
    const articleResponse = await this.fetchImpl(url.href);
    if (!articleResponse.ok) {
      throw new Error(`Failed to fetch article with id #${page.articleId}: ${articleResponse.statusText}`);
    }
    const articleData = await articleResponse.json();
    const article = ArticleSchema.parse(articleData);

    return article;
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
}
