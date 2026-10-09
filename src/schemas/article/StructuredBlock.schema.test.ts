import { SectionSchema } from './Section.schema';
import { StructuredBlockSchema } from './StructuredBlock.schema';
import { StructuredBlockType } from '../../types/article/StructuredBlockType';

// blocks as the API serves them: drawn on the content grid, with the styles their text is set in
const text = {
  typeFace: 'Arial',
  fontSize: 0.0118,
  lineHeight: 0.0174,
  letterSpacing: 0,
  wordSpacing: 0,
  fontWeight: 400,
  fontStyle: 'normal',
  fontVariant: 'normal',
  textTransform: 'none',
  verticalAlign: 'unset',
  textAlign: 'center',
  color: '#000000'
};

const onGrid = (zIndex: number) => ({
  desktop: { paddingTop: 0, zIndex, left: 0.35, width: 0.3, innerPaddingTop: 0.0069, innerPaddingBottom: 0.0076 }
});

const block = (type: StructuredBlockType, id: string, commonParams: object, layoutParams: object) => ({
  id,
  type,
  area: onGrid(1),
  hidden: {},
  state: {},
  commonParams,
  layoutParams: { desktop: layoutParams }
});

const paragraph = (text: string) => [{ start: 0, end: text.length - 1, type: 'unstyled', entities: [] }];

const richText = block(StructuredBlockType.RichText, 'text', {
  text: 'Read the post\n',
  blocks: [{
    start: 0,
    end: 13,
    type: 'unstyled',
    entities: [{ start: 9, end: 13, type: 'LINK', data: { target: '_blank', url: 'https://cntrl.site' } }]
  }]
}, { ...text, rangeStyles: [{ start: 0, end: 4, style: 'COLOR', value: '#112233' }], columns: 2, columnGap: 0.0139, hyphens: 'auto' });

const quote = block(StructuredBlockType.Quote, 'quote', {
  text: 'A quote\n',
  kind: 'boxed',
  blocks: paragraph('A quote\n')
}, { ...text, fontStyle: 'italic', rangeStyles: [], background: 'oklch(0.95 0 0 / 1)', boxPadding: 0.0278, boxRadius: 0.0111 });

const date = block(StructuredBlockType.Date, 'date', {
  date: '2026-09-23',
  format: 'D MMM YYYY',
  text: '23 Sep 2026\n',
  blocks: paragraph('23 Sep 2026\n')
}, { ...text, rangeStyles: [{ start: 3, end: 6, style: 'FONTWEIGHT', value: '700' }] });

const gallery = block(StructuredBlockType.Image, 'gallery', {
  urls: ['https://cdn.cntrl.site/a.jpg', 'https://cdn.cntrl.site/b.jpg'],
  altText: '',
  caption: 'Two views'
}, { opacity: 1, captionStyles: { ...text, fontSize: 0.0069, color: '#E6E6E6' } });

const headerImage = block(StructuredBlockType.HeaderImage, 'header-image', {
  url: 'https://cdn.cntrl.site/header.jpg',
  altText: ''
}, { opacity: 1 });

const video = block(StructuredBlockType.Video, 'video', {
  url: 'https://cdn.cntrl.site/clip.mp4',
  coverUrl: null
}, { play: 'auto', muted: true, controls: false });

const code = block(StructuredBlockType.Code, 'code', {
  code: 'const a = 1;\n',
  language: 'typescript',
  theme: 'dracula',
  lines: [
    [{ content: 'const', color: '#FF79C6', fontStyle: 0 }, { content: ' a = 1;', color: '#F8F8F2', fontStyle: 0 }],
    []
  ],
  colors: { background: '#282A36', foreground: '#F8F8F2' }
}, {});

const divider = {
  ...block(StructuredBlockType.Divider, 'divider', {}, { color: 'oklch(57.61% 0 90 / 1)' }),
  area: { desktop: { paddingTop: 0.01, zIndex: 9, left: 0.35, width: 0.3, height: 0.0007, innerPaddingTop: 0, innerPaddingBottom: 0 } }
};

const header = {
  id: 'header',
  type: StructuredBlockType.Header,
  area: { desktop: { zIndex: 11 } },
  hidden: {},
  state: {},
  commonParams: { title: 'text', subtitle: 'quote', date: 'date', image: 'header-image' },
  layoutParams: {
    desktop: { variant: 'A', order: ['image', 'subtitle', 'title', 'date'], hiddenElements: [], imageFit: 'cover', coverHeight: 0.8 }
  }
};

const served = [richText, quote, date, gallery, headerImage, video, code, divider];

function section(structuredContent: object[], extra: object = {}) {
  return {
    id: 'content',
    items: [],
    position: {},
    minHeight: { desktop: { mode: 'control-units', units: 1 } },
    color: { desktop: null },
    hidden: {},
    structuredContent,
    type: 'content-based',
    structuredContentSettings: { paddingBottom: { desktop: 0 }, defaultWidth: { desktop: 0.3 } },
    ...extra
  };
}

describe('StructuredBlockSchema', () => {
  it.each(served.map(served => [served.type, served]))('keeps all of a %s as it is served', (_, served) => {
    expect(StructuredBlockSchema.parse(served)).toEqual(served);
  });

  it('keeps a content-based section\'s header beside its stack', () => {
    const served = section([richText, quote, date, headerImage], { header });
    expect(SectionSchema.parse(served)).toEqual(served);
  });

  it('takes a section without a header', () => {
    expect(SectionSchema.parse(section([richText]))).not.toHaveProperty('header');
  });

  it('rejects a text block served without the styles of its text', () => {
    const { typeFace, ...unstyled } = text;
    expect(StructuredBlockSchema.safeParse({ ...richText, layoutParams: { desktop: { ...unstyled, rangeStyles: [] } } }).success).toBe(false);
  });
});
