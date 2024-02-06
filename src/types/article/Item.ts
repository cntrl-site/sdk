import { RichTextBlock, RichTextStyle, TextAlign, TextDecoration, TextTransform, VerticalAlign } from './RichText';
import { ArticleItemType } from './ArticleItemType';
import { ItemArea } from './ItemArea';
import { ItemState } from './ItemState';

export type ItemAny = Item<ArticleItemType>;

export interface Item<T extends ArticleItemType> {
  id: string;
  type: T;
  area: Record<LayoutIdentifier, ItemArea>;
  hidden: Record<LayoutIdentifier, boolean>;
  link?: Link;
  items?: T extends ArticleItemType.Group ? ItemAny[] : never;
  sticky: Record<LayoutIdentifier, StickyParams | null>;
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
}

interface MediaCommonParams {
  url: string;
}

interface FXCursor {
  type: 'mouse' | 'manual';
  x: number;
  y: number;
}

interface VideoCommonParams extends MediaCommonParams {}

interface ImageCommonParams extends MediaCommonParams {
  hasGLEffect?: boolean;
  fragmentShader?: string;
  FXCursor?: FXCursor;
}

interface RichTextCommonParams {
  text: string;
  blocks?: RichTextBlock[];
}

interface RectangleCommonParams {
  ratioLock: boolean;
}

interface CustomCommonParams {
  name: string;
}

interface GroupCommonParams {}

interface VimeoEmbedCommonParams {
  play: 'on-hover' | 'on-click' | 'auto';
  controls: boolean;
  loop: boolean;
  muted: boolean;
  pictureInPicture: boolean;
  url: string;
}

interface YoutubeEmbedCommonParams {
  play: 'on-hover' | 'on-click' | 'auto';
  controls: boolean;
  loop: boolean;
  url: string;
}

interface MediaLayoutParams {
  opacity: number;
  radius: number;
  strokeWidth: number;
  strokeColor: string;
  blur: number;
}

interface CustomLayoutParams {}

interface GroupLayoutParams {
  opacity: number;
}

interface VimeoEmbedLayoutParams {
  radius: number;
  blur: number;
}

interface YoutubeEmbedLayoutParams {
  radius: number;
  blur: number;
}

interface ImageLayoutParams extends MediaLayoutParams {}

interface VideoLayoutParams extends MediaLayoutParams {
  autoplay: boolean;
  scrollPlayback: ScrollPlaybackParams | null;
}

interface RichTextLayoutParams {
  rangeStyles?: RichTextStyle[];
  textAlign: TextAlign;
  sizing: string;
  blur: number;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  wordSpacing: number;
  textTransform: TextTransform;
  verticalAlign: VerticalAlign;
  color: string;
  typeFace: string;
  fontStyle: string;
  fontWeight: number;
  textDecoration: TextDecoration;
  fontVariant: string;
}

interface RectangleLayoutParams {
  radius: number;
  strokeWidth: number;
  fillColor: string;
  strokeColor: string;
  blur: number;
  backdropBlur: number;
  blurMode: 'default' | 'backdrop';
}

export interface ScrollPlaybackParams {
  from: number;
  to: number;
}

export interface StickyParams {
  from: number;
  to?: number;
}

export interface Link {
  url: string;
  target: string;
}

type LayoutIdentifier = string;

export type VideoItem = Item<ArticleItemType.Video>;
export type RectangleItem = Item<ArticleItemType.Rectangle>;
export type ImageItem = Item<ArticleItemType.Image>;
export type RichTextItem = Item<ArticleItemType.RichText>;
export type VimeoEmbedItem = Item<ArticleItemType.VimeoEmbed>;
export type YoutubeEmbedItem = Item<ArticleItemType.YoutubeEmbed>;
export type CustomItem = Item<ArticleItemType.Custom>;
export type GroupItem = Item<ArticleItemType.Group>;
