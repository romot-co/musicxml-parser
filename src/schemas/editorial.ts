import { z } from "zod";
import { YesNoEnum } from "./common";

/**
 * The footnote element specifies editorial information that appears in footnotes.
 */
export const FootnoteSchema = z.object({
  value: z.string(),
});
export type Footnote = z.infer<typeof FootnoteSchema>;

/**
 * The level element specifies editorial information for different MusicXML elements.
 * This is a simplified subset of the MusicXML 4.0 level type.
 */
export const LevelSchema = z.object({
  value: z.string().optional(),
  reference: YesNoEnum.optional(),
  type: z.enum(["start", "stop", "single"]).optional(),
  parentheses: YesNoEnum.optional(),
  bracket: YesNoEnum.optional(),
  size: z.string().optional(),
});
export type Level = z.infer<typeof LevelSchema>;
