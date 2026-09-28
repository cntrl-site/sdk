import { Dimensions, Left, Position, RectCoordinates, RectObject, scaleMatrix, ScaleOrigin, Sides, Top } from "../types/article/Rect";

type Rotation = { cos: number; sin: number };

const NO_ROTATION: Rotation = { cos: 1, sin: 0 };

export class Rect {
  public static fromObject({ x, y, width, height }: RectObject): Rect {
    return new Rect(x, y, width, height);
  }

  public static intersection(rect1: Rect, rect2: Rect): Rect {
    const left = Math.max(rect1.left, rect2.left);
    const top = Math.max(rect1.top, rect2.top);
    const width = Math.min(rect1.right, rect2.right) - left;
    const height = Math.min(rect1.bottom, rect2.bottom) - top;
    return new Rect(left, top, Math.max(width, 0), Math.max(height, 0));
  }

  public static isSideBySide(rect1: Rect, rect2: Rect): boolean {
    return Math.round(rect1.left) === Math.round(rect2.left)
      || Math.round(rect1.top) === Math.round(rect2.top)
      || Math.round(rect1.right) === Math.round(rect2.right)
      || Math.round(rect1.bottom) === Math.round(rect2.bottom);
  }

  public static isContained(rect1: Rect, rect2: Rect): boolean {
    return rect1.left <= rect2.left && rect1.top <= rect2.top && rect1.right >= rect2.right && rect1.bottom >= rect2.bottom;
  }

  public static isEqual(rect1: Rect, rect2: Rect): boolean {
    return Math.round(rect1.left) === Math.round(rect2.left)
      && Math.round(rect1.top) === Math.round(rect2.top)
      && Math.round(rect1.right) === Math.round(rect2.right)
      && Math.round(rect1.bottom) === Math.round(rect2.bottom);
  }

  public static scale(rect: Rect, factor: number, origin: ScaleOrigin): Rect {
    const normalizedFactor = Rect.getNormalizedFactor(factor);
    const width = rect.width * normalizedFactor;
    const height = rect.height * normalizedFactor;
    const dw = rect.width - width;
    const dh = rect.height - height;
    const [kt, kl] = scaleMatrix[origin];
    const x = rect.left + (kl * dw);
    const y = rect.top + (kt * dh);
    return new Rect(x, y, width, height);
  }

  public static scaleWithOrigin(rect: Rect, factor: number, kt: number, kl: number): Rect {
    const normalizedFactor = Rect.getNormalizedFactor(factor);
    const width = rect.width * normalizedFactor;
    const height = rect.height * normalizedFactor;
    const dw = rect.width - width;
    const dh = rect.height - height;
    const x = rect.left + (kl * dw);
    const y = rect.top + (kt * dh);
    return new Rect(x, y, width, height);
  }

  public static getChildScaleOrigin(parentRect: Rect, childRect: Rect, parentOrigin: ScaleOrigin): Sides {
    if (childRect.width === 0 || childRect.height === 0 || parentRect.width === 0 || parentRect.height === 0) {
      return [0, 0]; // Default or fallback value
    }
    const [kt, kl] = scaleMatrix[parentOrigin];
    const dw = childRect.width / parentRect.width;
    const dh = childRect.height / parentRect.height;
    const clNormalized = childRect.left / childRect.width;
    const ctNormalized = childRect.top / childRect.height;
    const pw = 1 / dw;
    const ph = 1 / dh;
    const pl = kl * pw;
    const pt = kt * ph;
    const originLeft = pl - clNormalized;
    const originTop = pt - ctNormalized;
    return [originTop, originLeft];
  }

  public static getUnrotatedChildRect(parentRect: Rect, childRect: Rect, rotationAngle: number): Rect {
    const { x, y } = Rect.rotatePoint(Rect.getCenter(childRect), Rect.getCenter(parentRect), Rect.getRotation(-rotationAngle));
    return new Rect(x - childRect.width / 2, y - childRect.height / 2, childRect.width, childRect.height);
  }

  public static getRotatedRectCoordinates(originalRect: Rect, newRect: Rect, angle: number): RectCoordinates {
    if (angle === 0) return [newRect.left, newRect.top, newRect.right, newRect.bottom];
    const center = Rect.getCenter(originalRect);
    const rotation = Rect.getRotation(angle);
    const topLeft = Rect.rotatePoint({ x: newRect.left, y: newRect.top }, center, rotation);
    const bottomRight = Rect.rotatePoint({ x: newRect.right, y: newRect.bottom }, center, rotation);
    return [topLeft.x, topLeft.y, bottomRight.x, bottomRight.y];
  }

  public static getUnRotatedPosition(coords: RectCoordinates, angle: number): [Top, Left] {
    const [left, top, right, bottom] = coords;
    const center = { x: (right + left) / 2, y: (bottom + top) / 2 };
    const { x, y } = Rect.rotatePoint({ x: left, y: top }, center, Rect.getRotation(-angle));
    return [x, y];
  }

