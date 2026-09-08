import { ComponentLayoutParams } from '../article/Params.type';

type LayoutIdentifier = string;

export interface NavigationComponent {
  id: string;
  componentId: string;
  content?: any;
  parameters?: Record<string, any>;
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
