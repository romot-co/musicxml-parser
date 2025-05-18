import { z } from 'zod';

export const ClefSchema = z.object({
  sign: z.string(),
  line: z.number().int().optional(),
  'clef-octave-change': z.number().int().optional(),
  number: z.number().int().optional(), // For multi-staff parts, refers to staff number
});

export type Clef = z.infer<typeof ClefSchema>; 