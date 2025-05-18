import { z } from 'zod';
import { NoteSchema } from './note';
import { AttributesSchema } from './attributes';
import { DirectionSchema } from './direction';
import { BarlineSchema } from './barline';
import { HarmonySchema } from './harmony';
import { BackupSchema } from './backup';
import { ForwardSchema } from './forward';
// Import other implemented schemas that can be direct children of <measure>
// For example, if ForwardSchema, BackupSchema are implemented, import them here.

// Defines the content of a measure, which can be a mix of elements
// Add other valid measure content elements to this union as they are implemented.
export const MeasureContentSchema = z.union([
  NoteSchema,
  AttributesSchema,
  DirectionSchema,
  BarlineSchema,
  HarmonySchema,
  // FiguredBassSchema, // Add when implemented
  // PrintSchema,       // Add when implemented
  // SoundSchema,       // Add when implemented
  // GroupingSchema,    // Add when implemented
  // LinkSchema,        // Add when implemented
  // BookmarkSchema,    // Add when implemented
  BackupSchema,
  ForwardSchema,
]);

export const MeasureSchema = z.object({
  number: z.string(), // Measure number can be complex (e.g., "1a")
  implicit: z.boolean().optional(),
  nonControlling: z.boolean().optional(),
  width: z.number().optional(),
  content: z.array(MeasureContentSchema).optional().default([]),
  // The 'passthrough()' below was removed as explicit content modeling is preferred.
  // If truly unknown elements need to be captured, a specific 'any' or 'unknown'
  // type could be added to the union, or passthrough could be re-enabled with caution.
});

export type Measure = z.infer<typeof MeasureSchema>;
export type MeasureContent = z.infer<typeof MeasureContentSchema>;
