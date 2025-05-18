import { z } from "zod";

export const SoundSchema = z.object({
  _type: z.literal("sound"),
  tempo: z.number().optional(),
  dynamics: z.number().optional(),
});

export type Sound = z.infer<typeof SoundSchema>;
