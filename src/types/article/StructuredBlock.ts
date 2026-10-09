import { Hyphens, RichTextBlock, RichTextStyle, TextAlign, TextTransform, VerticalAlign } from './RichText';
import { ItemState } from './ItemState';
import { StructuredBlockType } from './StructuredBlockType';
import { ComponentLayoutParams, VimeoEmbedCommonParams, VimeoEmbedLayoutParams, YoutubeEmbedCommonParams, YoutubeEmbedLayoutParams } from './Params.type';

type LayoutIdentifier = string;

export interface StructuredBlockArea {
  width?: number;
  height?: number;
  /** The gap above the block. */
  paddingTop?: number;
  zIndex: number;
  alignment?: 'left' | 'center' | 'right';
  horizontalOffset?: number;
  /** Where a block drawn on the content grid starts, as a share of the layout width. */
  left?: number;
  /** The space inside a block drawn on the content grid, above and below what it shows. */
  innerPaddingTop?: number;
  innerPaddingBottom?: number;
}

/** How a block's text is set on a layout, resolved from what it was drawn with in the editor. */
export interface StructuredBlockTextStyles {
  typeFace: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  wordSpacing: number;
  fontWeight: number;
  fontStyle: string;
  fontVariant: string;
  textTransform: TextTransform;
  verticalAlign: VerticalAlign;
  textAlign: TextAlign;
  color: string;
}

export interface StructuredBlockComponentCommonParams {
  componentId: string;
  content?: any;
  parameters?: Record<string, any>;
}

export interface StructuredBlockRichTextCommonParams {
  text: string;
  blocks?: RichTextBlock[];
}

export interface StructuredBlockRichTextLayoutParams extends StructuredBlockTextStyles {
  rangeStyles: RichTextStyle[];
  /**
   * The columns a text block of the stack flows its text in, the gap between them as a share of the
   * layout width, and whether its lines hyphenate. Absent on a quote's, a date's or a header's text.
   */
  columns?: number;
  columnGap?: number;
  hyphens?: Hyphens;
}

export interface StructuredBlockQuoteCommonParams extends StructuredBlockRichTextCommonParams {
  kind: string;
}

/** A quote's text is drawn in a box: absent where its kind draws none. */
export interface StructuredBlockQuoteLayoutParams extends StructuredBlockRichTextLayoutParams {
  background?: string;
  boxPadding?: number;
  boxRadius?: number;
}

/** A date comes as the text it reads as, its day, month and year styled as ranges of it. */
export interface StructuredBlockDateCommonParams extends StructuredBlockRichTextCommonParams {
  /** YYYY-MM-DD */
  date: string;
  format: string;
}

/** A gallery of one image or more. */
export interface StructuredBlockImageCommonParams {
  urls: string[];
  altText: string;
  caption?: string;
}

export interface StructuredBlockImageLayoutParams {
  opacity: number;
  /** Set where the image has a caption. */
  captionStyles?: StructuredBlockTextStyles;
}

/** A section header's key image: the url is empty until an image is uploaded. */
export interface StructuredBlockHeaderImageCommonParams {
  url: string;
  altText: string;
  caption?: string;
}

export interface StructuredBlockVideoCommonParams {
  url: string;
  coverUrl: string | null;
}

export interface StructuredBlockVideoLayoutParams {
  play: 'on-hover' | 'on-click' | 'auto';
  muted: boolean;
  controls: boolean;
}

export interface StructuredBlockDividerCommonParams {}

/** A divider is a line as tall as its area's `height`. */
export interface StructuredBlockDividerLayoutParams {
  color: string;
}

export interface CodeToken {
  content: string;
  color?: string;
  /** Bits: 1 italic, 2 bold, 4 underline. */
  fontStyle?: number;
}

/** The colours of the box the code is drawn in. */
export interface CodeColors {
  background: string;
  foreground: string;
}

/**
 * `language` and `theme` are shiki ids. The code comes coloured in its theme, as lines of tokens;
 * plain, and without `colors`, where the theme could not be loaded.
 */
export interface StructuredBlockCodeCommonParams {
  code: string;
  language: string;
  theme: string;
  lines: CodeToken[][];
  colors?: CodeColors;
}

export interface StructuredBlockCodeLayoutParams {}

export type HeaderElementKind = 'image' | 'subtitle' | 'title' | 'date';

