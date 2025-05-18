import { z } from "zod";

/**
 * Simplified representation of the <bookmark> element.
 */
export const BookmarkSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  element: z.string().optional(),
  position: z.number().int().optional(),
});

export type Bookmark = z.infer<typeof BookmarkSchema>;
