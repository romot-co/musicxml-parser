import { z } from "zod";
import { TextFormattingSchema } from "./credit";
import { AccidentalSchema } from "./accidental";

export const DisplayTextSchema = z.object({
  text: z.string(),
  formatting: TextFormattingSchema.optional(),
});
export type DisplayText = z.infer<typeof DisplayTextSchema>;

export const AccidentalTextSchema = z.object({
  value: AccidentalSchema.shape.value,
  formatting: TextFormattingSchema.optional(),
  smufl: z.string().optional(),
});
export type AccidentalText = z.infer<typeof AccidentalTextSchema>;

export const NoteheadTextSchema = z.object({
  displayTexts: z.array(DisplayTextSchema).optional(),
  accidentalTexts: z.array(AccidentalTextSchema).optional(),
});
export type NoteheadText = z.infer<typeof NoteheadTextSchema>;
