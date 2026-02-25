import { z } from 'zod';
import { AnchorSide, PositionType, AreaAnchor, DimensionsType } from '../../types/article/ItemArea';

export const ItemAreaSchema = z.object({
  top: z.number(),
  left: z.number(),
  width: z.number(),
  height: z.number(),
  zIndex: z.number(),
  angle: z.number(),
  anchorSide: z.nativeEnum(AnchorSide).optional(),
  scale: z.number().nonnegative(),
  positionType: z.nativeEnum(PositionType),
  dimensionsType: z.nativeEnum(DimensionsType).optional(),
  scaleAnchor: z.nativeEnum(AreaAnchor)
});
