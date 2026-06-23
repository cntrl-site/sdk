import { AreaAnchor } from '../../types/article/ItemArea';
import { CodeEmbedLayoutParams, ComponentLayoutParams, CompoundLayoutParams, CustomLayoutParams, GroupLayoutParams, ImageLayoutParams, RectangleLayoutParams, VideoLayoutParams, VimeoEmbedLayoutParams, YoutubeEmbedLayoutParams } from '../../types/article/Params.type';
import { FillLayerSchema } from './FillLayer.schema';
import { z, ZodType } from 'zod';

export const ImageLayoutParamsSchema = z.object({
  opacity: z.number().nonnegative(),
  radius: z.number(),
  strokeWidth: z.number(),
  strokeFill: z.array(FillLayerSchema),
  blur: z.number(),
  isDraggable: z.boolean().optional(),
  blendMode: z.string().optional()
}) satisfies ZodType<ImageLayoutParams>;

export const VideoLayoutParamsSchema = z.object({
  scrollPlayback: z.object({
    from: z.number(),
    to: z.number()
  }).nullable(),
  opacity: z.number().nonnegative(),
  radius: z.number(),
  strokeWidth: z.number(),
  strokeFill: z.array(FillLayerSchema),
  blur: z.number(),
  isDraggable: z.boolean().optional(),
  blendMode: z.string().optional(),
  play: z.enum(['on-hover', 'on-click', 'auto']),
  muted: z.boolean(),
  controls: z.boolean(),
}) satisfies ZodType<VideoLayoutParams>;

export const RectangleLayoutParamsSchema = z.object({
  radius: z.number(),
  strokeWidth: z.number(),
  fill: z.array(FillLayerSchema),
  strokeFill: z.array(FillLayerSchema),
  blur: z.number(),
  backdropBlur: z.number(),
  blurMode: z.enum(['default', 'backdrop']),
  isDraggable: z.boolean().optional(),
  blendMode: z.string().optional()
}) satisfies ZodType<RectangleLayoutParams>;

export const CustomLayoutParamsSchema = z.object({
  isDraggable: z.boolean().optional(),
  blendMode: z.string().optional()
}) satisfies ZodType<CustomLayoutParams>;

export const VimeoEmbedLayoutParamsSchema = z.object({
  radius: z.number(),
  blur: z.number(),
  opacity: z.number().nonnegative(),
  play: z.union([z.literal('on-hover'), z.literal('on-click'), z.literal('auto')]),
  controls: z.boolean(),
  loop: z.boolean(),
  muted: z.boolean(),
  pictureInPicture: z.boolean(),
  blendMode: z.string().optional()
}) satisfies ZodType<VimeoEmbedLayoutParams>;

export const YoutubeEmbedLayoutParamsSchema = z.object({
  radius: z.number(),
  blur: z.number(),
  opacity: z.number().nonnegative(),
  play: z.enum(['on-hover', 'on-click', 'auto']),
  controls: z.boolean(),
  loop: z.boolean(),
  blendMode: z.string().optional()
}) satisfies ZodType<YoutubeEmbedLayoutParams>;

export const CodeEmbedLayoutParamsSchema = z.object({
  areaAnchor:  z.nativeEnum(AreaAnchor),
  opacity: z.number().nonnegative(),
  blur: z.number(),
  isDraggable: z.boolean().optional(),
  blendMode: z.string().optional()
}) satisfies ZodType<CodeEmbedLayoutParams>;

export const ComponentItemLayoutParamsSchema = z.object({
  sizing: z.string().optional(),
  opacity: z.number().nonnegative(),
  blur: z.number(),
  parameters: z.any().optional(),
  blendMode: z.string().optional(),
}) satisfies ZodType<ComponentLayoutParams>;

export const GroupLayoutParamsSchema = z.object({
  opacity: z.number().nonnegative(),
  blur: z.number(),
  isDraggable: z.boolean().optional(),
  blendMode: z.string().optional()
}) satisfies ZodType<GroupLayoutParams>;

export const CompoundLayoutParamsSchema = z.object({
  opacity: z.number().nonnegative(),
  isDraggable: z.boolean().optional(),
  blendMode: z.string().optional()
}) satisfies ZodType<CompoundLayoutParams>;

