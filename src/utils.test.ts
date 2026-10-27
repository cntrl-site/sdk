import { getShownCaption } from './utils';

describe('getShownCaption', () => {
  it('gives the caption of an image that has one, switched on or never switched', () => {
    expect(getShownCaption({ caption: 'Seen from the hill', showCaption: true })).toBe('Seen from the hill');
    expect(getShownCaption({ caption: 'Seen from the hill' })).toBe('Seen from the hill');
  });

  it('gives none for a caption switched off, kept as it is', () => {
    expect(getShownCaption({ caption: 'Kept for later', showCaption: false })).toBeUndefined();
  });

  it('gives none for a caption that says nothing, switched on or not', () => {
    expect(getShownCaption({ caption: '  ', showCaption: true })).toBeUndefined();
    expect(getShownCaption({ showCaption: true })).toBeUndefined();
    expect(getShownCaption({})).toBeUndefined();
  });
});
