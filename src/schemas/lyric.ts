import { z } from 'zod';

export const LyricSchema = z.object({
  text: z.string(),
  syllabic: z.string().optional(), // common values: single, begin, end, middle
  // Add other lyric attributes/elements like number, name, justify, placement, etc. if needed
});

export type Lyric = z.infer<typeof LyricSchema>; 