import { z } from "zod";
import { DisplayTextSchema, AccidentalTextSchema } from "./displayText";
import { YesNoEnum } from "./common";

/**
 * Schema for the <part-name-display> element. It allows a sequence of
 * <display-text> and <accidental-text> elements and a print-object
 * attribute controlling visibility.
 */
export const PartNameDisplaySchema = z.object({
  items: z.array(z.union([DisplayTextSchema, AccidentalTextSchema])).optional(),
  printObject: YesNoEnum.optional(),
});

export type PartNameDisplay = z.infer<typeof PartNameDisplaySchema>;
