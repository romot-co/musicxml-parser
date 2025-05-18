import { z } from "zod";
import { MeasureContentSchema } from "./measure";

/**
 * Represents a <part> element within a timewise measure. It contains the
 * musical data for a single part for that measure.
 */
export const TimewisePartSchema = z
  .object({
    /** ID reference back to the part-list */
    id: z.string(),
    /** Musical content for this part in the measure */
    content: z.array(MeasureContentSchema).optional().default([]),
  })
  .passthrough();

export type TimewisePart = z.infer<typeof TimewisePartSchema>;
