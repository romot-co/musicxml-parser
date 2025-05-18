import { z } from 'zod';

export const ExtendSchema = z.object({
  type: z.enum(['start', 'stop', 'continue']).optional(),
});
export type Extend = z.infer<typeof ExtendSchema>;

export const ElisionSchema = z.object({
  text: z.string().optional(),
});
export type Elision = z.infer<typeof ElisionSchema>;

export const LyricSchema = z.object({
  text: z.string(),
  syllabic: z.string().optional(), // common values: single, begin, end, middle
  number: z.string().optional(),
  name: z.string().optional(),
  extend: ExtendSchema.optional(),
  elision: ElisionSchema.optional(),
});

export type Lyric = z.infer<typeof LyricSchema>;
