import { z } from 'zod';
import { PartListSchema } from './partList';
import { TimewiseMeasureSchema } from './timewiseMeasure';
import { WorkSchema } from './work';
import { IdentificationSchema } from './identification';
import { DefaultsSchema } from './defaults';
import { CreditSchema } from './credit';

/**
 * Represents the <score-timewise> element, where measures contain parts.
 */
export const ScoreTimewiseSchema = z
  .object({
    version: z.string().optional().default('1.0'),
    work: WorkSchema.optional(),
    movementTitle: z.string().optional(),
    identification: IdentificationSchema.optional(),
    defaults: DefaultsSchema.optional(),
    credit: z.array(CreditSchema).optional(),
    partList: PartListSchema,
    measures: z.array(TimewiseMeasureSchema).min(1),
  })
  .passthrough();

export type ScoreTimewise = z.infer<typeof ScoreTimewiseSchema>;
