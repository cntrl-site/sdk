import { Client } from './Client';
import { projectMock } from './__mock__/projectMock';
import { articleMock } from './__mock__/articleMock';
import { typePresetsMock } from './__mock__/typePresetsMock';
import { TMeta, TPageMeta } from '@cntrl-site/core';
import { keyframesMock } from './__mock__/keyframesMock';

describe('Client', () => {
  it('returns project', async () => {
    const projectId = 'MY_PROJECT_ID';
    const apiKey = 'MY_API_KEY';
    let fetchCalledTimes = 0;
    const apiUrl = `https://${projectId}:${apiKey}@api.cntrl.site/`;
    const fetch = async (url: string) => {
      fetchCalledTimes += 1;
      expect(url).toBe(`https://api.cntrl.site/projects/${projectId}`);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(projectMock),
        statusText: ''
      });
    };
    const client = new Client(apiUrl, fetch);
    const project = await client.getProject();
    expect(fetchCalledTimes).toBe(1);
    expect(project).toEqual(projectMock);
  });

  it('throws an error upon project fetch failure', async () => {
    const projectId = 'MY_PROJECT_ID';
    const apiKey = 'MY_API_KEY';
    const apiUrl = `https://${projectId}:${apiKey}@api.cntrl.site/`;
    const fetch = async () => Promise.resolve({
      ok: false,
      statusText: 'reason',
      json: () => Promise.resolve()
    });
    const client = new Client(apiUrl, fetch);
    await expect(client.getProject()).rejects.toEqual(new Error('Failed to fetch project with id #MY_PROJECT_ID: reason'));
  });

  it('returns article by page slug', async () => {
    let fetchCalledTimes = 0;
    const projectId = 'MY_PROJECT_ID';
    const apiKey = 'MY_API_KEY';
    const apiUrl = `https://${projectId}:${apiKey}@api.cntrl.site/`;
    const projectApiUrl = `https://api.cntrl.site/projects/${projectId}`;
    const articleApiUrl = `https://api.cntrl.site/projects/${projectId}/articles/articleId`;
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
        json: () => Promise.resolve(url === projectApiUrl ? projectMock : { article: articleMock, keyframes: keyframesMock }),
        statusText: ''
      });
    };
    const client = new Client(apiUrl, fetch);
    const { article, keyframes } = await client.getPageArticle('/');
    expect(fetchCalledTimes).toBe(2);
    expect(article).toEqual(articleMock);
    expect(keyframes).toEqual(keyframesMock);
  });

  it('throws an error upon project fetch failure when trying to get article by slug', async () => {
    const projectId = 'MY_PROJECT_ID';
    const apiKey = 'MY_API_KEY';
    const apiUrl = `https://${projectId}:${apiKey}@api.cntrl.site/`;
    const fetch = async () => Promise.resolve({
      ok: false,
      statusText: 'reason',
      json: () => Promise.resolve()
    });
    const client = new Client(apiUrl, fetch);
    await expect(client.getPageArticle('/'))
      .rejects.toEqual(new Error(`Failed to fetch project with id #${projectId}: reason`));
  });

  it('throws an error upon article fetch failure when trying to get article by slug', async () => {
    const projectId = 'MY_PROJECT_ID';
    const apiKey = 'MY_API_KEY';
    const apiUrl = `https://${projectId}:${apiKey}@api.cntrl.site/`;
    const projectApiUrl = `https://api.cntrl.site/projects/${projectId}`;
    const fetch = (url: string) => {
      return Promise.resolve({
        ok: url === projectApiUrl,
        json: () => Promise.resolve(projectMock),
        statusText: 'reason'
      });
    };
    const client = new Client(apiUrl, fetch);
    await expect(client.getPageArticle('/'))
      .rejects.toEqual(new Error('Failed to fetch article with id #articleId: reason'));
  });

  it('throws an error when trying to fetch article by nonexistent slug', async () => {
    const projectId = 'MY_PROJECT_ID';
    const apiKey = 'MY_API_KEY';
    const apiUrl = `https://${projectId}:${apiKey}@api.cntrl.site/`;
    const projectApiUrl = `https://api.cntrl.site/projects/${projectId}`;
    const slug = '/nonexistent-slug';
    const fetch = (url: string) => {
      return Promise.resolve({
        ok: url === projectApiUrl,
        json: () => Promise.resolve(projectMock),
        statusText: 'reason'
      });
    };
    const client = new Client(apiUrl, fetch);
    await expect(client.getPageArticle(slug))
      .rejects.toEqual(new Error(`Page with a slug ${slug} was not found in project with id #${projectId}`));
  });

  it('returns type presets by project id', async () => {
    let fetchCalledTimes = 0;
    const projectId = 'MY_PROJECT_ID';
    const apiKey = 'MY_API_KEY';
    const apiUrl = `https://${projectId}:${apiKey}@api.cntrl.site/`;
    const fetch = (url: string) => {
      fetchCalledTimes += 1;
      expect(url).toBe(`https://api.cntrl.site/projects/${projectId}/type-presets`);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(typePresetsMock),
        statusText: ''
      });
    };
    const client = new Client(apiUrl, fetch);
    const presets = await client.getTypePresets();
    expect(presets).toEqual(typePresetsMock);
    expect(fetchCalledTimes).toEqual(1);
  });

  it('throws an error upon type presets fetch failure', async () => {
    const projectId = 'MY_PROJECT_ID';
    const apiKey = 'MY_API_KEY';
    const apiUrl = `https://${projectId}:${apiKey}@api.cntrl.site/`;
    const fetch = () => {
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve(),
        statusText: 'reason'
      });
    };
    const client = new Client(apiUrl, fetch);
    await expect(client.getTypePresets()).rejects.toEqual(
      new Error(`Failed to fetch type presets for the project with id #${projectId}: reason`)
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

  it('throws an error when no project ID passed to the connect URL', async () => {
    const projectId = '';
    const apiKey = 'MY_API_KEY';
    const apiUrl = `https://${projectId}:${apiKey}@api.cntrl.site/`;
    expect(() => new Client(apiUrl)).toThrow(new Error('Project ID is missing in the URL.'));
    expect(() => new Client('https://api.cntrl.site'))
      .toThrow(new Error('Project ID is missing in the URL.'));
  });

  it('throws an error when no API key passed to the connect URL', async () => {
    const projectId = 'whatever';
    const apiKey = '';
    const apiUrl = `https://${projectId}:${apiKey}@api.cntrl.site/`;
    expect(() => new Client(apiUrl)).toThrow(new Error('API key is missing in the URL.'));
  });
});
