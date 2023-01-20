import { KeyframeType, TKeyframeAny } from '@cntrl-site/core';

export const keyframesMock: TKeyframeAny[] = [
  {
    id: 'keyframeId',
    articleId: 'articleId',
    type: KeyframeType.Color,
    position: 100,
    value: {
      color: 'black'
    },
    itemId: 'itemId',
    layoutId: 'layoutId'
  }
];