  public static getOriginRectFromBoundary = (boundary: DOMRect, angle: number, ratio: number): Rect => {
    const rotation = Rect.getRotation(angle);
    const cos = Math.abs(rotation.cos);
    const sin = Math.abs(rotation.sin);
    const W = boundary.width;
    const H = boundary.height;
    if (Math.abs(angle % 180) === 90) {
      const { x, y } = this.getNewPosition(boundary, { width: H, height: W });
      return new Rect(x, y, H, W);
    }
    if (Math.abs(angle % 45) === 0) {
      const w = W / (cos + sin / ratio);
      const h = H / (cos + sin * ratio);
      const { x, y } = this.getNewPosition(boundary, { width: w, height: h });
      return new Rect(x, y, w, h);
    }
    const w = (W * cos - H * sin) / (cos * cos - sin * sin);
    const h = (H - w * sin) / cos;
    const { x, y } = this.getNewPosition(boundary, { width: w, height: h });
    return new Rect(x, y, w, h);
  };

  public static getRotatedBoundingBox(boundary: Rect, angle: number) {
    if (angle === 0) return Rect.fromObject(boundary);
    const rotatedCorners = Rect.getCorners(boundary, Rect.getRotation(angle));
    const xValues = rotatedCorners.map(point => point.x);
    const yValues = rotatedCorners.map(point => point.y);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    return new Rect(minX, minY, maxX - minX, maxY - minY);
  }

  public static intersectsRotated(rect: Rect, target: Rect, angle: number): boolean {
    const rotation = Rect.getRotation(angle);
    const { cos, sin } = rotation;
    const rectCorners = Rect.getCorners(rect);
    const targetCorners = Rect.getCorners(target, rotation);
    const axes: Position[] = [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: cos, y: sin },
      { x: -sin, y: cos }
    ];
    return axes.every(axis => {
      const [rectMin, rectMax] = Rect.projectOnAxis(rectCorners, axis);
      const [targetMin, targetMax] = Rect.projectOnAxis(targetCorners, axis);
      return rectMin <= targetMax && targetMin <= rectMax;
    });
  }

  public static getRelativeRect(src: Rect, origin: Rect): Rect {
    return new Rect(
      src.left - origin.left,
      src.top - origin.top,
      src.width,
      src.height
    );
  }

  public static getDefault(): Rect {
    return new Rect(0, 0, 0, 0);
  }

  public static getHorizontallyIntersectingRects(selectedRect: Rect, unselectedRects: Rect[]): Rect[] {
    return unselectedRects.filter(rect =>
      selectedRect.bottom >= rect.top && selectedRect.top <= rect.bottom
    );
  }

  public static getVerticallyIntersectingRects(selectedRect: Rect, unselectedRects: Rect[]): Rect[] {
    return unselectedRects.filter(rect =>
      selectedRect.right >= rect.left && selectedRect.left <= rect.right
    );
  }

  public static roundRect(rect: Rect): Rect {
    return new Rect(Math.round(rect.x), Math.round(rect.y), Math.round(rect.width), Math.round(rect.height));
  }

  public static roundRects(rects: Rect[]): Rect[] {
    return rects.map(r => Rect.roundRect(r));
  }

  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {}

  get left() {
    return this.width >= 0 ? this.x : this.x + this.width;
  }

  get top() {
    return this.height >= 0 ? this.y : this.y + this.height;
  }

  get right() {
    return this.width >= 0 ? this.x + this.width : this.x;
  }

  get bottom() {
    return this.height >= 0 ? this.y + this.height : this.y;
  }

  public getScaled(xRatio: number, yRatio: number = xRatio): Rect {
    return new Rect(
      this.x * xRatio,
      this.y * yRatio,
      this.width * xRatio,
      this.height * yRatio
    );
  }

  public getRelative(source: Rect): Rect {
    return new Rect(
      this.left - source.left,
      this.top - source.top,
      this.width,
      this.height
    );
  }

  private static getNewPosition(rect: DOMRect, newDimensions: Dimensions): Position {
    const x = rect.left + (rect.width - newDimensions.width) / 2;
    const y = rect.top + (rect.height - newDimensions.height) / 2;
    return { x, y };
  }

  private static getCorners(rect: Rect, rotation: Rotation = NO_ROTATION): Position[] {
    const { x, y, width, height } = rect;
    const center = Rect.getCenter(rect);
    const corners: Position[] = [
      { x, y },
      { x: x + width, y },
      { x: x + width, y: y + height },
      { x, y: y + height }
    ];
    return corners.map(corner => Rect.rotatePoint(corner, center, rotation));
  }

  private static getCenter({ left, top, right, bottom }: Rect): Position {
    return { x: (left + right) / 2, y: (top + bottom) / 2 };
  }

  private static getRotation(degrees: number): Rotation {
    const radians = degrees * (Math.PI / 180);
    return { cos: Math.cos(radians), sin: Math.sin(radians) };
  }

  private static rotatePoint(point: Position, center: Position, { cos, sin }: Rotation): Position {
    const dx = point.x - center.x;
    const dy = point.y - center.y;
    return { x: center.x + dx * cos - dy * sin, y: center.y + dx * sin + dy * cos };
  }

  private static projectOnAxis(points: Position[], axis: Position): [min: number, max: number] {
    const values = points.map(p => p.x * axis.x + p.y * axis.y);
    return [Math.min(...values), Math.max(...values)];
  }

  private static getNormalizedFactor(factor: number): number {
    const EPSILON = 1e-10;
    return factor === 0 
      ? EPSILON
      : factor === Infinity 
        ? 1 / EPSILON
        : factor;
  }
}
