import { z } from 'zod';

export const TimeSchema = z.object({
  beats: z.string().optional(), // Or z.number().int().transform(String) if you prefer number then cast
  'beat-type': z.string().optional(), // Or z.number().int().transform(String)
  symbol: z.string().optional(),
  senzaMisura: z.literal(true).optional(), // Added for <senza-misura/>
});

export type Time = z.infer<typeof TimeSchema>;
