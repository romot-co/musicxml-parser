import { z } from "zod";
import { ScorePartSchema } from "./scorePart";
import { PartGroupSchema } from "./partGroup";

/**
 * Represents the <part-list> element in a MusicXML score.
 * It contains a list of <score-part> elements, each defining a part in the score.
 * It can also contain <part-group> elements for grouping parts.
 */
export const PartListSchema = z
  .object({
    /**
     * An array of <score-part> elements. Each defines a part in the score.
     * A score must have at least one part listed.
     */
    scoreParts: z.array(ScorePartSchema).min(1), // <score-part>
    /** Optional array of <part-group> elements for grouping parts. */
    partGroups: z.array(PartGroupSchema).optional(), // <part-group>
  })
  .passthrough(); // Allows other elements/attributes not explicitly defined

export type PartList = z.infer<typeof PartListSchema>;
