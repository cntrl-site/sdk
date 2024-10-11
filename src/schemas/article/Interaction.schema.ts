import { z, ZodType } from 'zod';
import { Interaction, InteractionTrigger } from '../../types/article/Interaction';

const TriggerSchema = z.object({
  itemId: z.string(),
  type: z.enum(['hover-in', 'hover-out', 'click']),
  from: z.string(),
  to: z.string()
}) satisfies ZodType<InteractionTrigger>;

const StateSchema = z.object({
  id: z.string()
});

export const InteractionSchema = z.object({
  id: z.string(),
  triggers: z.array(TriggerSchema),
  states: z.array(StateSchema),
  startStateId: z.string(),
}) satisfies ZodType<Interaction>;
