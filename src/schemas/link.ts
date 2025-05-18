import { z } from "zod";

/**
 * Simplified representation of the <link> element.
 * Only a subset of the XLink attributes are captured.
 */
export const LinkSchema = z.object({
  href: z.string(), // xlink:href
  type: z.string().optional(), // xlink:type, usually "simple"
  role: z.string().optional(), // xlink:role
  title: z.string().optional(), // xlink:title
  show: z.string().optional(), // xlink:show
  actuate: z.string().optional(), // xlink:actuate
  name: z.string().optional(),
  element: z.string().optional(),
  position: z.number().int().optional(),
});

export type Link = z.infer<typeof LinkSchema>;
