import { Dimensions, Left, Position, RectCoordinates, RectObject, scaleMatrix, ScaleOrigin, Sides, Top } from "../types/article/Rect";

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
    const width = rect.width * factor;
    const height = rect.height * factor;
    const dw = rect.width - width;
    const dh = rect.height - height;
    const [kt, kl] = scaleMatrix[origin];
    const x = rect.left + (kl * dw);
    const y = rect.top + (kt * dh);
    return new Rect(x, y, width, height);
  }

  public static scaleWithOrigin(rect: Rect, factor: number, kt: number, kl: number): Rect {
    const width = rect.width * factor;
    const height = rect.height * factor;
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
    const radians = -1 * rotationAngle * (Math.PI / 180);
    const parentCenterX = parentRect.left + parentRect.width / 2;
    const parentCenterY = parentRect.top + parentRect.height / 2;
    const relativeX = childRect.left + childRect.width / 2 - parentCenterX;
    const relativeY = childRect.top + childRect.height / 2 - parentCenterY;
    const unrotatedX = relativeX * Math.cos(radians) - relativeY * Math.sin(radians);
    const unrotatedY = relativeX * Math.sin(radians) + relativeY * Math.cos(radians);
    const finalX = unrotatedX + parentCenterX;
    const finalY = unrotatedY + parentCenterY;
    const unrotatedWidth = childRect.width;
    const unrotatedHeight = childRect.height;
    return new Rect(finalX - unrotatedWidth / 2, finalY - unrotatedHeight / 2, unrotatedWidth, unrotatedHeight);
  }

  public static getRotatedRectCoordinates(originalRect: Rect, newRect: Rect, angle: number): RectCoordinates {
    if (angle === 0) return [newRect.left, newRect.top, newRect.right, newRect.bottom];
    const radians: number = (Math.PI * angle) / 180;
    const cos: number = Math.cos(radians);
    const sin: number = Math.sin(radians);
    const centerX = originalRect.left + originalRect.width / 2;
    const centerY = originalRect.top + originalRect.height / 2;
    const { left, top, right, bottom } = newRect;
    const rotatedLeft = left * cos - top * sin - centerX * cos + centerY * sin + centerX;
    const rotatedTop = left * sin + top * cos - centerX * sin - centerY * cos + centerY;
    const rotatedRight = right * cos - bottom * sin - centerX * cos + centerY * sin + centerX;
    const rotatedBottom = right * sin + bottom * cos - centerX * sin - centerY * cos + centerY;
    return [rotatedLeft, rotatedTop, rotatedRight, rotatedBottom];
  }

  public static getUnRotatedPosition(coords: RectCoordinates, angle: number): [Top, Left] {
    const [left, top, right, bottom] = coords;
    const centerX: number = (right + left) / 2;
    const centerY: number = (bottom + top) / 2;
    const radians: number = -1 * (Math.PI * angle) / 180;
    const cos: number = Math.cos(radians);
    const sin: number = Math.sin(radians);
    const newLeft: number = left * cos - top * sin - cos * centerX + sin * centerY + centerX;
    const newTop: number = left * sin + top * cos - sin * centerX - cos * centerY + centerY;
    return [newLeft, newTop];
  }

  public static getOriginRectFromBoundary = (boundary: DOMRect, angle: number, ratio: number): Rect => {
    const radians = angle * (Math.PI / 180);
    const cos = Math.abs(Math.cos(radians));
    const sin = Math.abs(Math.sin(radians));
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
    const { x, y, width, height } = boundary;
    const radian = (angle * Math.PI) / 180;
    const cx = x + width / 2;
    const cy = y + height / 2;
    const corners = [
      { x, y },
      { x: x + width, y },
      { x, y: y + height },
      { x: x + width, y: y + height }
    ];
    const rotatedCorners = corners.map((corner) => {
      const dx = corner.x - cx;
      const dy = corner.y - cy;

      return {
        x: cx + (dx * Math.cos(radian) - dy * Math.sin(radian)),
        y: cy + (dx * Math.sin(radian) + dy * Math.cos(radian))
      };
    });
    const xValues = rotatedCorners.map(point => point.x);
    const yValues = rotatedCorners.map(point => point.y);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    return new Rect(minX, minY, maxX - minX, maxY - minY);
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
}
