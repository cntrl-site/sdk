import { TLayout, getClosestLayoutValue } from '@cntrl-site/core';

export function getLayoutStyles<V, M> (
  layouts: TLayout[],
  layoutValues: Record<string, V>[],
  mapToStyles: (values: V[]) => M
): string {
  const mediaQueries = layouts
    .sort((a, b) => a.startsWith - b.startsWith)
    .reduce((acc, layout) => {
      const values = layoutValues.map(lv => lv[layout.id] ?? getClosestLayoutValue(lv, layouts, layout.id));
      return `
        ${acc}
        ${layout.startsWith !== 0
        ? `@media (min-width: ${layout.startsWith}px) {${mapToStyles(values)}}`
        : `${mapToStyles(values)}`
      }`;
    },
    '');
  return mediaQueries;
}

