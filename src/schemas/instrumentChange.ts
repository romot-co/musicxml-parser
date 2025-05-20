import { z } from "zod";

export const InstrumentChangeSchema = z.object({
  _type: z.literal("instrument-change"),
  id: z.string(),
  instrumentSound: z.string().optional(),
  solo: z.boolean().optional(),
  ensemble: z.number().int().optional(),
  virtualLibrary: z.string().optional(),
  virtualName: z.string().optional(),
});

export type InstrumentChange = z.infer<typeof InstrumentChangeSchema>;
