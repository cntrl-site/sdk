import { FontFaceGenerator, getDeclaredFonts } from './FontFaceGenerator';
import { CustomFont, FontFileTypes } from '../types/project/Fonts';

describe('FontFaceGenerator', () => {
  it('generates font face with eot', () => {
    const fonts: CustomFont[] = [
      {
        name: 'Aeonik',
        weight: 400,
        style: 'normal',
        files: [
          {
            type: FontFileTypes.EOT,
            url: 'link/to/font.eot'
          },
          {
            type: FontFileTypes.WOFF,
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
            type: FontFileTypes.WOFF,
            url: 'link/to/font.woff'
          },
          {
            type: FontFileTypes.TTF,
            url: 'link/to/font.ttf'
          }
        ]
      }
    ];
    const generator = new FontFaceGenerator(fonts);
    expect(generator.generate()).toEqual(`
@font-face {
  font-family: "Aeonik";
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url('link/to/font.eot');
  src: url('link/to/font.woff') format('woff');
}

@font-face {
  font-family: "Anek Odia";
  font-weight: 700;
  font-style: italic;
  font-display: swap;
  src: url('link/to/font.woff') format('woff'), url('link/to/font.ttf') format('truetype');
}`)
  });

  it('declares a face with a weight range over it', () => {
    const generator = new FontFaceGenerator([{
      name: 'Inter',
      weight: 100,
      weightRange: [100, 900],
      style: 'normal',
      files: [{ type: FontFileTypes.WOFF2, url: 'link/to/inter.woff2' }]
    }]);
    expect(generator.generate()).toContain('font-weight: 100 900;');
  });
});

describe('getDeclaredFonts', () => {
  const file = (name: string) => [{ type: FontFileTypes.WOFF2, url: `link/to/${name}.woff2` }];
  const wght = { tag: 'wght', name: 'Weight', min: 300, max: 700, default: 400 };

  it('keeps custom fonts before the vault when nothing is variable', () => {
    const custom: CustomFont[] = [{ name: 'A', weight: 400, style: 'normal', files: file('a') }];
    const vault: CustomFont[] = [{ name: 'B', weight: 400, style: 'normal', files: file('b') }];
    expect(getDeclaredFonts(custom, vault)).toEqual([...custom, ...vault]);
  });

  it('declares a variable upload over its weight axis and drops the vault faces it covers', () => {
    const custom: CustomFont[] = [{
      name: 'Inter',
      weight: 400,
      style: 'normal',
      files: file('inter-var'),
      axes: [wght, { tag: 'opsz', name: 'Optical size', min: 14, max: 32, default: 14 }]
    }];
    const vault: CustomFont[] = [
      { name: 'Inter ', weight: 300, style: 'normal', files: file('inter-300') },
      { name: 'Inter', weight: 700, style: 'normal', files: file('inter-700') },
      { name: 'Inter', weight: 800, style: 'normal', files: file('inter-800') },
      { name: 'Inter', weight: 400, style: 'italic', files: file('inter-400i') },
      { name: 'Other', weight: 400, style: 'normal', files: file('other') }
    ];
    const declared = getDeclaredFonts(custom, vault);
    expect(declared.map(font => [font.name.trim(), font.weight, font.style, font.weightRange])).toEqual([
      ['Inter', 400, 'normal', [300, 700]],
      ['Inter', 800, 'normal', undefined],
      ['Inter', 400, 'italic', undefined],
      ['Other', 400, 'normal', undefined]
    ]);
  });

  it('leaves a weight axis without a range as a single weight', () => {
    const custom: CustomFont[] = [{
      name: 'Fixed',
      weight: 500,
      style: 'normal',
      files: file('fixed'),
      axes: [{ ...wght, min: 500, max: 500 }]
    }];
    expect(getDeclaredFonts(custom)[0].weightRange).toBeUndefined();
  });
});
