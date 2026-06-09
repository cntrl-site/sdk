import { Section, SectionHeightMode } from '../../types/article/Section';
import { z, ZodType } from 'zod';
import { ItemSchema } from './Item.schema';
import { StructuredBlockSchema } from './StructuredBlock.schema';

export const SectionHeightSchema = z.object({
  mode: z.nativeEnum(SectionHeightMode),
  units: z.number().nonnegative(),
  vhUnits: z.number().nonnegative().optional()
});

export const ContentBasedSectionSettingsSchema = z.object({
  defaultWidth: z.record(z.number().nonnegative()),
  paddingBottom: z.record(z.number().nonnegative()),
});

export const ComponentBasedSectionSettingsSchema = z.object({
  paddingBottom: z.record(z.number().nonnegative()),
});

const SectionVideoSchema = z.object({
  url: z.string(),
  size: z.string(),
  type: z.literal('video'),
  play: z.enum(['on-click', 'auto']),
  coverUrl: z.string().nullable(),
  position: z.string(),
  offsetX: z.number().nullable()
});

const SectionImageSchema = z.object({
  url: z.string(),
  type: z.literal('image'),
  size: z.string(),
  position: z.string(),
  offsetX: z.number().nullable()
});

export const SectionMediaSchema = z.discriminatedUnion('type', [SectionVideoSchema, SectionImageSchema]);

const SectionBaseSchema = z.object({
  id: z.string().min(1),
  name: z.string().optional(),
  items: z.array(ItemSchema),
  position: z.record(z.number()),
  color: z.record(z.nullable(z.string())),
  hidden: z.record(z.boolean()),
  minHeight: z.record(SectionHeightSchema),
  structuredContent: z.array(StructuredBlockSchema),
  media: z.record(SectionMediaSchema).optional()
});

const DefaultSectionSchema = SectionBaseSchema.extend({
  type: z.literal('default'),
  structuredContentSettings: ComponentBasedSectionSettingsSchema,
});

const ContentBasedSectionSchema = SectionBaseSchema.extend({
  type: z.literal('content-based'),
  structuredContentSettings: ContentBasedSectionSettingsSchema
});

export const SectionSchema: ZodType<Section> = z.discriminatedUnion('type', [
  DefaultSectionSchema,
  ContentBasedSectionSchema
]);
