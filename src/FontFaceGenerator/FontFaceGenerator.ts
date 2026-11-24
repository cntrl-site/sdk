import { CustomFont } from '../types/project/Fonts';

const FILE_TYPES_MAP: Record<string, string> = {
  ttf: 'truetype',
  otf: 'opentype'
};

const WEIGHT_AXIS = 'wght';

export class FontFaceGenerator {
  /**
   * A font with `weightRange` is declared over it (`font-weight: 300 700`), as a variable upload is
   * (see getDeclaredFonts); `weight` keeps the stored value.
   */
  constructor(
    private fonts: Array<CustomFont & { weightRange?: [number, number] }>
  ) {}

  generate(): string {
    return this.fonts.map(font => {
      const eotFile = font.files.find(file => file.type === 'eot');
      const otherFiles = font.files
        .filter(file => file.type !== 'eot')
        .map(file => `url('${file.url}') format('${FILE_TYPES_MAP[file.type] || file.type}')`);
      const weight = font.weightRange ? font.weightRange.join(' ') : font.weight;
      return `
@font-face {
  font-family: "${font.name}";
  font-weight: ${weight};
  font-style: ${font.style};
  font-display: swap;
  ${eotFile ? `src: url('${eotFile.url}');\n  ` : ''}src: ${otherFiles.join(', ')};
}`;
    }).join('\n');
  }
}

/**
 * The project's fonts and the vault as the page declares them, in the editor's order: the project's
 * own fonts, then the vault. An upload with a variable weight axis is declared over its `wght` range
 * so it renders every weight it has, and the vault faces that range covers (same family and style)
 * are left out: the browser prefers a face of the exact weight over a range, so they would win over
 * the upload. Everything else is declared as before.
 */
export function getDeclaredFonts<T extends CustomFont>(
  customFonts: T[],
  fontsVault: T[] = []
): Array<T & { weightRange?: [number, number] }> {
  const custom = customFonts.map((font): T & { weightRange?: [number, number] } => {
    const axis = font.axes?.find(axis => axis.tag === WEIGHT_AXIS);
    return axis && axis.min < axis.max ? { ...font, weightRange: [axis.min, axis.max] } : font;
  });
  const ranged = custom.filter(font => font.weightRange);
  if (!ranged.length) return [...custom, ...fontsVault];
  const isCovered = (face: CustomFont) => ranged.some(({ name, style, weightRange: [min, max] = [0, 0] }) => (
    name.trim() === face.name.trim() && style === face.style && min <= face.weight && face.weight <= max
  ));
  return [...custom, ...fontsVault.filter(face => !isCovered(face))];
}
