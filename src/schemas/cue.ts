import { z } from 'zod';

export const CueSchema = z.object({}); // Empty element

export type Cue = z.infer<typeof CueSchema>; 