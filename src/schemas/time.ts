import { z } from 'zod';

export const TimeSchema = z.object({
  beats: z.string(), // Or z.number().int().transform(String) if you prefer number then cast
  'beat-type': z.string(), // Or z.number().int().transform(String)
  symbol: z.string().optional(),
});

export type Time = z.infer<typeof TimeSchema>; 