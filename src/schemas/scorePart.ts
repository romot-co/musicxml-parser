import { z } from "zod";
import { ScoreInstrumentSchema } from "./scoreInstrument";
import { MidiDeviceSchema } from "./midiDevice";
import { MidiInstrumentSchema } from "./midiInstrument";
import { PartNameDisplaySchema } from "./partNameDisplay";
import { PartAbbreviationDisplaySchema } from "./partAbbreviationDisplay";

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
    /** Structured display information for the part name. */
    partNameDisplay: PartNameDisplaySchema.optional(),
    /** An abbreviated name for the part. Optional. */
    partAbbreviation: z.string().optional(), // <part-abbreviation>
    /** Structured display information for the part abbreviation. */
    partAbbreviationDisplay: PartAbbreviationDisplaySchema.optional(),
    /** Initial MIDI instrument assignments */
    scoreInstruments: z.array(ScoreInstrumentSchema).optional(),
    midiDevices: z.array(MidiDeviceSchema).optional(),
    midiInstruments: z.array(MidiInstrumentSchema).optional(),
  })
  .passthrough(); // Allows other elements/attributes not explicitly defined

export type ScorePart = z.infer<typeof ScorePartSchema>;
