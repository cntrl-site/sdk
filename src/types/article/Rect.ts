export interface RectObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number
}

export interface Dimensions {
  width: number;
  height: number;
}

export type Left = number;
export type Top = number;
export type Right = number;
export type Bottom = number;

export type RectCoordinates = [Left, Top, Right, Bottom];

const ScaleOrigins = {
  TopLeft: 'top-left',
  TopCenter: 'top-center',
  TopRight: 'top-right',
  MiddleLeft: 'middle-left',
  MiddleCenter: 'middle-center',
  MiddleRight: 'middle-right',
  BottomLeft: 'bottom-left',
  BottomCenter: 'bottom-center',
  BottomRight: 'bottom-right'
} as const;

export type Sides = [top: number, left: number];

export const scaleMatrix: Record<ScaleOrigin, Sides> = {
  [ScaleOrigins.TopLeft]: [0, 0],
  [ScaleOrigins.TopCenter]: [0, 0.5],
  [ScaleOrigins.TopRight]: [0, 1],
  [ScaleOrigins.MiddleLeft]: [0.5, 0],
  [ScaleOrigins.MiddleCenter]: [0.5, 0.5],
  [ScaleOrigins.MiddleRight]: [0.5, 1],
  [ScaleOrigins.BottomLeft]: [1, 0],
  [ScaleOrigins.BottomCenter]: [1, 0.5],
  [ScaleOrigins.BottomRight]: [1, 1]
};

export type ScaleOrigin = typeof ScaleOrigins[keyof typeof ScaleOrigins];
