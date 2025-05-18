import { z } from "zod";
import { YesNoEnum } from "./common";

export const FigureSchema = z.object({
  prefix: z.string().optional(),
  figureNumber: z.string().optional(),
  suffix: z.string().optional(),
});

export const FiguredBassSchema = z.object({
  _type: z.literal("figured-bass"),
  figures: z.array(FigureSchema),
  duration: z.number().int().optional(),
  parentheses: YesNoEnum.optional(),
});

export type Figure = z.infer<typeof FigureSchema>;
export type FiguredBass = z.infer<typeof FiguredBassSchema>;
