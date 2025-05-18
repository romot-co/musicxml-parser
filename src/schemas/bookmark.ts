import { z } from "zod";

export const BookmarkSchema = z.object({
  _type: z.literal("bookmark"),
  id: z.string(),
  name: z.string().optional(),
  element: z.string().optional(),
  position: z.number().int().optional(),
});

export type Bookmark = z.infer<typeof BookmarkSchema>;
