import { Article } from '../../types/article/Article';

export const articleMock: Article = {
  id: 'articleId',
  sections: [
    {
      id: 'sectionId',
      type: 'default',
      items: [],
      position: {},
      minHeight: {},
      hidden: {},
      color: {},
      structuredContent: [],
      structuredContentSettings: {
        paddingBottom: {}
      }
    }
  ],
  interactions: {}
};
