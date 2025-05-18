import { z } from "zod";
import { RotationDegreesSchema } from "./common";

/**
 * MIDI playback configuration for an instrument.
 */
export const MidiInstrumentSchema = z
  .object({
    id: z.string(),
    midiChannel: z.number().int().min(1).max(16).optional(),
    midiName: z.string().optional(),
    midiBank: z.number().int().min(1).max(16384).optional(),
    midiProgram: z.number().int().min(1).max(128).optional(),
    midiUnpitched: z.number().int().min(1).max(128).optional(),
    volume: z.number().optional(),
    pan: RotationDegreesSchema.optional(),
    elevation: RotationDegreesSchema.optional(),
  })
  .passthrough();

export type MidiInstrument = z.infer<typeof MidiInstrumentSchema>;
