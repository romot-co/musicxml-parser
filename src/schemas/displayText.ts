import { z } from "zod";
import { TextFormattingSchema } from "./credit";

/**
 * Represents the <display-text> element used within part-name-display
 * and similar constructs. Only a subset of formatting attributes is
 * currently supported.
 */
export const DisplayTextSchema = z.object({
  text: z.string().optional(),
  formatting: TextFormattingSchema.optional(),
});
export type DisplayText = z.infer<typeof DisplayTextSchema>;

/**
 * Represents the <accidental-text> element used within part-name-display
 * for rendering accidentals in part names.
 */
export const AccidentalTextSchema = z.object({
  text: z.string().optional(),
  formatting: TextFormattingSchema.optional(),
  smufl: z.string().optional(),
});
export type AccidentalText = z.infer<typeof AccidentalTextSchema>;
