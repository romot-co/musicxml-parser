import { z } from 'zod';

export const ForwardSchema = z.object({
  _type: z.literal('forward'),
  duration: z.number().int(),
  voice: z.string().optional(),
  staff: z.number().int().optional(),
});

export type Forward = z.infer<typeof ForwardSchema>;
