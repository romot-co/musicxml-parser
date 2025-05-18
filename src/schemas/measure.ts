import { z } from 'zod';
import { NoteSchema } from './note';
import { AttributesSchema } from './attributes'; // Import AttributesSchema

// Placeholder for a more detailed AttributesSchema
// This will eventually be defined in its own file (e.g., src/schemas/attributes.ts)
// and include schemas for <key>, <time>, <clef>, <divisions>, etc.
const AttributesSchemaPlaceholder = z.object({
  // Example placeholder fields, these would be more specific:
  // divisions: z.number().positive().optional(),
  // key: KeySchema.optional(), // Requires KeySchema
  // time: TimeSchema.optional(), // Requires TimeSchema
  // clef: ClefSchema.optional(), // Requires ClefSchema
}).passthrough(); // Allows other attributes not explicitly defined for now

/**
 * Represents a single measure in a piece of music.
 */
export const MeasureSchema = z.object({
  /** The measure number (e.g., "1", "2", "1a"). Usually a string. */
  number: z.string(), 
  /** 
   * Attributes describe musical information such as key signature, time signature, clef, etc. 
   * These often appear at the beginning of a part or when changes occur.
   */
  attributes: z.array(AttributesSchema).optional(), // Attributes can appear in a measure
  /** 
   * An array of notes, rests, and potentially other musical elements within the measure. 
   * Can be empty for pickup measures or measures with only barlines/directions.
   */
  notes: z.array(NoteSchema).optional().default([]), // notes can be optional, default to empty array
  // Other potential elements within a measure:
  // barline: BarlineSchema.optional(),
  // direction: z.array(DirectionSchema).optional(),
  // harmony: z.array(HarmonySchema).optional(),
  // print: PrintSchema.optional(), // For page breaks, system breaks etc.
  // sound: SoundSchema.optional(), // For tempo, dynamics etc. (sometimes within direction)
}).passthrough(); // Allows other elements not explicitly defined for now, useful for forward compatibility

export type Measure = z.infer<typeof MeasureSchema>; 