/** The ids of the blocks a section header draws: they are blocks of the section's structured content. */
export interface StructuredBlockHeaderCommonParams {
  title: string;
  subtitle: string;
  date: string;
  image: string;
}

/**
 * 'A' draws the key image behind the other elements, anchored to its bottom; 'B' draws every element
 * in order. A variant A image either keeps its proportions or covers a header `coverHeight` of the
 * viewport's height tall.
 */
export interface StructuredBlockHeaderLayoutParams {
  variant: 'A' | 'B';
  order: HeaderElementKind[];
  hiddenElements: HeaderElementKind[];
  imageFit: 'original' | 'cover';
  coverHeight: number;
}

export interface StructuredBlockLayoutParamsMap {
  [StructuredBlockType.Component]: ComponentLayoutParams;
  [StructuredBlockType.RichText]: StructuredBlockRichTextLayoutParams;
  [StructuredBlockType.Image]: StructuredBlockImageLayoutParams;
  [StructuredBlockType.VimeoEmbed]: VimeoEmbedLayoutParams;
  [StructuredBlockType.YoutubeEmbed]: YoutubeEmbedLayoutParams;
  [StructuredBlockType.Divider]: StructuredBlockDividerLayoutParams;
  [StructuredBlockType.Date]: StructuredBlockRichTextLayoutParams;
  [StructuredBlockType.Header]: StructuredBlockHeaderLayoutParams;
  [StructuredBlockType.HeaderImage]: StructuredBlockImageLayoutParams;
  [StructuredBlockType.Video]: StructuredBlockVideoLayoutParams;
  [StructuredBlockType.Quote]: StructuredBlockQuoteLayoutParams;
  [StructuredBlockType.Code]: StructuredBlockCodeLayoutParams;
}

export interface StructuredBlockCommonParamsMap {
  [StructuredBlockType.Component]: StructuredBlockComponentCommonParams;
  [StructuredBlockType.RichText]: StructuredBlockRichTextCommonParams;
  [StructuredBlockType.Image]: StructuredBlockImageCommonParams;
  [StructuredBlockType.VimeoEmbed]: VimeoEmbedCommonParams;
  [StructuredBlockType.YoutubeEmbed]: YoutubeEmbedCommonParams;
  [StructuredBlockType.Divider]: StructuredBlockDividerCommonParams;
  [StructuredBlockType.Date]: StructuredBlockDateCommonParams;
  [StructuredBlockType.Header]: StructuredBlockHeaderCommonParams;
  [StructuredBlockType.HeaderImage]: StructuredBlockHeaderImageCommonParams;
  [StructuredBlockType.Video]: StructuredBlockVideoCommonParams;
  [StructuredBlockType.Quote]: StructuredBlockQuoteCommonParams;
  [StructuredBlockType.Code]: StructuredBlockCodeCommonParams;
}

export interface StructuredBlock<T extends StructuredBlockType> {
  id: string;
  type: T;
  label?: string | null;
  area: Record<LayoutIdentifier, StructuredBlockArea>;
  layoutParams: Record<LayoutIdentifier, StructuredBlockLayoutParamsMap[T]>;
  commonParams: StructuredBlockCommonParamsMap[T];
  hidden?: Record<LayoutIdentifier, boolean>;
  state: ItemState<T>;
}

export type StructuredBlockAny = StructuredBlock<StructuredBlockType>;

export type ComponentStructuredBlock = StructuredBlock<StructuredBlockType.Component>;
export type RichTextStructuredBlock = StructuredBlock<StructuredBlockType.RichText>;
export type ImageStructuredBlock = StructuredBlock<StructuredBlockType.Image>;
export type VimeoEmbedStructuredBlock = StructuredBlock<StructuredBlockType.VimeoEmbed>;
export type YoutubeEmbedStructuredBlock = StructuredBlock<StructuredBlockType.YoutubeEmbed>;
export type DividerStructuredBlock = StructuredBlock<StructuredBlockType.Divider>;
export type DateStructuredBlock = StructuredBlock<StructuredBlockType.Date>;
export type HeaderStructuredBlock = StructuredBlock<StructuredBlockType.Header>;
export type HeaderImageStructuredBlock = StructuredBlock<StructuredBlockType.HeaderImage>;
export type VideoStructuredBlock = StructuredBlock<StructuredBlockType.Video>;
export type QuoteStructuredBlock = StructuredBlock<StructuredBlockType.Quote>;
export type CodeStructuredBlock = StructuredBlock<StructuredBlockType.Code>;
