import { z } from "zod";
import { GroupSymbolValueEnum } from "./partSymbol";
import { YesNoEnum } from "./common";

/**
 * Represents a <part-group> element used within the <part-list>.
 * Part groups allow multiple parts to be visually and logically grouped
 * together. A part-group element can either start or stop a group.
 */
export const PartGroupSchema = z
  .object({
    /** Number identifying this group. Parts with the same number belong together. */
    number: z.string().optional(),
    /** Indicates whether this element starts or stops the group. */
    type: z.enum(["start", "stop"]),
    /** Optional name for the group, displayed above the bracket or brace. */
    groupName: z.string().optional(), // <group-name>
    /** Abbreviated name for the group. */
    groupAbbreviation: z.string().optional(), // <group-abbreviation>
    /** Symbol used to indicate the group visually. */
    groupSymbol: GroupSymbolValueEnum.optional(), // <group-symbol>
    /** Whether barlines are drawn for the group. */
    groupBarline: YesNoEnum.optional(), // <group-barline>
  })
  .passthrough();

export type PartGroup = z.infer<typeof PartGroupSchema>;
