import { FXControlAny } from './FX';
import { AreaAnchor } from './ItemArea';
import { RichTextBlock, RichTextStyle, TextAlign, TextTransform, VerticalAlign } from './RichText';

interface CommonParamsBase {
  pointerEvents?: 'never' | 'when_visible' | 'always';
}

export interface MediaCommonParams extends CommonParamsBase {
  url: string;
  hasGLEffect?: boolean;
  fragmentShader: string | null;
  FXControls?: FXControlAny[];
  FXTextures?: string[];
}

export interface VideoCommonParams extends MediaCommonParams {
  coverUrl: string | null;
  scrollPlaybackFrameData?: ScrollPlaybackFrameData | null;
}

export interface ImageCommonParams extends MediaCommonParams {}

export interface RichTextCommonParams extends CommonParamsBase {
  text: string;
  blocks?: RichTextBlock[];
}

export interface RectangleCommonParams extends CommonParamsBase {
  ratioLock: boolean;
}

export interface CustomCommonParams extends CommonParamsBase {
  name: string;
}

export interface GroupCommonParams extends CommonParamsBase {}

export interface CompoundCommonParams extends CommonParamsBase {
  overflow: 'hidden' | 'visible';
}

export interface CodeEmbedCommonParams extends CommonParamsBase {
  html: string;
  scale: boolean;
  iframe: boolean;
}

export interface VimeoEmbedCommonParams extends CommonParamsBase {
  url: string;
  coverUrl: string | null;
}

export interface YoutubeEmbedCommonParams extends CommonParamsBase {
  url: string;
  coverUrl: string | null;
}

export interface ComponentCommonParams extends CommonParamsBase {
  componentId: string;
  content?: any;
  parameters?: Record<string, any>;
}

export interface MediaLayoutParams {
  opacity: number;
  radius: number;
  strokeWidth: number;
  strokeFill: FillLayer[];
  blur: number;
  isDraggable?: boolean;
  blendMode?: string;
}

export interface CustomLayoutParams {
  isDraggable?: boolean;
  blendMode?: string;
}

export interface GroupLayoutParams {
  opacity: number;
  blur: number;
  isDraggable?: boolean;
  blendMode?: string;
}

export interface CompoundLayoutParams {
  opacity: number;
  isDraggable?: boolean;
  blendMode?: string;
}

export interface CodeEmbedLayoutParams {
  areaAnchor: AreaAnchor;
  opacity: number;
  blur: number;
  isDraggable?: boolean;
  blendMode?: string;
}

export interface VimeoEmbedLayoutParams {
  play: 'on-hover' | 'on-click' | 'auto';
  controls: boolean;
  loop: boolean;
  muted: boolean;
  pictureInPicture: boolean;
  radius: number;
  blur: number;
  opacity: number;
  blendMode?: string;
}

export interface YoutubeEmbedLayoutParams {
  play: 'on-hover' | 'on-click' | 'auto';
  controls: boolean;
  loop: boolean;
  radius: number;
  blur: number;
  opacity: number;
  blendMode?: string;
}

export interface ImageLayoutParams extends MediaLayoutParams {}

export interface VideoLayoutParams extends MediaLayoutParams {
  play: 'on-hover' | 'on-click' | 'auto';
  muted: boolean;
  controls: boolean;
  scrollPlayback: ScrollPlaybackParams | null;
}

export interface RichTextLayoutParams {
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
  blendMode?: string;
}

export interface RectangleLayoutParams {
  radius: number;
  strokeWidth: number;
  fill: FillLayer[];
  strokeFill: FillLayer[];
  blur: number;
  backdropBlur: number;
  blurMode: 'default' | 'backdrop';
  isDraggable?: boolean;
  blendMode?: string;
}

export type FillLayer = SolidFillLayer | LinearGradientFillLayer | RadialGradientFillLayer | ConicGradientFillLayer | ImageLayer;

type ColorPoint = {
  id: string;
  value: string;
  position: number;
}

export type SolidFillLayer = {
  id: string;
  type: 'solid';
  value: string;
};

export type LinearGradientFillLayer = {
  id: string;
  type: 'linear-gradient';
  colors: ColorPoint[];
  start: [number, number];
  end: [number, number];
  angle: number;
};

export type RadialGradientFillLayer = {
  id: string;
  type: 'radial-gradient';
  colors: ColorPoint[];
  diameter: number;
  center: [number, number];
  angle: number;
};

export type ConicGradientFillLayer = {
  id: string;
  type: 'conic-gradient';
  colors: ColorPoint[];
  center: [number, number];
  angle: number;
};

export type ImageLayer = {
  id: string;
  type: 'image';
  src: string;
  behavior: string;
  backgroundSize: number;
  opacity: number;
  rotation?: number;
};
export interface ScrollPlaybackParams {
  from: number;
  to: number;
}

export interface ScrollPlaybackFrameData {
  status: 'processing' | 'ready' | 'error';
  batchId?: string;
  frameCount?: number;
  frameRate?: number;
  framesUrl?: string;
  frameFormat?: string;
}

export interface StickyParams {
  from: number;
  to?: number;
}

export interface Link {
  url: string;
  target: string;
}

export interface ComponentLayoutParams {
  parameters?: any;
  opacity: number;
  sizing?: string;
  blur: number;
}
