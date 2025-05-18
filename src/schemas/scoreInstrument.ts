import { z } from "zod";
import { MidiInstrumentSchema } from "./midiInstrument";

export const ScoreInstrumentSchema = z
  .object({
    id: z.string(),
    instrumentName: z.string(),
    instrumentAbbreviation: z.string().optional(),
    instrumentSound: z.string().optional(),
    solo: z.boolean().optional(),
    ensemble: z.number().int().optional(),
    midiInstrument: MidiInstrumentSchema.optional(),
  })
  .passthrough();

export type ScoreInstrument = z.infer<typeof ScoreInstrumentSchema>;
