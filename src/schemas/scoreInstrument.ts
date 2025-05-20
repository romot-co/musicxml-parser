import { z } from "zod";
import { MidiInstrumentSchema } from "./midiInstrument";

/**
 * Represents a single instrument within a <score-part>.
 * Includes optional MIDI playback information.
 */
export const ScoreInstrumentSchema = z
  .object({
    /** Unique ID of the instrument */
    id: z.string(),
    /** Descriptive name of the instrument */
    instrumentName: z.string(),
    /** Optional abbreviation used in the score */
    instrumentAbbreviation: z.string().optional(),
    /** Default timbre or sound description */
    instrumentSound: z.string().optional(),
    /** Standard instrument sound identifier from sounds.xml */
    standardInstrumentId: z.string().optional(),
    /** True if performance is intended as solo */
    solo: z.boolean().optional(),
    /** Size of an ensemble if specified */
    ensemble: z.number().int().optional(),
    /** Virtual instrument information (simplified) */
    virtualLibrary: z.string().optional(),
    virtualName: z.string().optional(),
    /** Initial MIDI instrument assignment */
    midiInstrument: MidiInstrumentSchema.optional(),
  })
  .passthrough();

export type ScoreInstrument = z.infer<typeof ScoreInstrumentSchema>;
