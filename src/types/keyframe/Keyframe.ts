export type KeyframeAny = Keyframe<KeyframeType>;

export interface Keyframe<T extends KeyframeType> {
  id: string;
  type: T;
  layoutId: string;
  itemId: string;
  position: number;
  value: KeyframeValueMap[T];
}

export enum KeyframeType {
  Dimensions = 'dimensions',
  Position = 'position',
  Rotation = 'rotation',
  BorderRadius = 'border-radius',
  BorderWidth = 'border-width',
  Color = 'color',
  BorderColor = 'border-color',
  Opacity = 'opacity',
  Scale = 'scale',
  TextColor = 'text-color',
  LetterSpacing = 'letter-spacing',
  WordSpacing = 'word-spacing',
  Blur = 'blur',
  BackdropBlur = 'backdrop-blur',
  FXParams = 'fx-params'
}

export interface KeyframeValueMap {
  [KeyframeType.Dimensions]: DimensionsValue;
  [KeyframeType.Position]: PositionValue;
  [KeyframeType.Rotation]: RotationValue;
  [KeyframeType.BorderRadius]: BorderRadiusValue;
  [KeyframeType.BorderWidth]: BorderWidthValue;
  [KeyframeType.Color]: ColorValue;
  [KeyframeType.BorderColor]: BorderColorValue;
  [KeyframeType.Opacity]: OpacityValue;
  [KeyframeType.Scale]: ScaleValue;
  [KeyframeType.Blur]: BlurValue;
  [KeyframeType.BackdropBlur]: BackdropBlurValue;
  [KeyframeType.TextColor]: TextColorValue;
  [KeyframeType.LetterSpacing]: LetterSpacingValue;
  [KeyframeType.WordSpacing]: WordSpacingValue;
  [KeyframeType.FXParams]: FXParamsValue;
}

interface DimensionsValue {
  width: number;
  height: number;
}

interface PositionValue {
  top: number;
  left: number;
}

interface RotationValue {
  angle: number;
}

interface BorderRadiusValue {
  radius: number;
}

interface BorderWidthValue {
  borderWidth: number;
}

interface ColorValue {
  color: string;
}

interface BorderColorValue {
  color: string;
}

interface OpacityValue {
  opacity: number;
}

interface ScaleValue {
  scale: number;
}

interface BlurValue {
  blur: number;
}

interface BackdropBlurValue {
  backdropBlur: number;
}

interface TextColorValue {
  color: string;
}

interface LetterSpacingValue {
  letterSpacing: number;
}

interface WordSpacingValue {
  wordSpacing: number;
}

type FXParamsValue = Record<string, number>;
