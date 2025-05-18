import { z } from 'zod';
import { PageLayoutSchema, SystemLayoutSchema, StaffLayoutSchema } from './defaults';
import { YesNoEnum } from './common';

export const PrintSchema = z.object({
  _type: z.literal('print'),
  pageLayout: PageLayoutSchema.optional(),
  systemLayout: SystemLayoutSchema.optional(),
  staffLayout: z.array(StaffLayoutSchema).optional(),
  newSystem: YesNoEnum.optional(),
  newPage: YesNoEnum.optional(),
  pageNumber: z.string().optional(),
});

export type Print = z.infer<typeof PrintSchema>;
