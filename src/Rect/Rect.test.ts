import { Rect } from './Rect';

const point = (x: number, y: number) => new Rect(x, y, 0, 0);
const square = new Rect(0, 0, 100, 100);

describe('Rect.intersectsRotated', () => {
  it('matches plain rect overlap when not rotated', () => {
    expect(Rect.intersectsRotated(point(50, 50), square, 0)).toBe(true);
    expect(Rect.intersectsRotated(point(100, 100), square, 0)).toBe(true);
    expect(Rect.intersectsRotated(point(101, 50), square, 0)).toBe(false);
  });

  it('misses a point in the corner of the bounding box of a rotated rect', () => {
    expect(Rect.intersectsRotated(point(-10, -10), square, 45)).toBe(false);
    expect(Rect.intersectsRotated(point(5, 5), square, 45)).toBe(false);
    expect(Rect.intersectsRotated(point(110, 110), square, -30)).toBe(false);
  });

  it('hits a point inside the rotated shape', () => {
    expect(Rect.intersectsRotated(point(50, 50), square, 45)).toBe(true);
    expect(Rect.intersectsRotated(point(-10, 50), square, 45)).toBe(true);
    expect(Rect.intersectsRotated(point(50, 115), square, 45)).toBe(true);
  });

  it('rotates the target around its own center', () => {
    const wide = new Rect(0, 0, 200, 50);
    expect(Rect.intersectsRotated(point(10, 25), wide, 90)).toBe(false);
    expect(Rect.intersectsRotated(point(100, -50), wide, 90)).toBe(true);
    expect(Rect.intersectsRotated(point(100, 100), wide, 90)).toBe(true);
  });

  it('ignores a rect that only overlaps the bounding box of the rotated target', () => {
    expect(Rect.intersectsRotated(new Rect(-20, -20, 15, 15), square, 45)).toBe(false);
  });

  it('hits a rect that overlaps the rotated target without containing any of its corners', () => {
    expect(Rect.intersectsRotated(new Rect(115, 45, 10, 10), square, 45)).toBe(true);
    expect(Rect.intersectsRotated(new Rect(-50, 45, 200, 10), square, 45)).toBe(true);
  });
});

describe('Rect.getRotatedBoundingBox', () => {
  it('returns the rect itself when not rotated', () => {
    const box = Rect.getRotatedBoundingBox(new Rect(10, 20, 30, 40), 0);
    expect([box.x, box.y, box.width, box.height]).toEqual([10, 20, 30, 40]);
  });

  it('returns the axis-aligned box around the rotated rect', () => {
    const box = Rect.getRotatedBoundingBox(square, 45);
    const half = 50 * Math.SQRT2;
    expect(box.x).toBeCloseTo(50 - half);
    expect(box.y).toBeCloseTo(50 - half);
    expect(box.width).toBeCloseTo(2 * half);
    expect(box.height).toBeCloseTo(2 * half);
  });

  it('swaps width and height at 90 degrees', () => {
    const box = Rect.getRotatedBoundingBox(new Rect(0, 0, 200, 50), 90);
    expect(box.x).toBeCloseTo(75);
    expect(box.y).toBeCloseTo(-75);
    expect(box.width).toBeCloseTo(50);
    expect(box.height).toBeCloseTo(200);
  });
});

describe('Rect.getRotatedRectCoordinates', () => {
  it('returns the plain coordinates when not rotated', () => {
    const rect = new Rect(10, 20, 30, 40);
    expect(Rect.getRotatedRectCoordinates(rect, rect, 0)).toEqual([10, 20, 40, 60]);
  });

  it('rotates the top-left and bottom-right corners around the original center', () => {
    const [left, top, right, bottom] = Rect.getRotatedRectCoordinates(square, square, 90);
    expect(left).toBeCloseTo(100);
    expect(top).toBeCloseTo(0);
    expect(right).toBeCloseTo(0);
    expect(bottom).toBeCloseTo(100);
  });
});

describe('Rect.getUnRotatedPosition', () => {
  it('undoes getRotatedRectCoordinates', () => {
    const rect = new Rect(10, 20, 100, 50);
    const [left, top] = Rect.getUnRotatedPosition(Rect.getRotatedRectCoordinates(rect, rect, 30), 30);
    expect(left).toBeCloseTo(10);
    expect(top).toBeCloseTo(20);
  });

  it('rotates the first corner back around the coordinates center', () => {
    const [left, top] = Rect.getUnRotatedPosition([100, 0, 0, 100], 90);
    expect(left).toBeCloseTo(0);
    expect(top).toBeCloseTo(0);
  });
});

describe('Rect.getUnrotatedChildRect', () => {
  it('rotates the child center back around the parent center', () => {
    const child = Rect.getUnrotatedChildRect(new Rect(0, 0, 200, 100), new Rect(150, 40, 20, 20), 90);
    expect(child.x).toBeCloseTo(90);
    expect(child.y).toBeCloseTo(-20);
    expect(child.width).toBe(20);
    expect(child.height).toBe(20);
  });
});
