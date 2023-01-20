import { Client } from './Client';
import { projectMock } from './__mock__/projectMock';
import { articleMock } from './__mock__/articleMock';
import { typePresetsMock } from './__mock__/typePresetsMock';
import { TMeta, TPageMeta } from '@cntrl-site/core';
import { keyframesMock } from './__mock__/keyframesMock';

describe('Client', () => {
  it('returns project', async () => {
    let fetchCalledTimes = 0;
    const projectId = 'projectId';
    const apiUrl = 'https://api.cntrl.site/';
    const fetch = async (url: string) => {
      fetchCalledTimes += 1;
      expect(url).toBe(`${apiUrl}projects/${projectId}`);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(projectMock),
        statusText: ''
      });
    };
    const client = new Client(projectId, apiUrl, fetch);
    const project = await client.getProject();
    expect(fetchCalledTimes).toBe(1);
    expect(project).toEqual(projectMock);
  });

  it('throws an error upon project fetch failure', async () => {
    const projectId = 'projectId';
    const apiUrl = 'https://api.cntrl.site/';
    const fetch = async () => Promise.resolve({
      ok: false,
      statusText: 'reason',
      json: () => Promise.resolve()
    });
    const client = new Client(projectId, apiUrl, fetch);
    await expect(client.getProject()).rejects.toEqual(new Error('Failed to fetch project with id #projectId: reason'));
  });

  it('returns article by page slug', async () => {
    let fetchCalledTimes = 0;
    const projectId = 'projectId';
    const apiUrl = 'https://api.cntrl.site/';
    const projectApiUrl = `${apiUrl}projects/projectId`;
    const articleApiUrl = `${apiUrl}articles/articleId`;
    const fetch = async (url: string) => {
      fetchCalledTimes += 1;
      if (fetchCalledTimes === 1) {
        expect(url).toBe(projectApiUrl);
      }
      if (fetchCalledTimes === 2) {
        expect(url).toBe(articleApiUrl);
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(url === projectApiUrl ? projectMock : articleMock),
        statusText: ''
      });
    };
    const client = new Client(projectId, apiUrl, fetch);
    const article = await client.getPageArticle('/');
    expect(fetchCalledTimes).toBe(2);
    expect(article).toEqual(articleMock);
  });

  it('throws an error upon project fetch failure when trying to get article by slug', async () => {
    const projectId = 'projectId';
    const apiUrl = 'https://api.cntrl.site/';
    const fetch = async () => Promise.resolve({
      ok: false,
      statusText: 'reason',
      json: () => Promise.resolve()
    });
    const client = new Client(projectId, apiUrl, fetch);
    await expect(client.getPageArticle('/'))
      .rejects.toEqual(new Error('Failed to fetch project with id #projectId: reason'));
  });

  it('throws an error upon article fetch failure when trying to get article by slug', async () => {
    const projectId = 'projectId';
    const apiUrl = 'https://api.cntrl.site/';
    const projectApiUrl = `${apiUrl}projects/projectId`;
    const fetch = (url: string) => {
      return Promise.resolve({
        ok: url === projectApiUrl,
        json: () => Promise.resolve(projectMock),
        statusText: 'reason'
      });
    };
    const client = new Client(projectId, apiUrl, fetch);
    await expect(client.getPageArticle('/'))
      .rejects.toEqual(new Error('Failed to fetch article with id #articleId: reason'));
  });

  it('throws an error when trying to fetch article by nonexistent slug', async () => {
    const projectId = 'projectId';
    const apiUrl = 'https://api.cntrl.site/';
    const projectApiUrl = `${apiUrl}projects/projectId`;
    const slug = '/nonexistent-slug';
    const fetch = (url: string) => {
      return Promise.resolve({
        ok: url === projectApiUrl,
        json: () => Promise.resolve(projectMock),
        statusText: 'reason'
      });
    };
    const client = new Client(projectId, apiUrl, fetch);
    await expect(client.getPageArticle(slug))
      .rejects.toEqual(new Error(`Page with a slug ${slug} was not found in project with id #${projectId}`));
  });

  it('returns type presets by project id', async () => {
    let fetchCalledTimes = 0;
    const projectId = 'projectId';
    const apiUrl = 'https://api.cntrl.site/';
    const fetch = (url: string) => {
      fetchCalledTimes += 1;
      expect(url).toBe(`${apiUrl}projects/${projectId}/type-presets`);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(typePresetsMock),
        statusText: ''
      });
    };
    const client = new Client(projectId, apiUrl, fetch);
    const presets = await client.getTypePresets();
    expect(presets).toEqual(typePresetsMock);
    expect(fetchCalledTimes).toEqual(1);
  });

  it('throws an error upon type presets fetch failure', async () => {
    const projectId = 'projectId';
    const apiUrl = 'https://api.cntrl.site/';
    const fetch = () => {
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve(),
        statusText: 'reason'
      });
    };
    const client = new Client(projectId, apiUrl, fetch);
    await expect(client.getTypePresets()).rejects.toEqual(
      new Error(`Failed to fetch type presets for the project with id #${projectId}: reason`)
    );
  });

  it('returns keyframes by article id', async () => {
    let fetchCalledTimes = 0;
    const projectId = 'projectId';
    const articleId = 'articleId';
    const apiUrl = 'https://api.cntrl.site/';
    const fetch = (url: string) => {
      fetchCalledTimes += 1;
      expect(url).toBe(`${apiUrl}keyframes/${articleId}`);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(keyframesMock),
        statusText: ''
      });
    };
    const client = new Client(projectId, apiUrl, fetch);
    const presets = await client.getKeyframes(articleId);
    expect(presets).toEqual(keyframesMock);
    expect(fetchCalledTimes).toEqual(1);
  });

  it('throws an error upon keyframes fetch failure', async () => {
    const projectId = 'projectId';
    const articleId = 'articleId';
    const apiUrl = 'https://api.cntrl.site/';
    const fetch = () => {
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve(),
        statusText: 'reason'
      });
    };
    const client = new Client(projectId, apiUrl, fetch);
    await expect(client.getKeyframes(articleId)).rejects.toEqual(
      new Error(`Failed to fetch keyframes for the article with id #${articleId}: reason`)
    );
  });

  it('merges two meta objects into one with priority of page-based over project-based', () => {
    const pageMeta: TPageMeta = {
      enabled: true,
      description: 'page-desc',
      title: 'page-title'
    };

    const projectMeta: TMeta = {
      opengraphThumbnail: 'proj-og',
      description: 'proj-desc',
      title: 'proj-title',
      keywords: 'project, keywords'
    };
    const meta = Client.getPageMeta(projectMeta, pageMeta);
    expect(meta.keywords).toBe(projectMeta.keywords);
    expect(meta.opengraphThumbnail).toBe(projectMeta.opengraphThumbnail);
    expect(meta.description).toBe(pageMeta.description);
    expect(meta.title).toBe(pageMeta.title);
  });

  it('ignores page meta when `enabled` is set to `false` and uses only generic project meta', () => {
    const pageMeta: TPageMeta = {
      enabled: false,
      description: 'page-desc',
      title: 'page-title'
    };

    const projectMeta: TMeta = {
      opengraphThumbnail: 'proj-og',
      keywords: 'project, keywords'
    };

    const meta = Client.getPageMeta(projectMeta, pageMeta);
    expect(meta.keywords).toBe(projectMeta.keywords);
    expect(meta.opengraphThumbnail).toBe(projectMeta.opengraphThumbnail);
    expect(meta.description).toBeUndefined();
    expect(meta.title).toBeUndefined();
  });
});
