import { z, ZodType } from 'zod';
import { RichTextBlockSchema, RichTextStyleSchema, TextStylesSchema } from './RichTextItem.schema';
import {
  HEADER_ELEMENT_KINDS,
  HeaderStructuredBlock,
  StructuredBlockAny,
  StructuredBlockHeaderCommonParams,
  TABLE_KINDS
} from '../../types/article/StructuredBlock';
import { StructuredBlockType } from '../../types/article/StructuredBlockType';
import { HeadingTag, Hyphens } from '../../types/article/RichText';
import {
  CodeBlockStateParamsSchema,
  ComponentBlockStateParamsSchema,
  DividerBlockStateParamsSchema,
  HeaderBlockStateParamsSchema,
  MediaBlockStateParamsSchema,
  RichTextBlockStateParamsSchema,
  TableBlockStateParamsSchema,
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

export const StructuredBlockTextStylesSchema = TextStylesSchema;

export const StructuredBlockComponentCommonParamsSchema = z.object({
  componentId: z.string(),
  content: z.any().optional(),
  parameters: z.record(z.any()).optional()
});

const StructuredBlockTextCommonParamsSchema = z.object({
  text: z.string(),
  blocks: z.array(RichTextBlockSchema)
});

export const StructuredBlockRichTextCommonParamsSchema = StructuredBlockTextCommonParamsSchema.extend({
  heading: z.nativeEnum(HeadingTag).optional()
});

export const StructuredBlockQuoteCommonParamsSchema = StructuredBlockTextCommonParamsSchema.extend({
  kind: z.string()
});

export const StructuredBlockDateCommonParamsSchema = StructuredBlockTextCommonParamsSchema.extend({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  format: z.string()
});

const pointerEvents = z.enum(['never', 'when_visible', 'always']).optional();

const ImageCaptionParamsSchema = z.object({
  caption: z.string().optional(),
  showCaption: z.boolean().optional()
});

// a url is empty where the API could not resolve the file, as it is on a header's key image until one is uploaded
export const StructuredBlockImageCommonParamsSchema = ImageCaptionParamsSchema.extend({
  urls: z.array(z.string()),
  altText: z.string()
});

export const StructuredBlockHeaderImageCommonParamsSchema = ImageCaptionParamsSchema.extend({
  url: z.string(),
  altText: z.string()
});

export const StructuredBlockVideoCommonParamsSchema = z.object({
  url: z.string(),
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

const StructuredBlockTableCellSchema = StructuredBlockTextCommonParamsSchema.extend({
  id: z.string().min(1),
  styles: z.record(z.array(RichTextStyleSchema))
});

export const StructuredBlockTableCommonParamsSchema = z.object({
  kind: z.enum(TABLE_KINDS),
  header: z.array(StructuredBlockTableCellSchema).min(1),
  rows: z.array(z.array(StructuredBlockTableCellSchema)).min(1)
});

export const StructuredBlockHeaderCommonParamsSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  date: z.string().min(1),
  image: z.string().min(1)
}) satisfies ZodType<StructuredBlockHeaderCommonParams>;

export const StructuredBlockRichTextLayoutParamsSchema = StructuredBlockTextStylesSchema.extend({
  rangeStyles: z.array(RichTextStyleSchema),
  columns: z.number().int().positive().optional(),
  columnGap: z.number().nonnegative().optional(),
  hyphens: z.nativeEnum(Hyphens).optional()
});

const StructuredBlockTableColumnSchema = z.object({
  width: z.number().min(0).max(1),
  paddingLeft: z.number().nonnegative(),
  paddingRight: z.number().nonnegative()
});

const StructuredBlockBoxParamsSchema = z.object({
  background: z.string().optional(),
  boxPaddingTop: z.number().nonnegative().optional(),
  boxPaddingRight: z.number().nonnegative().optional(),
  boxPaddingBottom: z.number().nonnegative().optional(),
  boxPaddingLeft: z.number().nonnegative().optional(),
  boxRadius: z.number().nonnegative().optional()
});

export const StructuredBlockTableLayoutParamsSchema = StructuredBlockTextStylesSchema.merge(StructuredBlockBoxParamsSchema).extend({
  cellPaddingTop: z.number().nonnegative(),
  cellPaddingBottom: z.number().nonnegative(),
  columns: z.array(StructuredBlockTableColumnSchema).min(1),
  borderColor: z.string().optional(),
  headingBackground: z.string().optional(),
  bodyBackground: z.string().optional()
});

export const StructuredBlockQuoteLayoutParamsSchema = StructuredBlockRichTextLayoutParamsSchema.merge(StructuredBlockBoxParamsSchema);

const StructuredBlockCaptionStylesSchema = StructuredBlockTextStylesSchema.extend({
  width: z.number().nonnegative().optional(),
  paddingTop: z.number().nonnegative().optional(),
  paddingBottom: z.number().nonnegative().optional()
});

export const StructuredBlockImageLayoutParamsSchema = z.object({
  opacity: z.number().nonnegative(),
  captionStyles: StructuredBlockCaptionStylesSchema.optional()
});

export const StructuredBlockVideoLayoutParamsSchema = z.object({
  play: z.enum(['on-hover', 'on-click', 'auto']),
  muted: z.boolean(),
  controls: z.boolean()
});

export const StructuredBlockDividerLayoutParamsSchema = z.object({
  color: z.string()
});

export const StructuredBlockHeaderLayoutParamsSchema = z.object({
  variant: z.enum(['A', 'B']),
  order: z.array(z.enum(HEADER_ELEMENT_KINDS)),
  hiddenElements: z.array(z.enum(HEADER_ELEMENT_KINDS)),
  imageFit: z.enum(['original', 'cover']),
  coverHeight: z.number().positive(),
  stickyImage: z.boolean().optional()
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

const TableStructuredBlockSchema = StructuredBlockBaseSchema.extend({
  type: z.literal(StructuredBlockType.Table),
  commonParams: StructuredBlockTableCommonParamsSchema,
  layoutParams: z.record(StructuredBlockTableLayoutParamsSchema),
  state: z.record(TableBlockStateParamsSchema)
});

/** A content-based section's header, kept out of the stack's union: the elements it points at are blocks of the stack. */
export const HeaderStructuredBlockSchema = StructuredBlockBaseSchema.extend({
  type: z.literal(StructuredBlockType.Header),
  commonParams: StructuredBlockHeaderCommonParamsSchema,
  layoutParams: z.record(StructuredBlockHeaderLayoutParamsSchema),
  state: z.record(HeaderBlockStateParamsSchema)
}) satisfies ZodType<HeaderStructuredBlock>;

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
  CodeStructuredBlockSchema,
  TableStructuredBlockSchema
]);
