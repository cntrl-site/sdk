import { KeyframeType } from '../../types/keyframe/Keyframe';
import { z } from 'zod';

const KeyframesBaseSchema = z.object({
  id: z.string().min(1),
  layoutId: z.string().min(1),
  itemId: z.string().min(1),
  position: z.number()
});

const DimensionsKeyframeSchema = KeyframesBaseSchema.extend({
  type: z.literal(KeyframeType.Dimensions),
  value: z.object({
    width: z.number().nonnegative(),
    height: z.number().nonnegative()
  })
});

const PositionKeyframeSchema = KeyframesBaseSchema.extend({
  type: z.literal(KeyframeType.Position),
  value: z.object({
    top: z.number(),
    left: z.number()
  })
});

const RotationKeyframeSchema = KeyframesBaseSchema.extend({
  type: z.literal(KeyframeType.Rotation),
  value: z.object({
    angle: z.number()
  })
});

const BorderRadiusKeyframeSchema = KeyframesBaseSchema.extend({
  type: z.literal(KeyframeType.BorderRadius),
  value: z.object({
    radius: z.number().nonnegative()
  })
});

const BorderWidthKeyframeSchema = KeyframesBaseSchema.extend({
  type: z.literal(KeyframeType.BorderWidth),
  value: z.object({
    borderWidth: z.number().nonnegative()
  })
});

const ColorKeyframeSchema = KeyframesBaseSchema.extend({
  type: z.literal(KeyframeType.Color),
  value: z.object({
    color: z.string()
  })
});

const BorderColorKeyframeSchema = KeyframesBaseSchema.extend({
  type: z.literal(KeyframeType.BorderColor),
  value: z.object({
    color: z.string()
  })
});

const OpacityKeyframeSchema = KeyframesBaseSchema.extend({
  type: z.literal(KeyframeType.Opacity),
  value: z.object({
    opacity: z.number().nonnegative()
  })
});

const ScaleKeyframeSchema = KeyframesBaseSchema.extend({
  type: z.literal(KeyframeType.Scale),
  value: z.object({
    scale: z.number().nonnegative()
  })
});

const BlurKeyframeSchema = KeyframesBaseSchema.extend({
  type: z.literal(KeyframeType.Blur),
  value: z.object({
    blur: z.number()
  })
});

const BackdropBlurKeyframeSchema = KeyframesBaseSchema.extend({
  type: z.literal(KeyframeType.BackdropBlur),
  value: z.object({
    backdropBlur: z.number()
  })
});

const TextColorKeyframeSchema = KeyframesBaseSchema.extend({
  type: z.literal(KeyframeType.TextColor),
  value: z.object({
    color: z.string()
  })
});

const LetterSpacingKeyframeSchema = KeyframesBaseSchema.extend({
  type: z.literal(KeyframeType.LetterSpacing),
  value: z.object({
    letterSpacing: z.number()
  })
});

const WordSpacingKeyframeSchema = KeyframesBaseSchema.extend({
  type: z.literal(KeyframeType.WordSpacing),
  value: z.object({
    wordSpacing: z.number()
  })
});

const FXParamsKeyframeSchema = KeyframesBaseSchema.extend({
  type: z.literal(KeyframeType.FXParams),
  value: z.record(z.string(), z.number())
});

export const KeyframeSchema = z.discriminatedUnion('type', [
  DimensionsKeyframeSchema,
  PositionKeyframeSchema,
  RotationKeyframeSchema,
  BorderRadiusKeyframeSchema,
  BorderWidthKeyframeSchema,
  ColorKeyframeSchema,
  BorderColorKeyframeSchema,
  OpacityKeyframeSchema,
  ScaleKeyframeSchema,
  BlurKeyframeSchema,
  BackdropBlurKeyframeSchema,
  TextColorKeyframeSchema,
  LetterSpacingKeyframeSchema,
  WordSpacingKeyframeSchema,
  FXParamsKeyframeSchema
]);

export const KeyframesSchema = z.array(KeyframeSchema);
