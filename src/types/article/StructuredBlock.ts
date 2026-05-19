import { RichTextBlock, RichTextStyle } from './RichText';
import { ItemState } from './ItemState';
import { StructuredBlockType } from './StructuredBlockType';
import { ComponentLayoutParams, MediaCommonParams, MediaLayoutParams, VimeoEmbedCommonParams, VimeoEmbedLayoutParams, YoutubeEmbedCommonParams, YoutubeEmbedLayoutParams } from './Item';

type LayoutIdentifier = string;

export interface StructuredBlockArea {
  width?: number;
  height?: number;
  paddingTop?: number;
  zIndex: number;
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

export interface StructuredBlockRichTextLayoutParams {
  rangeStyles: RichTextStyle[];
}

export interface StructuredBlockImageCommonParams extends MediaCommonParams {
  altText: string;
  caption?: string;
}

export interface StructuredBlockLayoutParamsMap {
  [StructuredBlockType.Component]: ComponentLayoutParams;
  [StructuredBlockType.RichText]: StructuredBlockRichTextLayoutParams;
  [StructuredBlockType.Image]: MediaLayoutParams;
  [StructuredBlockType.VimeoEmbed]: VimeoEmbedLayoutParams;
  [StructuredBlockType.YoutubeEmbed]: YoutubeEmbedLayoutParams;
}

export interface StructuredBlockCommonParamsMap {
  [StructuredBlockType.Component]: StructuredBlockComponentCommonParams;
  [StructuredBlockType.RichText]: StructuredBlockRichTextCommonParams;
  [StructuredBlockType.Image]: StructuredBlockImageCommonParams;
  [StructuredBlockType.VimeoEmbed]: VimeoEmbedCommonParams;
  [StructuredBlockType.YoutubeEmbed]: YoutubeEmbedCommonParams;
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
