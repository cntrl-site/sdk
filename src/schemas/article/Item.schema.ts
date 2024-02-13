import { z, ZodType } from 'zod';
import {
  CustomItem,
  ImageItem,
  ItemAny,
  RectangleItem,
  VideoItem,
  VimeoEmbedItem,
  YoutubeEmbedItem
} from '../../types/article/Item';
import {
  CustomItemHoverStateParamsSchema,
  EmbedHoverStateParamsSchema, GroupHoverStateParamsSchema, MediaHoverStateParamsSchema,
  RectangleHoverStateParamsSchema
} from './ItemState.schema';
import { RichTextItemSchema } from './RichTextItem.schema';
import { ItemBaseSchema } from './ItemBase.schema';
import { ArticleItemType } from '../../types/article/ArticleItemType';
import { FXControlAny } from '../../types/article/FX';

export const FXControlSchema = z.discriminatedUnion('type',[
  z.object({
    type: z.literal('float'),
    shaderParam: z.string(),
    value: z.number()
  }),
  z.object({
    type: z.literal('int'),
    shaderParam: z.string(),
    value: z.number()
  }),
  z.object({
    type: z.literal('vec2'),
    shaderParam: z.string(),
    value: z.tuple([z.number(), z.number()])
  })
]) satisfies ZodType<FXControlAny>;

const ImageItemSchema = ItemBaseSchema.extend({
  type: z.literal(ArticleItemType.Image),
  commonParams: z.object({
    url: z.string().min(1),
    hasGLEffect: z.boolean().optional(),
    fragmentShader: z.string().optional(),
    FXCursor: z.object({
      type: z.enum(['mouse', 'manual']),
      x: z.number(),
      y: z.number()
    }).optional(),
    FXControls: z.array(FXControlSchema).optional()
  }),
  sticky: z.record(
    z.object({
      from: z.number(),
      to: z.number().optional()
    }).nullable(),
  ),
  layoutParams: z.record(
    z.object({
      opacity: z.number().nonnegative(),
      radius: z.number(),
      strokeWidth: z.number(),
      strokeColor: z.string(),
      blur: z.number()
    })
  ),
  state: z.object({
    hover: z.record(MediaHoverStateParamsSchema)
  })
}) satisfies ZodType<ImageItem>;

const VideoItemSchema = ItemBaseSchema.extend({
  type: z.literal(ArticleItemType.Video),
  commonParams: z.object({
    url: z.string().min(1)
  }),
  sticky: z.record(
    z.object({
      from: z.number(),
      to: z.number().optional()
    }).nullable(),
  ),
  layoutParams: z.record(
    z.object({
      autoplay: z.boolean(),
      scrollPlayback: z.object({
        from: z.number(),
        to: z.number()
      }).nullable(),
      opacity: z.number().nonnegative(),
      radius: z.number(),
      strokeWidth: z.number(),
      strokeColor: z.string(),
      blur: z.number()
    })
  ),
  state: z.object({
    hover: z.record(MediaHoverStateParamsSchema)
  })
}) satisfies ZodType<VideoItem>;

const RectangleItemSchema = ItemBaseSchema.extend({
  type: z.literal(ArticleItemType.Rectangle),
  commonParams: z.object({
    ratioLock: z.boolean()
  }),
  sticky: z.record(
    z.object({
      from: z.number(),
      to: z.number().optional()
    }).nullable(),
  ),
  layoutParams: z.record(
    z.object({
      radius: z.number(),
      strokeWidth: z.number(),
      fillColor: z.string().min(1),
      strokeColor: z.string().min(1),
      blur: z.number(),
      backdropBlur: z.number(),
      blurMode: z.enum(['default', 'backdrop'])
    })
  ),
  state: z.object({
    hover: z.record(RectangleHoverStateParamsSchema)
  })
}) satisfies ZodType<RectangleItem>;

const CustomItemSchema = ItemBaseSchema.extend({
  type: z.literal(ArticleItemType.Custom),
  commonParams: z.object({
    name: z.string()
  }),
  sticky: z.record(
    z.object({
      from: z.number(),
      to: z.number().optional()
    }).nullable(),
  ),
  layoutParams: z.record(z.object({})),
  state: z.object({
    hover: z.record(CustomItemHoverStateParamsSchema)
  })
}) satisfies ZodType<CustomItem>;

const VimeoEmbedItemSchema = ItemBaseSchema.extend({
  type: z.literal(ArticleItemType.VimeoEmbed),
  commonParams: z.object({
    play: z.union([z.literal('on-hover'), z.literal('on-click'), z.literal('auto')]),
    controls: z.boolean(),
    loop: z.boolean(),
    muted: z.boolean(),
    pictureInPicture: z.boolean(),
    url: z.string().min(1),
    ratioLock: z.boolean()
  }),
  sticky: z.record(
    z.object({
      from: z.number(),
      to: z.number().optional()
    }).nullable(),
  ),
  layoutParams: z.record(
    z.object({
      radius: z.number(),
      blur: z.number()
    })
  ),
  state: z.object({
    hover: z.record(EmbedHoverStateParamsSchema)
  })
}) satisfies ZodType<VimeoEmbedItem>;

const YoutubeEmbedItemSchema = ItemBaseSchema.extend({
  type: z.literal(ArticleItemType.YoutubeEmbed),
  commonParams: z.object({
    play: z.enum(['on-hover', 'on-click', 'auto']),
    controls: z.boolean(),
    loop: z.boolean(),
    url: z.string().min(1)
  }),
  sticky: z.record(
    z.object({
      from: z.number(),
      to: z.number().optional()
    }).nullable(),
  ),
  layoutParams: z.record(
    z.object({
      radius: z.number(),
      blur: z.number()
    })
  ),
  state: z.object({
    hover: z.record(EmbedHoverStateParamsSchema)
  })
}) satisfies ZodType<YoutubeEmbedItem>;

export const ItemSchema: ZodType<ItemAny> = z.lazy(() => z.discriminatedUnion('type', [
  ImageItemSchema,
  VideoItemSchema,
  RectangleItemSchema,
  CustomItemSchema,
  RichTextItemSchema,
  VimeoEmbedItemSchema,
  YoutubeEmbedItemSchema,
  ItemBaseSchema.extend({
    type: z.literal(ArticleItemType.Group),
    commonParams: z.object({}),
    items: z.array(ItemSchema),
    sticky: z.record(
      z.object({
        from: z.number(),
        to: z.number().optional()
      }).nullable(),
    ),
    layoutParams: z.record(
      z.object({
        opacity: z.number().nonnegative()
      })
    ),
    state: z.object({
      hover: z.record(GroupHoverStateParamsSchema)
    })
  })
]));
