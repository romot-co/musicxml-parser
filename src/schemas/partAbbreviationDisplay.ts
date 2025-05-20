import { z } from "zod";
import { DisplayTextSchema, AccidentalTextSchema } from "./displayText";
import { YesNoEnum } from "./common";

/**
 * Schema for the <part-abbreviation-display> element. Structure is
 * identical to {@link PartNameDisplaySchema}.
 */
export const PartAbbreviationDisplaySchema = z.object({
  items: z.array(z.union([DisplayTextSchema, AccidentalTextSchema])).optional(),
  printObject: YesNoEnum.optional(),
});

export type PartAbbreviationDisplay = z.infer<
  typeof PartAbbreviationDisplaySchema
>;
