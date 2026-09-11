import { ComponentLayoutParams } from '../article/Params.type';
import { StructuredBlockComponentCommonParams } from '../article/StructuredBlock';

type LayoutIdentifier = string;

export interface NavigationComponent {
  id: string;
  commonParams: StructuredBlockComponentCommonParams;
  layoutParams: Record<LayoutIdentifier, ComponentLayoutParams>;
}

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
