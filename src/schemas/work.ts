import { z } from "zod";
import { OpusSchema } from "./opus";

/**
 * The work complex type represents a musical work, including titles and numbers.
 */
export const WorkSchema = z.object({
  /**
   * The work-number element is used for the number of a work, such as an opus number.
   */
  "work-number": z.string().optional(),
  /**
   * The work-title element is used for the title of a work.
   */
  "work-title": z.string().optional(),
  /**
   * Optional link to an external MusicXML opus document.
   */
  opus: OpusSchema.optional(),
});

export type Work = z.infer<typeof WorkSchema>;
