import { z } from 'zod';

/**
 * Represents a tie element, indicating a note is tied to the previous or next note.
 */
export const TieSchema = z.object({
  /**
   * Indicates the type of the tie (e.g., "start", "stop").
   */
  type: z.enum(['start', 'stop']),
});

export type Tie = z.infer<typeof TieSchema>; 