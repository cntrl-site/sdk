import { ItemAny } from './Item';
import { StructuredBlockAny } from './StructuredBlock';

export enum SectionHeightMode {
  ControlUnits = 'control-units' ,
  ViewportHeightUnits = 'viewport-height-units'
}

export interface SectionHeight {
  mode: SectionHeightMode;
  units: number;
  vhUnits?: number;
}

export type SectionVideo = {
  url: string;
  size: string;
  type: 'video';
  play: 'on-click' | 'auto';
  position: string;
  coverUrl: string | null;
  offsetX: number | null;
};

export type SectionImage = {
  url: string;
  type: 'image';
  size: string;
  position: string;
  offsetX: number | null;
};

export interface ContentBasedSectionSettings {
  paddingBottom: Record<string, number>;
  defaultWidth: Record<string, number>;
}

export interface DefaultSectionSettings {
  paddingBottom: Record<string, number>;
}

export type SectionMedia = SectionVideo | SectionImage;

type SectionBase = {
    id: string;
  name?: string;
  items: ItemAny[];
  position: Record<string, number>;
  minHeight: Record<string, SectionHeight>;
  color: Record<string, string | null>;
  media?: Record<string, SectionMedia>;
  hidden: Record<string, boolean>;
  structuredContent: StructuredBlockAny[];
};

export type DefaultSection = SectionBase & {
  type: 'default';
  structuredContentSettings: DefaultSectionSettings;
};

export type ContentBasedSection = SectionBase & {
  type: 'content-based';
  structuredContentSettings: ContentBasedSectionSettings;
};

export type Section = DefaultSection | ContentBasedSection;
