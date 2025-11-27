import { Layout } from './types/project/Layout';

export function getLayoutStyles<V, M> (
  layouts: Layout[],
  layoutValues: Record<string, V>[],
  mapToStyles: (values: V[], exemplary: number) => M
): string {
  const mediaQueries = layouts
    .sort((a, b) => a.startsWith - b.startsWith)
    .reduce((acc, layout) => {
      const values = layoutValues.map(lv => lv[layout.id]);
      return `
        ${acc}
        ${layout.startsWith !== 0
        ? `@media (min-width: ${layout.startsWith}px) {${mapToStyles(values, layout.exemplary)}}`
        : `${mapToStyles(values, layout.exemplary)}`
      }`;
    },
    '');
  return mediaQueries;
}

export function getLayoutMediaQuery(layoutId: string, layouts: Layout[]): string {
  const sorted = layouts.slice().sort((a, b) => a.startsWith - b.startsWith);
  const layoutIndex = sorted.findIndex(l => l.id === layoutId);
  if (layoutIndex === -1) {
    throw new Error(`No layout was found by the given id #${layoutId}`);
  }
  const current = sorted[layoutIndex];
  const next = sorted[layoutIndex + 1];
  if (!next) {
    return `@media (min-width: ${current.startsWith}px)`;
  }
  return `@media (min-width: ${current.startsWith}px) and (max-width: ${next.startsWith - 1}px)`;
}

const canvases: WeakMap<Window, HTMLCanvasElement> = new WeakMap();

if (typeof window !== 'undefined') {
  canvases.set(window, window.document.createElement('canvas'));
}

export function measureFont(font: string, text: string, win: Window = window): FontMetrics {
  const canvas = resolveCanvas(win);
  const context = canvas.getContext('2d');
  if (!context) {
    throw new ReferenceError('Canvas context is not available');
  }

  context.textBaseline = 'top';
  context.font = font;

  // measure "H" for basic font metrics
  const hMetrics = context.measureText('H');
  const capHeight = hMetrics.actualBoundingBoxDescent + hMetrics.actualBoundingBoxAscent;
  const baseline = hMetrics.actualBoundingBoxDescent;
  const topMargin = hMetrics.actualBoundingBoxAscent - hMetrics.fontBoundingBoxAscent;

  // measure "x" for small letters metrics
  const xMetrics = context.measureText('x');
  const xHeight = xMetrics.actualBoundingBoxDescent + xMetrics.actualBoundingBoxAscent;

  // measure "p" for descendants
  const pMetrics = context.measureText('Hp');
  const bottomMargin = pMetrics.actualBoundingBoxDescent - pMetrics.fontBoundingBoxDescent;

  // measure first and last letter to get horizontal margins
  const horMetrics = context.measureText(`${text.charAt(0)}${text.charAt(text.length - 1)}`);
  const leftMargin = -horMetrics.actualBoundingBoxLeft;
  const rightMargin = horMetrics.width - horMetrics.actualBoundingBoxRight;

  return {
    capHeight,
    baseline,
    fontBoxHeight: hMetrics.fontBoundingBoxDescent - hMetrics.fontBoundingBoxAscent,
    xHeight,
    leftMargin,
    topMargin,
    rightMargin,
    bottomMargin
  };
}

function resolveCanvas(win: Window): HTMLCanvasElement {
  if (typeof window === 'undefined') {
    throw new TypeError('resolveCanvas() called on server');
  }
  if (!canvases.has(win)) {
    canvases.set(win, win.document.createElement('canvas'));
  }
  return canvases.get(win)!;
}

interface FontMetrics {
  capHeight: number;
  baseline: number;
  fontBoxHeight: number;
  xHeight: number;
  leftMargin: number;
  topMargin: number;
  rightMargin: number;
  bottomMargin: number;
}
