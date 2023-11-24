import { z } from 'zod';
import { AnchorSide, ScaleAnchor } from '../../types/article/ItemArea';

export const ItemAreaSchema = z.object({
  top: z.number(),
  left: z.number(),
  width: z.number(),
  height: z.number(),
  zIndex: z.number(),
  angle: z.number(),
  anchorSide: z.nativeEnum(AnchorSide).optional(),
  scale: z.number().nonnegative(),
  scaleAnchor: z.nativeEnum(ScaleAnchor)
});
