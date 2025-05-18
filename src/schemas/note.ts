import { z } from 'zod';
import { PitchSchema } from './pitch';
import { RestSchema } from './rest';
import { LyricSchema } from './lyric';

/**
 * Represents a single musical note or rest.
 * Common fields include duration, voice, and type.
 * A note must contain either pitch information or be a rest.
 */
export const NoteSchema = z.object({
  /** Pitch information. Required if this is not a rest. */
  pitch: PitchSchema.optional(),
  /** Rest information. Required if this is not a pitched note. */
  rest: RestSchema.optional(),
  /** 
   * Duration is a positive number that represents the note's length 
   * in terms of divisions per quarter note.
   */
  duration: z.number().int().positive(),
  /** 
   * Voice is used to distinguish between multiple independent melodic lines 
   * within a single part.
   */
  voice: z.string().optional(),
  /** 
   * Type represents the graphical note type (e.g., "quarter", "eighth").
   */
  type: z.string().optional(),
  lyric: LyricSchema.optional(),
  // Additional <note> sub-elements can be added here:
  // stem: z.enum(["up", "down", "none", "double"]).optional(),
  // notations: z.array(NotationSchema).optional(), // Requires NotationSchema
  // etc.
}).refine(data => data.pitch || data.rest, {
  message: "Note must have either a pitch or a rest component.",
}).refine(data => !(data.pitch && data.rest), {
  message: "Note cannot have both a pitch and a rest component.",
});

export type Note = z.infer<typeof NoteSchema>; 