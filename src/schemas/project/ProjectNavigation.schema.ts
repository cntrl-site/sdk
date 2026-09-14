import { z, ZodType } from 'zod';
import {
  NavigationComponent,
  ProjectNavigation,
  ProjectNavigationLayoutSettings,
  ProjectNavigationPosition,
  ProjectNavigationSettings
} from '../../types/project/ProjectNavigation';
import { ComponentItemLayoutParamsSchema } from '../article/ElementLayoutParams.schema';
import { StructuredBlockComponentCommonParamsSchema } from '../article/StructuredBlock.schema';

export const NavigationComponentSchema = z.object({
  id: z.string().min(1),
  commonParams: StructuredBlockComponentCommonParamsSchema,
  layoutParams: z.record(ComponentItemLayoutParamsSchema)
}) satisfies ZodType<NavigationComponent>;

export const ProjectNavigationPositionSchema = z.enum(['default', 'stickyTop', 'switch']) satisfies ZodType<ProjectNavigationPosition>;

export const ProjectNavigationLayoutSettingsSchema = z.object({
  position: ProjectNavigationPositionSchema
}) satisfies ZodType<ProjectNavigationLayoutSettings>;

export const ProjectNavigationSettingsSchema = z.record(
  ProjectNavigationLayoutSettingsSchema
) satisfies ZodType<ProjectNavigationSettings>;

export const ProjectNavigationSchema = z.object({
  id: z.string().min(1),
  component: NavigationComponentSchema,
  settings: ProjectNavigationSettingsSchema.optional()
}) satisfies ZodType<ProjectNavigation>;
