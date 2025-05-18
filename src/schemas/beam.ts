import { z } from "zod";

/**
 * Beam values indicate the type of beam.
 */
export const BeamValueEnum = z.enum([
  "begin",
  "continue",
  "end",
  "forward hook",
  "backward hook",
]);
export type BeamValue = z.infer<typeof BeamValueEnum>;

/**
 * The beam element is used to represent notation beams.
 * Multiple beam elements can be used for different connections to the same note.
 */
export const BeamSchema = z.object({
  /**
   * The text content of the beam element, indicating the beam type.
   */
  value: BeamValueEnum,
  /**
   * The number attribute indicates beam level, ranging from 1 to 8 (typically 1-6).
   * Level 1 is for 8th notes, 2 for 16ths, etc.
   */
  number: z.number().int().min(1).max(8).optional().default(1),
  /**
   * MusicXML 4.0: The repeater attribute is used for tremolos that are shown with beams.
   */
  repeater: z.enum(["yes", "no"]).optional(),
  /**
   * MusicXML 4.0: The fan attribute is used for fanned beams.
   */
  fan: z.enum(["accel", "rit", "none"]).optional(),
  /**
   * Optional color attribute for coloring beams.
   */
  color: z.string().optional(),
});
export type Beam = z.infer<typeof BeamSchema>;
