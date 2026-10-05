import { z, ZodType } from 'zod';
import { RichTextBlockSchema, RichTextStyleSchema } from './RichTextItem.schema';
import {
  HeaderStructuredBlock,
  StructuredBlockAny,
  StructuredBlockCommonParamsMap,
  StructuredBlockLayoutParamsMap,
  StructuredBlockTextStyles
} from '../../types/article/StructuredBlock';
import { StructuredBlockType } from '../../types/article/StructuredBlockType';
import { TextAlign, TextTransform, VerticalAlign } from '../../types/article/RichText';
import {
  CodeBlockStateParamsSchema,
  ComponentBlockStateParamsSchema,
  DividerBlockStateParamsSchema,
  HeaderBlockStateParamsSchema,
  MediaBlockStateParamsSchema,
  RichTextBlockStateParamsSchema,
  VideoEmbedBlockStateParamsSchema
} from './ItemState.schema';
import { ComponentItemLayoutParamsSchema, VimeoEmbedLayoutParamsSchema, YoutubeEmbedLayoutParamsSchema } from './ElementLayoutParams.schema';

export const StructuredBlockAreaSchema = z.object({
  width: z.number().nonnegative().optional(),
  height: z.number().nonnegative().optional(),
  paddingTop: z.number().optional(),
  zIndex: z.number(),
  alignment: z.enum(['left', 'center', 'right']).optional(),
  horizontalOffset: z.number().optional(),
  left: z.number().optional(),
  innerPaddingTop: z.number().nonnegative().optional(),
  innerPaddingBottom: z.number().nonnegative().optional()
});

export const StructuredBlockTextStylesSchema = z.object({
  typeFace: z.string(),
  fontSize: z.number(),
  lineHeight: z.number(),
  letterSpacing: z.number(),
  wordSpacing: z.number(),
  fontWeight: z.number(),
  fontStyle: z.string(),
  fontVariant: z.string(),
  textTransform: z.nativeEnum(TextTransform),
  verticalAlign: z.nativeEnum(VerticalAlign),
  textAlign: z.nativeEnum(TextAlign),
  color: z.string()
}) satisfies ZodType<StructuredBlockTextStyles>;

export const StructuredBlockComponentCommonParamsSchema = z.object({
  componentId: z.string(),
  content: z.any().optional(),
  parameters: z.record(z.any()).optional()
});

export const StructuredBlockRichTextCommonParamsSchema = z.object({
  text: z.string(),
  blocks: z.array(RichTextBlockSchema)
});

export const StructuredBlockQuoteCommonParamsSchema = StructuredBlockRichTextCommonParamsSchema.extend({
  kind: z.string()
});

export const StructuredBlockDateCommonParamsSchema = StructuredBlockRichTextCommonParamsSchema.extend({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  format: z.string()
});

const pointerEvents = z.enum(['never', 'when_visible', 'always']).optional();

export const StructuredBlockImageCommonParamsSchema = z.object({
  urls: z.array(z.string().min(1)),
  altText: z.string(),
  caption: z.string().optional()
});

// empty until an image is uploaded: a header always has its key image slot
export const StructuredBlockHeaderImageCommonParamsSchema = z.object({
  url: z.string(),
  altText: z.string(),
  caption: z.string().optional()
});

export const StructuredBlockVideoCommonParamsSchema = z.object({
  url: z.string().min(1),
  coverUrl: z.string().nullable()
});

const CodeTokenSchema = z.object({
  content: z.string(),
  color: z.string().optional(),
  fontStyle: z.number().int().nonnegative().optional()
});

export const StructuredBlockCodeCommonParamsSchema = z.object({
  code: z.string(),
  language: z.string(),
  theme: z.string(),
  lines: z.array(z.array(CodeTokenSchema)),
  colors: z.object({
    background: z.string(),
    foreground: z.string()
  }).optional()
});

export const StructuredBlockHeaderCommonParamsSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  date: z.string().min(1),
  image: z.string().min(1)
});

export const StructuredBlockRichTextLayoutParamsSchema = StructuredBlockTextStylesSchema.extend({
  rangeStyles: z.array(RichTextStyleSchema)
});

export const StructuredBlockQuoteLayoutParamsSchema = StructuredBlockRichTextLayoutParamsSchema.extend({
  background: z.string().optional(),
  boxPadding: z.number().nonnegative().optional(),
  boxRadius: z.number().nonnegative().optional()
});

export const StructuredBlockImageLayoutParamsSchema = z.object({
  opacity: z.number().nonnegative(),
  captionStyles: StructuredBlockTextStylesSchema.optional()
});

export const StructuredBlockVideoLayoutParamsSchema = z.object({
  play: z.enum(['on-hover', 'on-click', 'auto']),
  muted: z.boolean(),
  controls: z.boolean()
});

export const StructuredBlockDividerLayoutParamsSchema = z.object({
  color: z.string()
});

const HEADER_ELEMENT_KINDS = ['image', 'subtitle', 'title', 'date'] as const;

