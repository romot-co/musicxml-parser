import { z } from "zod";
import { TimewisePartSchema } from "./timewisePart";

/**
 * Represents a measure in timewise format. Each measure contains the
 * musical data for all parts occurring at the same time position.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TimewiseMeasureSchema: z.ZodType<any> = z
  .object({
    number: z.string(),
    implicit: z.boolean().optional(),
    nonControlling: z.boolean().optional(),
    width: z.number().optional(),
    parts: z.array(TimewisePartSchema).min(1),
  })
  .passthrough();

export type TimewiseMeasure = z.infer<typeof TimewiseMeasureSchema>;
