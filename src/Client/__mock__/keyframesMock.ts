import { KeyframeAny, KeyframeType } from '../../types/keyframe/Keyframe';

export const keyframesMock: KeyframeAny[] = [
  {
    id: 'keyframeId',
    type: KeyframeType.TextColor,
    position: 100,
    value: {
      color: 'black'
    },
    itemId: 'itemId',
    layoutId: 'layoutId'
  },
  {
    id: 'fontVariationKeyframeId',
    type: KeyframeType.FontVariation,
    position: 200,
    value: {
      wght: 650,
      wdth: 80
    },
    itemId: 'itemId',
    layoutId: 'layoutId'
  }
];
