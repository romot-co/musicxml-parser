import { z } from "zod";

/**
 * Represents a rest.
 * According to MusicXML, the <rest> element indicates a point in time where silence occurs.
 * It can optionally contain display information.
 */
export const RestSchema = z.object({
  /**
   * The measure attribute is used to indicate whether a rest that is part of a backup or forward element
   * refers to a full measure rest. It is not typically used for <note> rests.
   * For now, we'll keep it simple and can extend later if needed for <forward>/<backup>.
   */
  // measure: z.boolean().optional(), // Example: if it were a boolean attribute 'measure="yes"'
  /** Specifies the visual placement of the rest. Not parsed for now. */
  // 'display-step': z.string().optional(),
  // 'display-octave': z.number().int().optional(),
});

export type Rest = z.infer<typeof RestSchema>;
