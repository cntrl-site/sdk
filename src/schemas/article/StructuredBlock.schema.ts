import { z, ZodType } from 'zod';
import { RichTextBlockSchema, RichTextStyleSchema } from './RichTextItem.schema';
import { FXControlSchema } from './Item.schema';
import { StructuredBlockAny, StructuredBlockCommonParamsMap, StructuredBlockLayoutParamsMap } from '../../types/article/StructuredBlock';
import { FillLayerSchema } from './FillLayer.schema';
import { StructuredBlockType } from '../../types/article/StructuredBlockType';
import { ComponentBlockStateParamsSchema, MediaBlockStateParamsSchema, RichTextBlockStateParamsSchema, VideoEmbedBlockStateParamsSchema } from './ItemState.schema';
import { ComponentItemLayoutParamsSchema, VimeoEmbedLayoutParamsSchema, YoutubeEmbedLayoutParamsSchema } from './ElementLayoutParams.schema';

export const StructuredBlockAreaSchema = z.object({
  width: z.number().nonnegative().optional(),
  height: z.number().nonnegative().optional(),
  paddingTop: z.number().optional(),
  zIndex: z.number()
});

export const StructuredBlockComponentCommonParamsSchema = z.object({
  componentId: z.string(),
  content: z.any().optional(),
  parameters: z.record(z.any()).optional()
});

export const StructuredBlockRichTextCommonParamsSchema = z.object({
  text: z.string(),
  preset: z.string(),
  blocks: z.array(RichTextBlockSchema)
});

const pointerEvents = z.enum(['never', 'when_visible', 'always']).optional();

const FXParamsSchema = z.object({
  hasGLEffect: z.boolean(),
  fragmentShader: z.string().nullable(),
  shaderName: z.string().nullable(),
  FXControls: z.array(FXControlSchema),
  FXTextures: z.array(z.string()).optional()
});

export const StructuredBlockImageCommonParamsSchema = z.object({
  url: z.string().min(1),
  ratioLock: z.boolean(),
  isPlaceholder: z.boolean().optional(),
  altText: z.string(),
  caption: z.string().optional(),
  pointerEvents
}).merge(FXParamsSchema);

export const StructuredBlockRichTextLayoutParamsSchema = z.object({
  rangeStyles: z.array(RichTextStyleSchema)
});

export const StructuredBlockImageLayoutParamsSchema = z.object({
  opacity: z.number().nonnegative(),
  radius: z.number(),
  strokeWidth: z.number(),
  strokeFill: z.array(FillLayerSchema),
  blur: z.number(),
  isDraggable: z.boolean().optional(),
  blendMode: z.string().optional()
});

const StructuredBlockBaseSchema = z.object({
  id: z.string().min(1),
  label: z.string().optional().nullable(),
  area: z.record(StructuredBlockAreaSchema),
  hidden: z.record(z.boolean()).optional()
});

const ComponentStructuredBlockSchema = StructuredBlockBaseSchema.extend({
  type: z.literal(StructuredBlockType.Component),
  commonParams: StructuredBlockComponentCommonParamsSchema,
  layoutParams: z.record(ComponentItemLayoutParamsSchema),
  state: z.record(ComponentBlockStateParamsSchema)
});

const RichTextStructuredBlockSchema = StructuredBlockBaseSchema.extend({
  type: z.literal(StructuredBlockType.RichText),
  commonParams: StructuredBlockRichTextCommonParamsSchema,
  layoutParams: z.record(StructuredBlockRichTextLayoutParamsSchema),
  state: z.record(RichTextBlockStateParamsSchema)
});

const ImageStructuredBlockSchema = StructuredBlockBaseSchema.extend({
  type: z.literal(StructuredBlockType.Image),
  commonParams: StructuredBlockImageCommonParamsSchema,
  layoutParams: z.record(StructuredBlockImageLayoutParamsSchema),
  state: z.record(MediaBlockStateParamsSchema)
});

const VimeoEmbedStructuredBlockSchema = StructuredBlockBaseSchema.extend({
  type: z.literal(StructuredBlockType.VimeoEmbed),
  commonParams: z.object({
    url: z.string().min(1),
    coverUrl: z.string().nullable(),
    ratioLock: z.boolean(),
    pointerEvents
  }),
  layoutParams: z.record(VimeoEmbedLayoutParamsSchema),
  state: z.record(VideoEmbedBlockStateParamsSchema)
});

const YoutubeEmbedStructuredBlockSchema = StructuredBlockBaseSchema.extend({
  type: z.literal(StructuredBlockType.YoutubeEmbed),
  commonParams: z.object({
    url: z.string().min(1),
    coverUrl: z.string().nullable(),
    ratioLock: z.boolean(),
    pointerEvents
  }),
  layoutParams: z.record(YoutubeEmbedLayoutParamsSchema),
  state: z.record(VideoEmbedBlockStateParamsSchema)
});

export const StructuredBlockCommonParamsSchema: ZodType<StructuredBlockCommonParamsMap[StructuredBlockType]> = z.union([
  StructuredBlockComponentCommonParamsSchema,
  StructuredBlockRichTextCommonParamsSchema,
  StructuredBlockImageCommonParamsSchema
]);

export const StructuredBlockLayoutParamsSchema: ZodType<StructuredBlockLayoutParamsMap[StructuredBlockType]> = z.union([
  ComponentItemLayoutParamsSchema,
  StructuredBlockRichTextLayoutParamsSchema,
  StructuredBlockImageLayoutParamsSchema
]);

export const StructuredBlockSchema: ZodType<StructuredBlockAny> = z.discriminatedUnion('type', [
  ComponentStructuredBlockSchema,
  RichTextStructuredBlockSchema,
  ImageStructuredBlockSchema,
  VimeoEmbedStructuredBlockSchema,
  YoutubeEmbedStructuredBlockSchema
]);
