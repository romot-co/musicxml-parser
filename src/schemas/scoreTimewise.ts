import { z } from "zod";
import { PartListSchema } from "./partList";
import { TimewiseMeasureSchema } from "./timewiseMeasure";
import { WorkSchema } from "./work";
import { IdentificationSchema } from "./identification";
import { DefaultsSchema } from "./defaults";
import { CreditSchema } from "./credit";

/** Helper schema for score-level metadata fields */
export const ScoreTimewiseMetadataSchema = z.object({
  version: z.string().optional().default("1.0"),
  work: WorkSchema.optional(),
  movementTitle: z.string().optional(),
  identification: IdentificationSchema.optional(),
  defaults: DefaultsSchema.optional(),
  credit: z.array(CreditSchema).optional(),
});

/** Helper schema for required measure data */
export const ScoreTimewiseMeasureGroupSchema = z.object({
  partList: PartListSchema,
  measures: z.array(TimewiseMeasureSchema).min(1),
});

/**
 * Represents the <score-timewise> element, where measures contain parts.
 * Composed from smaller schemas to avoid exceeding TypeScript's type
 * serialization limits.
 */
export const ScoreTimewiseSchema = ScoreTimewiseMetadataSchema.merge(
  ScoreTimewiseMeasureGroupSchema,
).passthrough();

export type ScoreTimewise = z.infer<typeof ScoreTimewiseSchema>;
