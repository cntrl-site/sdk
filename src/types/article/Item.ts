import { RichTextBlock, RichTextStyle, TextAlign, TextTransform, VerticalAlign } from './RichText';
import { ArticleItemType } from './ArticleItemType';
import { AreaAnchor, ItemArea } from './ItemArea';
import { ItemState } from './ItemState';
import { FXControlAny, FXCursor } from './FX';
import { CompoundSettings } from './CompoundSettings';

export type ItemAny = Item<ArticleItemType>;

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
}

interface CommonParamsBase {
  pointerEvents?: 'never' | 'when_visible' | 'always';
}

interface MediaCommonParams extends CommonParamsBase {
  url: string;
  hasGLEffect?: boolean;
  fragmentShader: string | null;
  FXCursor: FXCursor | null;
  FXControls?: FXControlAny[];
}

interface VideoCommonParams extends MediaCommonParams {
  coverUrl: string | null;
}

interface ImageCommonParams extends MediaCommonParams {}

interface RichTextCommonParams extends CommonParamsBase {
  text: string;
  blocks?: RichTextBlock[];
}

interface RectangleCommonParams extends CommonParamsBase {
  ratioLock: boolean;
}

interface CustomCommonParams extends CommonParamsBase {
  name: string;
}

interface GroupCommonParams extends CommonParamsBase {}

interface CompoundCommonParams extends CommonParamsBase {
  overflow: 'hidden' | 'visible';
}

interface CodeEmbedCommonParams extends CommonParamsBase {
  html: string;
  scale: boolean;
  iframe: boolean;
}

interface VimeoEmbedCommonParams extends CommonParamsBase {
  play: 'on-hover' | 'on-click' | 'auto';
  controls: boolean;
  loop: boolean;
  muted: boolean;
  pictureInPicture: boolean;
  url: string;
  coverUrl: string | null;
}

interface YoutubeEmbedCommonParams extends CommonParamsBase {
  play: 'on-hover' | 'on-click' | 'auto';
  controls: boolean;
  loop: boolean;
  url: string;
  coverUrl: string | null;
}

interface MediaLayoutParams {
  opacity: number;
  radius: number;
  strokeWidth: number;
  strokeColor: string;
  blur: number;
  isDraggable?: boolean;
}

interface CustomLayoutParams {
  isDraggable?: boolean;
}

interface GroupLayoutParams {
  opacity: number;
  blur: number;
  isDraggable?: boolean;
}

interface CompoundLayoutParams {
  opacity: number;
  isDraggable?: boolean;
}

interface CodeEmbedLayoutParams {
  areaAnchor: AreaAnchor;
  opacity: number;
  blur: number;
  isDraggable?: boolean;
}

interface VimeoEmbedLayoutParams {
  radius: number;
  blur: number;
  opacity: number;
}

interface YoutubeEmbedLayoutParams {
  radius: number;
  blur: number;
  opacity: number;
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
  fontVariant: string;
  isDraggable?: boolean;
}

interface RectangleLayoutParams {
  radius: number;
  strokeWidth: number;
  fillColor: string;
  strokeColor: string;
  blur: number;
  backdropBlur: number;
  blurMode: 'default' | 'backdrop';
  isDraggable?: boolean;
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
export type CodeEmbedItem = Item<ArticleItemType.CodeEmbed>;
export type CompoundItem = Item<ArticleItemType.Compound>;
