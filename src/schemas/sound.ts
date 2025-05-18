import { z } from "zod";
import { YesNoEnum, YesNoNumberSchema, RotationDegreesSchema } from "./common";

export const SoundSchema = z.object({
  _type: z.literal("sound"),
  tempo: z.number().optional(),
  dynamics: z.number().optional(),
  dacapo: YesNoEnum.optional(),
  segno: z.string().optional(),
  dalsegno: z.string().optional(),
  coda: z.string().optional(),
  tocoda: z.string().optional(),
  divisions: z.number().optional(),
  forwardRepeat: YesNoEnum.optional(),
  fine: z.string().optional(),
  timeOnly: z.string().optional(),
  pizzicato: YesNoEnum.optional(),
  pan: RotationDegreesSchema.optional(),
  elevation: RotationDegreesSchema.optional(),
  damperPedal: YesNoNumberSchema.optional(),
  softPedal: YesNoNumberSchema.optional(),
  sostenutoPedal: YesNoNumberSchema.optional(),
  id: z.string().optional(),
});

export type Sound = z.infer<typeof SoundSchema>;
