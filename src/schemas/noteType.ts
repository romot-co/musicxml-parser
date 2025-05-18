import { z } from "zod";

/**
 * The note-type-value enumeration as defined by MusicXML. This represents
 * the graphical note type from shortest to longest duration.
 */
export const NoteTypeValueEnum = z.enum([
  "1024th",
  "512th",
  "256th",
  "128th",
  "64th",
  "32nd",
  "16th",
  "eighth",
  "quarter",
  "half",
  "whole",
  "breve",
  "long",
  "maxima",
]);

export type NoteTypeValue = z.infer<typeof NoteTypeValueEnum>;
