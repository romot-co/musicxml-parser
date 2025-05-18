import { z } from 'zod';

export const KeySchema = z.object({
  fifths: z.number().int(),
  mode: z.string().optional(),
});

export type Key = z.infer<typeof KeySchema>;
