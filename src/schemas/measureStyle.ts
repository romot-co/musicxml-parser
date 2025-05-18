import { z } from "zod";
import { YesNoEnum } from "./common";
import { NoteTypeValueEnum } from "./noteType";

/**
 * The multiple-rest element is used to indicate a multi-measure rest.
 * The content of the element is the number of measures in the rest.
 */
export const MultipleRestSchema = z.object({
  value: z.number().int(), // PCDATA is the number of measures
  useSymbols: YesNoEnum.optional(),
});

export const MeasureRepeatSchema = z.object({
  value: z.number().int(), // PCDATA is the number of measures
  type: z.enum(["start", "stop"]),
  slashes: z.number().int().optional(),
});

export const SlashDotSchema = z.object({});

export const BeatRepeatSchema = z.object({
  type: z.enum(["start", "stop"]),
  slashes: z.number().int().optional(),
  useDots: YesNoEnum.optional(),
  slashType: NoteTypeValueEnum.optional(),
  slashDot: z.array(SlashDotSchema).optional(),
  exceptVoice: z.array(z.string()).optional(), // PCDATA
});

export const SlashSchema = z.object({
  type: z.enum(["start", "stop"]),
  useDots: YesNoEnum.optional(),
  useStems: YesNoEnum.optional(),
  slashType: NoteTypeValueEnum.optional(),
  slashDot: z.array(SlashDotSchema).optional(),
  exceptVoice: z.array(z.string()).optional(), // PCDATA
});

/**
 * The measure-style element is used to style measures, for example,
 * to indicate a multi-measure rest or repeat.
 */
export const MeasureStyleSchema = z
  .object({
    multipleRest: MultipleRestSchema.optional(),
    measureRepeat: MeasureRepeatSchema.optional(),
    beatRepeat: BeatRepeatSchema.optional(),
    slash: SlashSchema.optional(),
    number: z.number().int().optional(), // attribute
    // font: FontSchema.optional(), // Placeholder for later
    // color: ColorSchema.optional(), // Placeholder for later
    // id: z.string().optional(), // for %optional-unique-id; - Placeholder for later
  })
  .refine(
    (data) => {
      const styles = [
        data.multipleRest,
        data.measureRepeat,
        data.beatRepeat,
        data.slash,
      ];
      return styles.filter((style) => style !== undefined).length === 1;
    },
    {
      message:
        "MeasureStyle must have exactly one of multipleRest, measureRepeat, beatRepeat, or slash",
    },
  );

export type MeasureStyle = z.infer<typeof MeasureStyleSchema>;
export type MultipleRest = z.infer<typeof MultipleRestSchema>;
export type MeasureRepeat = z.infer<typeof MeasureRepeatSchema>;
export type BeatRepeat = z.infer<typeof BeatRepeatSchema>;
export type Slash = z.infer<typeof SlashSchema>;
