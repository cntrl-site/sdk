import { z } from 'zod';
import { ItemAreaSchema } from './ItemArea.schema';

export const Link = z.object({
  url: z.string().min(1),
  target: z.string().min(1)
});

const CommonParamsBase = z.object({
  sizing: z.string().min(1)
});

export const ItemBaseSchema = z.object({
  id: z.string().min(1),
  area: z.record(ItemAreaSchema),
  hidden: z.record(z.boolean()),
  link: Link.optional(),
  commonParams: CommonParamsBase,
  layoutParams: z.record(z.any()).optional()
});
