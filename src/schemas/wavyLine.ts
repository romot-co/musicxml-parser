import { z } from "zod";
import { YesNoEnum } from "./common";

/**
 * Represents a wavy-line element, often used for trills and vibrato.
 * This is a simplified representation covering the most common attributes.
 */
export const WavyLineSchema = z.object({
  type: z.enum(["start", "stop", "continue"]),
  number: z.number().int().optional(),
  smufl: z.string().optional(),
  placement: z.enum(["above", "below"]).optional(),
  color: z.string().optional(),
  // Trill-sound attributes
  accelerate: YesNoEnum.optional(),
  beats: z.number().optional(),
  secondBeats: z.number().optional(),
  lastBeat: z.number().optional(),
});

export type WavyLine = z.infer<typeof WavyLineSchema>;
