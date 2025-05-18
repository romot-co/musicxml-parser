import { z } from "zod";

export const MidiDeviceSchema = z.object({
  value: z.string(),
  port: z.number().int().min(1).max(16).optional(),
  id: z.string().optional(),
});

export type MidiDevice = z.infer<typeof MidiDeviceSchema>;
