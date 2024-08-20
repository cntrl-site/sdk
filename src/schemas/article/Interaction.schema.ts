import { z, ZodType } from 'zod';
import { Interaction, InteractionTrigger } from '../../types/article/Interaction';

const TriggerSchema = z.object({
  itemId: z.string(),
  type: z.enum(['hover-on', 'hover-on-off', 'click']),
  to: z.string()
}) satisfies ZodType<InteractionTrigger>;

const StateSchema = z.object({
  id: z.string()
});

export const InteractionSchema = z.object({
  id: z.string(),
  triggers: z.array(TriggerSchema),
  states: z.array(StateSchema)
}) satisfies ZodType<Interaction>;
