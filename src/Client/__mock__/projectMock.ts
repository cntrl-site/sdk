import { TProject } from '@cntrl-site/core';

export const projectMock: TProject = {
  id: 'projectId',
  layouts: [],
  fonts: {
    google: '',
    adobe: '',
    custom: []
  },
  html: {
    beforeBodyClose: '',
    afterBodyOpen: '',
    head: ''
  },
  meta: {
    favicon: undefined,
    title: undefined,
    opengraphThumbnail: undefined,
    keywords: undefined,
    description: undefined
  },
  grid: {
    color: 'rgba(0, 0, 0, 1)'
  },
  pages: [{
    id: 'pageId',
    title: 'Page',
    articleId: 'articleId',
    slug: '/',
    isPublished: true,
    meta: {
      opengraphThumbnail: 'page-thumbnail',
      title: 'page-title',
      description: 'page-description',
      enabled: true,
      keywords: 'page-keywords'
    }
  }]
};