export const StructuredBlockHeaderLayoutParamsSchema = z.object({
  variant: z.enum(['A', 'B']),
  order: z.array(z.enum(HEADER_ELEMENT_KINDS)),
  hiddenElements: z.array(z.enum(HEADER_ELEMENT_KINDS)),
  imageFit: z.enum(['original', 'cover']),
  coverHeight: z.number().positive()
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

const QuoteStructuredBlockSchema = StructuredBlockBaseSchema.extend({
  type: z.literal(StructuredBlockType.Quote),
  commonParams: StructuredBlockQuoteCommonParamsSchema,
  layoutParams: z.record(StructuredBlockQuoteLayoutParamsSchema),
  state: z.record(RichTextBlockStateParamsSchema)
});

const DateStructuredBlockSchema = StructuredBlockBaseSchema.extend({
  type: z.literal(StructuredBlockType.Date),
  commonParams: StructuredBlockDateCommonParamsSchema,
  layoutParams: z.record(StructuredBlockRichTextLayoutParamsSchema),
  state: z.record(RichTextBlockStateParamsSchema)
});

const ImageStructuredBlockSchema = StructuredBlockBaseSchema.extend({
  type: z.literal(StructuredBlockType.Image),
  commonParams: StructuredBlockImageCommonParamsSchema,
  layoutParams: z.record(StructuredBlockImageLayoutParamsSchema),
  state: z.record(MediaBlockStateParamsSchema)
});

const HeaderImageStructuredBlockSchema = StructuredBlockBaseSchema.extend({
  type: z.literal(StructuredBlockType.HeaderImage),
  commonParams: StructuredBlockHeaderImageCommonParamsSchema,
  layoutParams: z.record(StructuredBlockImageLayoutParamsSchema),
  state: z.record(MediaBlockStateParamsSchema)
});

const VideoStructuredBlockSchema = StructuredBlockBaseSchema.extend({
  type: z.literal(StructuredBlockType.Video),
  commonParams: StructuredBlockVideoCommonParamsSchema,
  layoutParams: z.record(StructuredBlockVideoLayoutParamsSchema),
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

const DividerStructuredBlockSchema = StructuredBlockBaseSchema.extend({
  type: z.literal(StructuredBlockType.Divider),
  commonParams: z.object({}),
  layoutParams: z.record(StructuredBlockDividerLayoutParamsSchema),
  state: z.record(DividerBlockStateParamsSchema)
});

const CodeStructuredBlockSchema = StructuredBlockBaseSchema.extend({
  type: z.literal(StructuredBlockType.Code),
  commonParams: StructuredBlockCodeCommonParamsSchema,
  // drawn in a fixed box: nothing per layout
  layoutParams: z.record(z.object({})),
  state: z.record(CodeBlockStateParamsSchema)
});

/** A content-based section's header, kept out of the stack's union: the elements it points at are blocks of the stack. */
export const HeaderStructuredBlockSchema = StructuredBlockBaseSchema.extend({
  type: z.literal(StructuredBlockType.Header),
  commonParams: StructuredBlockHeaderCommonParamsSchema,
  layoutParams: z.record(StructuredBlockHeaderLayoutParamsSchema),
  state: z.record(HeaderBlockStateParamsSchema)
}) satisfies ZodType<HeaderStructuredBlock>;

export const StructuredBlockCommonParamsSchema: ZodType<StructuredBlockCommonParamsMap[StructuredBlockType]> = z.union([
  StructuredBlockComponentCommonParamsSchema,
  // a quote's and a date's params are a text block's and more, so they go before it: the text
  // member would take them too, less the rest
  StructuredBlockQuoteCommonParamsSchema,
  StructuredBlockDateCommonParamsSchema,
  StructuredBlockRichTextCommonParamsSchema,
  StructuredBlockImageCommonParamsSchema,
  StructuredBlockHeaderImageCommonParamsSchema,
  StructuredBlockCodeCommonParamsSchema,
  StructuredBlockHeaderCommonParamsSchema,
  StructuredBlockVideoCommonParamsSchema
]);

export const StructuredBlockLayoutParamsSchema: ZodType<StructuredBlockLayoutParamsMap[StructuredBlockType]> = z.union([
  ComponentItemLayoutParamsSchema,
  // first for the same reason: the text member would keep a quote's text and drop its box
  StructuredBlockQuoteLayoutParamsSchema,
  StructuredBlockRichTextLayoutParamsSchema,
  StructuredBlockImageLayoutParamsSchema,
  StructuredBlockVideoLayoutParamsSchema,
  StructuredBlockHeaderLayoutParamsSchema,
  StructuredBlockDividerLayoutParamsSchema
]);

export const StructuredBlockSchema: ZodType<StructuredBlockAny> = z.discriminatedUnion('type', [
  ComponentStructuredBlockSchema,
  RichTextStructuredBlockSchema,
  ImageStructuredBlockSchema,
  VimeoEmbedStructuredBlockSchema,
  YoutubeEmbedStructuredBlockSchema,
  DividerStructuredBlockSchema,
  DateStructuredBlockSchema,
  HeaderImageStructuredBlockSchema,
  VideoStructuredBlockSchema,
  QuoteStructuredBlockSchema,
  CodeStructuredBlockSchema
]);
