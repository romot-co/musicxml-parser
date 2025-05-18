import { z } from 'zod';
import { KeySchema } from './key';
import { TimeSchema } from './time';
import { ClefSchema } from './clef';

export const AttributesSchema = z.object({
  divisions: z.number().int().positive().optional(),
  key: z.array(KeySchema).optional(), // <key> can appear multiple times for different staves, though often once
  time: z.array(TimeSchema).optional(), // <time> can appear multiple times
  clef: z.array(ClefSchema).optional(), // <clef> can appear multiple times
  // Placeholder for other attributes like <staves>, <part-symbol>, <transpose>, etc.
});

export type Attributes = z.infer<typeof AttributesSchema>;
