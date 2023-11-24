import { z } from 'zod';
import { SectionSchema } from './Section.schema';

export const ArticleSchema = z.object({
  id: z.string().min(1),
  sections: z.array(SectionSchema)
});
