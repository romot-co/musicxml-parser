import { z } from 'zod';

export const DisplayStepSchema = z.string(); // PCDATA
export const DisplayOctaveSchema = z.number().int(); // PCDATA

export const UnpitchedSchema = z.object({
  displayStep: DisplayStepSchema.optional(),
  displayOctave: DisplayOctaveSchema.optional(),
});

export type Unpitched = z.infer<typeof UnpitchedSchema>;
export type DisplayStep = z.infer<typeof DisplayStepSchema>;
export type DisplayOctave = z.infer<typeof DisplayOctaveSchema>; 