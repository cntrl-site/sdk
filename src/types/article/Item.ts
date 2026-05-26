import { ArticleItemType } from './ArticleItemType';
import { ItemArea } from './ItemArea';
import { ItemState } from './ItemState';
import { CompoundSettings } from './CompoundSettings';
import {
  StickyParams,
  Link,
  ImageCommonParams,
  VideoCommonParams,
  RichTextCommonParams,
  RectangleCommonParams,
  VimeoEmbedCommonParams,
  YoutubeEmbedCommonParams,
  CustomCommonParams,
  GroupCommonParams,
  CompoundCommonParams,
  CodeEmbedCommonParams,
  ComponentCommonParams,
  ImageLayoutParams,
  VideoLayoutParams,
  RichTextLayoutParams,
  RectangleLayoutParams,
  VimeoEmbedLayoutParams,
  YoutubeEmbedLayoutParams,
  CustomLayoutParams,
  GroupLayoutParams,
  CompoundLayoutParams,
  CodeEmbedLayoutParams,
  ComponentLayoutParams,
} from './Params.type';

export type ItemAny = Item<ArticleItemType>;

type LayoutIdentifier = string;

export interface Item<T extends ArticleItemType> {
  id: string;
  type: T;
  area: Record<LayoutIdentifier, ItemArea>;
  hidden: Record<LayoutIdentifier, boolean>;
  link?: Link;
  items?: T extends (ArticleItemType.Group | ArticleItemType.Compound) ? ItemAny[] : never;
  sticky: Record<LayoutIdentifier, StickyParams | null>;
  compoundSettings?: Record<LayoutIdentifier, CompoundSettings>;
  commonParams: ItemCommonParamsMap[T];
  state: ItemState<T>;
  layoutParams: Record<LayoutIdentifier, ItemLayoutParamsMap[T]>;
}

export interface ItemCommonParamsMap {
  [ArticleItemType.Image]: ImageCommonParams;
  [ArticleItemType.Video]: VideoCommonParams;
  [ArticleItemType.RichText]: RichTextCommonParams;
  [ArticleItemType.Rectangle]: RectangleCommonParams;
  [ArticleItemType.VimeoEmbed]: VimeoEmbedCommonParams;
  [ArticleItemType.YoutubeEmbed]: YoutubeEmbedCommonParams;
  [ArticleItemType.Custom]: CustomCommonParams;
  [ArticleItemType.Group]: GroupCommonParams;
  [ArticleItemType.Compound]: CompoundCommonParams;
  [ArticleItemType.CodeEmbed]: CodeEmbedCommonParams
  [ArticleItemType.Component]: ComponentCommonParams;
}

export interface ItemLayoutParamsMap {
  [ArticleItemType.Image]: ImageLayoutParams;
  [ArticleItemType.Video]: VideoLayoutParams;
  [ArticleItemType.RichText]: RichTextLayoutParams;
  [ArticleItemType.Rectangle]: RectangleLayoutParams;
  [ArticleItemType.VimeoEmbed]: VimeoEmbedLayoutParams;
  [ArticleItemType.YoutubeEmbed]: YoutubeEmbedLayoutParams;
  [ArticleItemType.Custom]: CustomLayoutParams;
  [ArticleItemType.Group]: GroupLayoutParams;
  [ArticleItemType.Compound]: CompoundLayoutParams;
  [ArticleItemType.CodeEmbed]: CodeEmbedLayoutParams;
  [ArticleItemType.Component]: ComponentLayoutParams;
}

export type VideoItem = Item<ArticleItemType.Video>;
export type RectangleItem = Item<ArticleItemType.Rectangle>;
export type ImageItem = Item<ArticleItemType.Image>;
export type RichTextItem = Item<ArticleItemType.RichText>;
export type VimeoEmbedItem = Item<ArticleItemType.VimeoEmbed>;
export type YoutubeEmbedItem = Item<ArticleItemType.YoutubeEmbed>;
export type CustomItem = Item<ArticleItemType.Custom>;
export type GroupItem = Item<ArticleItemType.Group>;
export type CodeEmbedItem = Item<ArticleItemType.CodeEmbed>;
export type CompoundItem = Item<ArticleItemType.Compound>;
export type ComponentItem = Item<ArticleItemType.Component>;
