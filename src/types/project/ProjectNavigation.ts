import { ComponentLayoutParams } from '../article/Params.type';
import { ComponentStructuredBlock } from '../article/StructuredBlock';

type LayoutIdentifier = string;

export type NavigationComponent = Pick<
  ComponentStructuredBlock,
  'id' | 'commonParams' | 'layoutParams'
>;

export type ProjectNavigationPosition = 'default' | 'stickyTop' | 'switch';

export interface ProjectNavigationLayoutSettings {
  position: ProjectNavigationPosition;
}

export type ProjectNavigationSettings = Record<LayoutIdentifier, ProjectNavigationLayoutSettings>;

export interface ProjectNavigation {
  id: string;
  component: NavigationComponent;
  settings?: ProjectNavigationSettings;
}
