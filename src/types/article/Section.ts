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

interface ContentBasedSectionSettings {
  defaultWidth: Record<string, number>;
  paddingBottom: Record<string, number>;
}

interface ComponentBasedSectionSettings {
  paddingBottom: Record<string, number>;
}

export type SectionMedia = SectionVideo | SectionImage;

type SectionBase = {
  id: string;
  name?: string;
  items: ItemAny[];
  position: Record<string, number>;
  color: Record<string, string | null>;
  media?: Record<string, SectionMedia>;
  hidden: Record<string, boolean>;
};

export type FreehandSection = SectionBase & {
  type: 'freehand';
  height: Record<string, SectionHeight>;
};

export type ComponentBasedSection = SectionBase & {
  type: 'component-based';
  minHeight: Record<string, SectionHeight>;
  structuredContent: StructuredBlockAny[];
  structuredContentSettings: ComponentBasedSectionSettings;
};

export type ContentBasedSection = SectionBase & {
  type: 'content-based';
  minHeight: Record<string, SectionHeight>;
  structuredContent: StructuredBlockAny[];
  structuredContentSettings: ContentBasedSectionSettings;
};

export type Section = FreehandSection | ComponentBasedSection | ContentBasedSection;
