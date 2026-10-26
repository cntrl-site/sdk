import { HeadingTag, Hyphens, RichTextBlock, RichTextStyle, TextAlign, TextTransform, VerticalAlign } from './RichText';
import { ItemState } from './ItemState';
import { StructuredBlockType } from './StructuredBlockType';
import { ComponentLayoutParams, RichTextLayoutParams, VimeoEmbedCommonParams, VimeoEmbedLayoutParams, YoutubeEmbedCommonParams, YoutubeEmbedLayoutParams } from './Params.type';

type LayoutIdentifier = string;

export interface StructuredBlockArea {
  width?: number;
  height?: number;
  /**
   * The gap above the block, or above a section header. A content-based section draws its stack's
   * blocks with none, whatever they hold; a default section's blocks keep theirs.
   */
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

/** How a block's text is set on a layout, resolved from what it was drawn with in the editor: the type a rich text item carries. */
export type StructuredBlockTextStyles = Pick<
  RichTextLayoutParams,
  'typeFace' | 'fontSize' | 'lineHeight' | 'letterSpacing' | 'wordSpacing' | 'fontWeight' | 'fontStyle' | 'fontVariant'
  | 'textTransform' | 'verticalAlign' | 'textAlign' | 'color'
>;

export interface StructuredBlockComponentCommonParams {
  componentId: string;
  content?: any;
  parameters?: Record<string, any>;
}

/** The text of a text block, a quote, a date or a table cell. */
interface StructuredBlockTextCommonParams {
  text: string;
  blocks: RichTextBlock[];
}

export interface StructuredBlockRichTextCommonParams extends StructuredBlockTextCommonParams {
  /** The tag the text is a heading in: for now the API gives text in the Title preset the page's h1. */
  heading?: HeadingTag;
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

export interface StructuredBlockQuoteCommonParams extends StructuredBlockTextCommonParams {
  kind: string;
}

/** A quote's text is drawn in a box, inset on each side and rounded: absent where its kind draws none. */
export interface StructuredBlockQuoteLayoutParams extends StructuredBlockRichTextLayoutParams {
  background?: string;
  boxPaddingTop?: number;
  boxPaddingRight?: number;
  boxPaddingBottom?: number;
  boxPaddingLeft?: number;
  boxRadius?: number;
}

/** A date comes as the text it reads as, its day, month and year styled as ranges of it. */
export interface StructuredBlockDateCommonParams extends StructuredBlockTextCommonParams {
  /** YYYY-MM-DD */
  date: string;
  format: string;
}

/**
 * An image's caption, and whether it is switched on: an image whose caption button was never
 * pressed shows any caption it has. The API serves only the captions to draw; `getShownCaption`
 * gives a site the same answer from either.
 */
interface ImageCaptionParams {
  caption?: string;
  showCaption?: boolean;
}

/** A gallery of one image or more. */
export interface StructuredBlockImageCommonParams extends ImageCaptionParams {
  urls: string[];
  altText: string;
}

export interface StructuredBlockImageLayoutParams {
  opacity: number;
  /** Set where the image has a caption. */
  captionStyles?: StructuredBlockTextStyles;
}

/** A section header's key image: the url is empty until an image is uploaded. */
export interface StructuredBlockHeaderImageCommonParams extends ImageCaptionParams {
  url: string;
  altText: string;
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
  /** Bits: 1 italic, 2 bold, 4 underline, 8 strikethrough. */
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

export const TABLE_KINDS = ['cells', 'rows', 'lines'] as const;

/**
 * What a table draws: `cells` a heading row over a grid of lines; `rows` every row plain, the two
 * fills alternating from the first; `lines` a heading row and a line between each pair of rows,
 * nothing vertical and nothing around.
 */
export type TableKind = typeof TABLE_KINDS[number];

/**
 * One cell of a table: rich text as a text block holds it, its paragraphs with their links, and
 * the styles of its ranges on every layout the site is served, the colours resolved. The styles
 * are kept with the cell, not in the table's layout params, as the editor keeps them: a cell
 * comes and goes with its row or column.
 */
export interface StructuredBlockTableCell extends StructuredBlockTextCommonParams {
  id: string;
  styles: Record<LayoutIdentifier, RichTextStyle[]>;
}

/** A heading row and the body rows under it, every row as long as the heading. */
export interface StructuredBlockTableCommonParams {
  kind: TableKind;
  header: StructuredBlockTableCell[];
  rows: StructuredBlockTableCell[][];
}

/** One column of a table: its share of the table's width, the shares summing to one, and the space inside its cells on either side as a share of the layout width. */
export interface StructuredBlockTableColumn {
  width: number;
  paddingLeft: number;
  paddingRight: number;
}

/**
 * A table's cells, set in the text styles they are served with and spaced inside above and below,
 * as shares of the layout width; its columns; the colour of the lines between the cells, and the
 * two fills -- the heading row's and the body's, or every other row's -- absent where there is none.
 */
export interface StructuredBlockTableLayoutParams extends StructuredBlockTextStyles {
  cellPaddingTop: number;
  cellPaddingBottom: number;
  columns: StructuredBlockTableColumn[];
  borderColor?: string;
  headingBackground?: string;
  bodyBackground?: string;
}

export const HEADER_ELEMENT_KINDS = ['image', 'subtitle', 'title', 'date'] as const;

export type HeaderElementKind = typeof HEADER_ELEMENT_KINDS[number];

/** The ids of the blocks a section header draws, one per element: they are blocks of the section's structured content. */
export type StructuredBlockHeaderCommonParams = Record<HeaderElementKind, string>;

/**
 * 'A' draws the key image behind the other elements, anchored to its bottom; 'B' draws every element
 * in order. A variant A image either keeps its proportions or covers a header `coverHeight` of the
 * viewport's height tall, and with `stickyImage` stays put on the screen while the header scrolls
 * over it, as a section's fixed background does; absent, it scrolls with the header.
 */
export interface StructuredBlockHeaderLayoutParams {
  variant: 'A' | 'B';
  order: HeaderElementKind[];
  hiddenElements: HeaderElementKind[];
  imageFit: 'original' | 'cover';
  coverHeight: number;
  stickyImage?: boolean;
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
  [StructuredBlockType.Table]: StructuredBlockTableLayoutParams;
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
  [StructuredBlockType.Table]: StructuredBlockTableCommonParams;
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

/** The block types a section's stack holds: every type but the header, which is the section's own and points at blocks of the stack. */
export type StackBlockType = Exclude<StructuredBlockType, StructuredBlockType.Header>;

export type StructuredBlockAny = StructuredBlock<StackBlockType>;

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
export type TableStructuredBlock = StructuredBlock<StructuredBlockType.Table>;
