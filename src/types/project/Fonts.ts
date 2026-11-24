export enum FontFileTypes {
  OTF = 'otf',
  TTF = 'ttf',
  WOFF = 'woff',
  WOFF2 = 'woff2',
  EOT = 'eot'
}

export interface CustomFontFile {
  type: FontFileTypes;
  url: string;
}

/** A variable font axis, as far as the sdk reads it (the editor stores its name and default too). */
export interface FontAxis {
  tag: string;
  min: number;
  max: number;
}

export interface CustomFont {
  name: string;
  style: string;
  weight: number;
  files: CustomFontFile[];
  axes?: FontAxis[];
}

export interface Fonts {
  google: string;
  adobe: string;
  custom: CustomFont[];
}

export interface FontVault extends CustomFont {}
