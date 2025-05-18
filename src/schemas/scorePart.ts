import { z } from "zod";

/**
 * Represents a single entry in the <part-list>, defining a part in the score.
 * It includes identification, naming, and potentially instrument information for the part.
 */
export const ScorePartSchema = z
  .object({
    /**
     * A unique identifier for this part, which corresponds to the id attribute
     * of a <part> element in the main body of the score.
     */
    id: z.string(),
    /** The full name of the part (e.g., "Violin I", "Piano Left Hand"). Optional. */
    partName: z.string().optional(), // <part-name>
    /** An abbreviated name for the part. Optional. */
    partAbbreviation: z.string().optional(), // <part-abbreviation>
    // Other common elements within <score-part>:
    // scoreInstrument: z.array(ScoreInstrumentSchema).optional(), // <score-instrument> - Requires ScoreInstrumentSchema
    // midiDevice: MidiDeviceSchema.optional(), // <midi-device> - Requires MidiDeviceSchema
    // midiInstrument: MidiInstrumentSchema.optional(), // <midi-instrument> - Requires MidiInstrumentSchema
  })
  .passthrough(); // Allows other elements/attributes not explicitly defined

export type ScorePart = z.infer<typeof ScorePartSchema>;
