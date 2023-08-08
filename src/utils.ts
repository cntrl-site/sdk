import { TLayout } from '@cntrl-site/core';

export function getLayoutStyles<V extends any[]>(
  layouts: TLayout[],
  layoutValues: readonly [...V],
  mapToStyles: (values: { [K in (keyof V)]: V[K] extends Record<string, infer R> ? R : V[K] }) => string
): string {
  const mediaQueries = layouts
    .sort((a, b) => a.startsWith - b.startsWith)
    .map(layout => {
      // @ts-ignore
      const values: any = layoutValues.map(lv => lv[layout.id]);
      return `
        ${layout.startsWith !== 0
          ? `@media (min-width: ${layout.startsWith}px) {${mapToStyles(values)}}`
          : `${mapToStyles(values)}`
      }`;
    })
    .join('\n');
  return mediaQueries;
}
