import { z } from 'zod';

/**
 * The work complex type represents a musical work, including titles and numbers.
 */
export const WorkSchema = z.object({
  /**
   * The work-number element is used for the number of a work, such as an opus number.
   */
  'work-number': z.string().optional(),
  /**
   * The work-title element is used for the title of a work.
   */
  'work-title': z.string().optional(),
  // TODO: Add other work elements like <opus/> (though <opus/> is often part of <work-number> or handled separately)
});

export type Work = z.infer<typeof WorkSchema>; 