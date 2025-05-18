import { z } from "zod";
import { PartListSchema } from "./partList";
import { TimewiseMeasureSchema } from "./timewiseMeasure";
import { WorkSchema } from "./work";
import { IdentificationSchema } from "./identification";
import { DefaultsSchema } from "./defaults";
import { CreditSchema } from "./credit";

/**
 * Represents the <score-timewise> element, where measures contain parts.
 */
// FIXME: TS7056: The inferred type of this node exceeds the maximum length the compiler will serialize.
// This is a temporary workaround to suppress the TypeScript error.
// This complex type inference issue should be addressed by refactoring the underlying schemas
// (e.g., TimewiseMeasureSchema and its components) to reduce complexity.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore TS7056
export const ScoreTimewiseSchema = z
  .object({
    version: z.string().optional().default("1.0"),
    work: WorkSchema.optional(),
    movementTitle: z.string().optional(),
    identification: IdentificationSchema.optional(),
    defaults: DefaultsSchema.optional(),
    credit: z.array(CreditSchema).optional(),
    partList: PartListSchema,
    measures: z.array(TimewiseMeasureSchema).min(1),
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .passthrough() as any;

export type ScoreTimewise = z.infer<typeof ScoreTimewiseSchema>;
