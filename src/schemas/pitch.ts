import { z } from "zod";

/**
 * Represents the musical pitch.
 *
 * The step type represents the diatonic pitch name (A-G).
 * The alter type represents the chromatic alteration (e.g., -1 for flat, 1 for sharp).
 * The octave type represents the octave (0-9), where 4 is the octave of middle C.
 */
export const PitchSchema = z.object({
  /** Diatonic pitch name (A-G) */
  step: z.enum(["A", "B", "C", "D", "E", "F", "G"]),
  /** Chromatic alteration (e.g., -1 for flat, 1 for sharp). Optional. */
  alter: z.number().optional(),
  /** Octave (0-9), where 4 is the octave of middle C. */
  octave: z.number().int(),
});

export type Pitch = z.infer<typeof PitchSchema>;
