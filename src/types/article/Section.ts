import { ItemAny } from './Item';

export enum SectionHeightMode {
  ControlUnits = 'control-units' ,
  ViewportHeightUnits = 'viewport-height-units'
}

export interface SectionHeight {
  mode: SectionHeightMode;
  units: number;
  vhUnits?: number;
}

export interface Section {
  id: string;
  name?: string;
  height: Record<string, SectionHeight>;
  hidden: Record<string, boolean>;
  items: ItemAny[];
  position: Record<string, number>;
  color: Record<string, string | null>;
}
