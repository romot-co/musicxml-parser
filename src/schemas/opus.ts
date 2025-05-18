import { z } from "zod";

/**
 * Represents the <opus> element which links to an external MusicXML opus document.
 * It uses the MusicXML link-attributes group (xlink attributes).
 */
export const OpusSchema = z.object({
  href: z.string(),
  type: z.string().optional(),
  role: z.string().optional(),
  title: z.string().optional(),
  show: z.string().optional(),
  actuate: z.string().optional(),
});

export type Opus = z.infer<typeof OpusSchema>;
