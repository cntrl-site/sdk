import { FontFaceGenerator } from './FontFaceGenerator';
import { TCustomFont } from '@cntrl-site/core';

describe('FontFaceGenerator', () => {
  it('generates font face with eot', () => {
    const fonts: TCustomFont[] = [
      {
        name: 'Aeonik',
        weight: 400,
        style: 'normal',
        files: [
          {
            type: 'eot',
            url: 'link/to/font.eot'
          },
          {
            type: 'woff',
            url: 'link/to/font.woff'
          }
        ]
      },
      {
        name: 'Anek Odia',
        weight: 700,
        style: 'italic',
        files: [
          {
            type: 'woff',
            url: 'link/to/font.woff'
          },
          {
            type: 'ttf',
            url: 'link/to/font.ttf'
          }
        ]
      }
    ];
    const generator = new FontFaceGenerator(fonts);
    expect(generator.generate()).toEqual(`
@font-face {
  font-family: Aeonik;
  font-weight: 400;
  src: url('link/to/font.eot');
  src: url('link/to/font.woff') format('woff');
}

@font-face {
  font-family: Anek Odia;
  font-weight: 700;
  src: url('link/to/font.woff') format('woff'), url('link/to/font.ttf') format('truetype');
}`)
  });
});