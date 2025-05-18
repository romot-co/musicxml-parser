import { z } from "zod";

export const TimeModificationSchema = z.object({
  actualNotes: z.number().int(),
  normalNotes: z.number().int(),
  normalType: z.string().optional(),
  normalDots: z.array(z.object({})).optional(),
});

export type TimeModification = z.infer<typeof TimeModificationSchema>;
