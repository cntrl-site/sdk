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

