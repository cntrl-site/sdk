import { SectionHeightMode } from '../../types/article/Section';
import { z } from 'zod';
import { ItemSchema } from './Item.schema';

export const SectionHeightSchema = z.object({
  mode: z.nativeEnum(SectionHeightMode),
  units: z.number().nonnegative(),
  vhUnits: z.number().nonnegative().optional()
})

export const SectionSchema = z.object({
  id: z.string().min(1),
  items: z.array(ItemSchema),
  name: z.string().optional(),
  height: z.record(SectionHeightSchema),
  position: z.record(z.number()),
  hidden: z.record(z.boolean()),
  color: z.record(z.nullable(z.string())),
  media: z.record((z.object({
    url: z.string(),
    size: z.string(),
    position: z.string(),
    offsetX: z.number().nullable(),
  }))).optional()
});
