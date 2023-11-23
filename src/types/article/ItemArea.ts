export enum AnchorSide {
  Top = 'top',
  Bottom = 'bottom',
  Center = 'center'
}


export enum ScaleAnchor {
  TopLeft = 'top-left',
  TopCenter = 'top-center',
  TopRight = 'top-right',
  MiddleLeft = 'middle-left',
  MiddleCenter = 'middle-center',
  MiddleRight = 'middle-right',
  BottomLeft = 'bottom-left',
  BottomCenter = 'bottom-center',
  BottomRight = 'bottom-right'
}

export interface ItemArea {
  top: number;
  left: number;
  width: number;
  height: number;
  zIndex: number;
  angle: number;
  anchorSide?: AnchorSide;
  scale: number;
  scaleAnchor: ScaleAnchor;
}
