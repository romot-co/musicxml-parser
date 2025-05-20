import { z } from "zod";
import { FontStyleEnum, FontWeightEnum } from "./common";

export const ExtendSchema = z.object({
  type: z.enum(["start", "stop", "continue"]).optional(),
});
export type Extend = z.infer<typeof ExtendSchema>;

export const ElisionSchema = z.object({
  text: z.string().optional(),
});
export type Elision = z.infer<typeof ElisionSchema>;

export const LyricFormattingSchema = z.object({
  fontFamily: z.string().optional(),
  fontStyle: FontStyleEnum.optional(),
  fontSize: z.string().optional(),
  fontWeight: FontWeightEnum.optional(),
  justify: z.enum(["left", "center", "right"]).optional(),
  underline: z.number().optional(),
  overline: z.number().optional(),
  lineThrough: z.number().optional(),
  color: z.string().optional(),
});
export type LyricFormatting = z.infer<typeof LyricFormattingSchema>;

export const LyricSchema = z.object({
  text: z.string(),
  syllabic: z.string().optional(), // common values: single, begin, end, middle
  number: z.string().optional(),
  name: z.string().optional(),
  extend: ExtendSchema.optional(),
  elision: ElisionSchema.optional(),
  xmlLang: z.string().optional(),
  formatting: LyricFormattingSchema.optional(),
});

export type Lyric = z.infer<typeof LyricSchema>;
