import { ArticleItemType } from './ArticleItemType';

type LayoutId = string;
type StateId = string;

export type ItemState<T extends ArticleItemType> = Record<StateId, Record<LayoutId, ItemStatesMap[T]>>;

export type ItemStateParams = ItemStatesMap[ArticleItemType];

export interface ItemStatesMap {
  [ArticleItemType.Image]: MediaStateParams;
  [ArticleItemType.Video]: MediaStateParams;
  [ArticleItemType.RichText]: RichTextStateParams;
  [ArticleItemType.Rectangle]: RectangleStateParams;
  [ArticleItemType.VimeoEmbed]: VideoEmbedStateParams;
  [ArticleItemType.YoutubeEmbed]: VideoEmbedStateParams;
  [ArticleItemType.Custom]: CustomItemStateParams;
  [ArticleItemType.Group]: GroupStateParams;
  [ArticleItemType.CodeEmbed]: CodeEmbedStateParams;
}

export interface StateParams<T> {
  timing: string;
  duration: number;
  delay: number;
  value: T;
}

interface ItemStatesBaseMap {
  width?: StateParams<number>;
  height?: StateParams<number>;
  angle?: StateParams<number>;
  top?: StateParams<number>;
  left?: StateParams<number>;
  scale?: StateParams<number>;
  blur?: StateParams<number>;
}

export interface MediaStateParams extends ItemStatesBaseMap {
  opacity?: StateParams<number>;
  radius?: StateParams<number>;
  strokeWidth?: StateParams<number>;
  strokeColor?: StateParams<string>;
}

export interface RichTextStateParams extends ItemStatesBaseMap {
  color?: StateParams<string>;
  letterSpacing?: StateParams<number>;
  wordSpacing?: StateParams<number>;
}

export interface RectangleStateParams extends ItemStatesBaseMap {
  radius?: StateParams<number>;
  strokeWidth?: StateParams<number>;
  fillColor?: StateParams<string>;
  strokeColor?: StateParams<string>;
  backdropBlur?: StateParams<number>;
}

export interface VideoEmbedStateParams extends ItemStatesBaseMap {
  radius?: StateParams<number>;
  opacity?: StateParams<number>;
}

export interface CustomItemStateParams extends ItemStatesBaseMap {}

export interface GroupStateParams extends ItemStatesBaseMap {
  opacity?: StateParams<number>;
}

export interface CodeEmbedStateParams extends ItemStatesBaseMap {
  opacity?: StateParams<number>;
}
