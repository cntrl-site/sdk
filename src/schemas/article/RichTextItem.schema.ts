import { z, ZodType } from 'zod';
import { HeadingTag, Hyphens, RichTextBlock, TextAlign, TextTransform, VerticalAlign } from '../../types/article/RichText';
import { ItemBaseSchema } from './ItemBase.schema';
import { ArticleItemType } from '../../types/article/ArticleItemType';
import { RichTextStateParamsSchema } from './ItemState.schema';
import { RichTextItem } from '../../types/article/Item';
import { StructuredBlockTextStyles } from '../../types/article/StructuredBlock';

const pointerEvents = z.enum(['never', 'when_visible', 'always']).optional();

export const RichTextEntitySchema = z.object({
  start: z.number().nonnegative(),
  end: z.number().nonnegative(),
  type: z.string(),
  data: z.any().optional()
});

export const RichTextStyleSchema = z.object({
  start: z.number().nonnegative(),
  end: z.number().nonnegative(),
  style: z.string().min(1),
  value: z.string().optional()
});

export const RichTextBlockSchema: z.Schema<RichTextBlock> = z.lazy(() => (
  z.object({
    start: z.number().nonnegative(),
    end: z.number().nonnegative(),
    type: z.string().min(1),
    entities: z.array(RichTextEntitySchema).optional(),
    children: z.array(RichTextBlockSchema).optional(),
    data: z.any().optional()
  })
));

/** The type text is set in: a rich text item's, and the styles a structured block's text is served with. */
export const TextStylesSchema = z.object({
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

export const RichTextItemSchema = ItemBaseSchema.extend({
  type: z.literal(ArticleItemType.RichText),
  commonParams: z.object({
    text: z.string(),
    blocks: z.array(RichTextBlockSchema).optional(),
    heading: z.nativeEnum(HeadingTag).nullable().optional(),
    pointerEvents
  }),
  sticky: z.record(
    z.object({
      from: z.number(),
      to: z.number().optional()
    }).nullable(),
  ),
  layoutParams: z.record(
    TextStylesSchema.extend({
      rangeStyles: z.array(RichTextStyleSchema).optional(),
      sizing: z.string(),
      blur: z.number(),
      columns: z.number().optional(),
      columnWidth: z.number().optional(),
      columnGutter: z.number().optional(),
      hyphens: z.nativeEnum(Hyphens).optional(),
      isDraggable: z.boolean().optional(),
      blendMode: z.string().optional()
    })
  ),
  state: z.record(RichTextStateParamsSchema)
}) satisfies ZodType<RichTextItem>;
