import { z } from 'zod';
import { YesNoEnum } from './common';

export const GraceSchema = z.object({
  stealTimePrevious: z.number().optional(), // CDATA, percentage
  stealTimeFollowing: z.number().optional(), // CDATA, percentage
  makeTime: z.number().optional(), // CDATA, real-time divisions
  slash: YesNoEnum.optional(),
});

export type Grace = z.infer<typeof GraceSchema>; 