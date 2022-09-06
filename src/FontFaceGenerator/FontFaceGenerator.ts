import { TCustomFont } from '@cntrl-site/core';

const FILE_TYPES_MAP: Record<string, string> = {
  ttf: 'truetype'
};

export class FontFaceGenerator {
  constructor(
    private fonts: TCustomFont[]
  ) {}

  generate(): string {
    return this.fonts.map(font => {
      const eotFile = font.files.find(file => file.type === 'eot');
      const otherFiles = font.files
        .filter(file => file.type !== 'eot')
        .map(file => `url('${file.url}') format('${FILE_TYPES_MAP[file.type] || file.type}')`);
      return `
@font-face {
  font-family: ${font.name};
  font-weight: ${font.weight};
  ${eotFile ? `src: url('${eotFile.url}');\n  ` : ''}src: ${otherFiles.join(', ')};
}`;
    }).join('\n');
  }
}
