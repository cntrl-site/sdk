import { z, ZodType } from 'zod';
import {
  CustomHoverStateParams, EmbedHoverStateParams, GroupHoverStateParams,
  MediaHoverStateParams,
  RectangleHoverStateParams, RichTextHoverStateParams
} from '../../types/article/ItemState';

export const getHoverParamsSchema = <T extends z.ZodTypeAny>(schema: T) => {
  return z.object({
    timing: z.string(),
    duration: z.number(),
    delay: z.number(),
    value: schema
  }).optional();
};

export const ItemHoverStateBaseSchema = z.object({
  width: getHoverParamsSchema(z.number()),
  height: getHoverParamsSchema(z.number()),
  angle: getHoverParamsSchema(z.number()),
  top: getHoverParamsSchema(z.number()),
  left: getHoverParamsSchema(z.number()),
  scale: getHoverParamsSchema(z.number()),
  blur: getHoverParamsSchema(z.number())
});

export const MediaHoverStateParamsSchema =
  z.object({
    opacity: getHoverParamsSchema(z.number()),
    radius: getHoverParamsSchema(z.number()),
    strokeWidth: getHoverParamsSchema(z.number()),
    strokeColor: getHoverParamsSchema(z.string())
  })
    .merge(ItemHoverStateBaseSchema) satisfies ZodType<MediaHoverStateParams>;

export const RectangleHoverStateParamsSchema = z.object({
  strokeWidth: getHoverParamsSchema(z.number()),
  radius: getHoverParamsSchema(z.number()),
  fillColor: getHoverParamsSchema(z.string()),
  strokeColor: getHoverParamsSchema(z.string()),
  backdropBlur: getHoverParamsSchema(z.number())
}).merge(ItemHoverStateBaseSchema) satisfies ZodType<RectangleHoverStateParams>;

export const CustomItemHoverStateParamsSchema = ItemHoverStateBaseSchema satisfies ZodType<CustomHoverStateParams>;

export const EmbedHoverStateParamsSchema = z.object({
  radius: getHoverParamsSchema(z.number()),
  opacity: getHoverParamsSchema(z.number().nonnegative())
}).merge(ItemHoverStateBaseSchema) satisfies ZodType<EmbedHoverStateParams>;

export const RichTextHoverStateParamsSchema = z.object({
  color: getHoverParamsSchema(z.string()),
  letterSpacing: getHoverParamsSchema(z.number()),
  wordSpacing: getHoverParamsSchema(z.number())
}).merge(ItemHoverStateBaseSchema) satisfies ZodType<RichTextHoverStateParams>;

export const GroupHoverStateParamsSchema = z.object({
  opacity: getHoverParamsSchema(z.number().nonnegative())
}).merge(ItemHoverStateBaseSchema) satisfies ZodType<GroupHoverStateParams>;

export const ItemHoverStateParamsSchema = z.union([
  EmbedHoverStateParamsSchema,
  MediaHoverStateParamsSchema,
  RectangleHoverStateParamsSchema,
  RichTextHoverStateParamsSchema,
  CustomItemHoverStateParamsSchema,
  GroupHoverStateParamsSchema
]);
