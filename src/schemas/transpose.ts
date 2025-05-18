import { z } from "zod";

/**
 * The transpose type represents harmony elements that are a transposition of written chord symbols.
 * It is used to indicate that the music is to be performed at a different pitch than written.
 */
export const DiatonicSchema = z.number().int();
export const ChromaticSchema = z.number();
export const OctaveChangeSchema = z.number().int();
export const DoubleSchema = z.object({
  above: z.enum(["yes", "no"]).optional(),
});

export const TransposeSchema = z.object({
  /**
   * The diatonic element specifies the number of diatonic steps to transpose (e.g., from C to F is 3 steps C->D->E->F, so diatonic = 3, or -3 for F to C).
   * A positive value transposes up, a negative value transposes down.
   */
  diatonic: DiatonicSchema.optional(),
  /**
   * The chromatic element represents the number of chromatic steps (semitones) to transpose.
   * A positive value transposes up, a negative value transposes down.
   * This is a required element for transposition.
   */
  chromatic: ChromaticSchema,
  /**
   * The octave-change element indicates how many octaves to add to the written pitch.
   * For example, an octave-change of 1 with a C4 written pitch results in a C5 played pitch.
   */
  octaveChange: OctaveChangeSchema.optional(),
  /**
   * The double element, if present, indicates this is a double transposition (e.g., for instruments like Clarinet in A playing in F).
   * Its presence signifies the double transposition; its content is ignored.
   */
  double: DoubleSchema.optional(),
  number: z.number().int().optional(),
});

export type Transpose = z.infer<typeof TransposeSchema>;
export type Diatonic = z.infer<typeof DiatonicSchema>;
export type Chromatic = z.infer<typeof ChromaticSchema>;
export type OctaveChange = z.infer<typeof OctaveChangeSchema>;
export type Double = z.infer<typeof DoubleSchema>;
