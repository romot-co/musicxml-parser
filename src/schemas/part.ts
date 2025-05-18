import { z } from "zod";
import { MeasureSchema } from "./measure";

/**
 * Represents a single part in a score (e.g., a single instrument or voice).
 * Each part contains a sequence of measures.
 */
export const PartSchema = z
  .object({
    /**
     * A unique identifier for this part. This ID should correspond to an ID
     * found in the <part-list> section of the score.
     */
    id: z.string(),
    /**
     * An array of measures that make up this part.
     * MusicXML requires at least one measure per part.
     */
    measures: z.array(MeasureSchema).min(1), // Must have at least one measure
    // Other potential elements or attributes for <part> could be added here
    // if necessary, though it's less common for <part> itself to have many other children
    // besides <measure>.
  })
  .passthrough(); // Allows other attributes not explicitly defined

export type Part = z.infer<typeof PartSchema>;
