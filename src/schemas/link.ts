import { z } from "zod";

export const LinkSchema = z.object({
  _type: z.literal("link"),
  href: z.string(),
  role: z.string().optional(),
  title: z.string().optional(),
  show: z.string().optional(),
  actuate: z.string().optional(),
  name: z.string().optional(),
  element: z.string().optional(),
  position: z.number().int().optional(),
});

export type Link = z.infer<typeof LinkSchema>;
