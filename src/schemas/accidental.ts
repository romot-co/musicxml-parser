import { z } from "zod";

// Based on MusicXML 4.0 accidental-value simple type
const AccidentalValueEnum = z.enum([
  "sharp",
  "natural",
  "flat",
  "double-sharp",
  "sharp-sharp",
  "flat-flat",
  "natural-sharp",
  "natural-flat",
  "quarter-flat",
  "quarter-sharp",
  "three-quarters-flat",
  "three-quarters-sharp",
  "sharp-down",
  "sharp-up",
  "natural-down",
  "natural-up",
  "flat-down",
  "flat-up",
  "double-sharp-down",
  "double-sharp-up",
  "flat-flat-down",
  "flat-flat-up",
  "arrow-down",
  "arrow-up",
  // Microtonal accidentals (selected)
  "slash-quarter-sharp",
  "slash-sharp",
  "slash-flat",
  "double-slash-flat",
  "sharp-1",
  "sharp-2",
  "sharp-3",
  "sharp-5",
  "flat-1",
  "flat-2",
  "flat-3",
  "flat-4",
  // Other specific values from the DTD might be added if necessary
  "sori",
  "koron",
  // SMuFL glyph names could also be allowed if we extend to full SMuFL support here
]);
export type AccidentalValue = z.infer<typeof AccidentalValueEnum>;

/**
 * The accidental element represents actual 표시되는 accidentals, including cautionary and editorial accidentals.
 */
export const AccidentalSchema = z.object({
  /**
   * The text content of the <accidental> element, specifying the type of accidental.
   */
  value: AccidentalValueEnum,
  /**
   * Indicates whether the accidental is cautionary (e.g., in parentheses).
   */
  cautionary: z.enum(["yes", "no"]).optional(),
  /**
   * Indicates whether the accidental is editorial (e.g., in square brackets).
   */
  editorial: z.enum(["yes", "no"]).optional(),
  // TODO: Add other attributes like parentheses, bracket, size from MusicXML 4.0 if needed
});

export type Accidental = z.infer<typeof AccidentalSchema>;
