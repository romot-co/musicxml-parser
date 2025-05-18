import { z } from 'zod';

/**
 * The slur element is used to represent slurs. Slurs can be nested.
 */
export const SlurSchema = z.object({
  type: z.enum(['start', 'stop', 'continue']),
  number: z.number().int().optional(), // For nested slurs, default is 1
  placement: z.enum(['above', 'below']).optional(),
  // TODO: Add other attributes like orientation, color, line-type, bezier-x/y, etc.
});
export type Slur = z.infer<typeof SlurSchema>;

/**
 * Represents a staccato articulation mark.
 */
export const StaccatoSchema = z.object({}); // Empty element
export type Staccato = z.infer<typeof StaccatoSchema>;

/**
 * Represents an accent articulation mark.
 */
export const AccentSchema = z.object({}); // Empty element
export type Accent = z.infer<typeof AccentSchema>;

// TODO: Add schemas for other common articulations like tenuto, strong-accent, staccatissimo, spiccato, etc.

/**
 * The articulations element groups multiple articulation marks.
 */
export const ArticulationsSchema = z.object({
  accent: AccentSchema.optional(),
  staccato: StaccatoSchema.optional(),
  // Add other articulation elements here as optional fields
  // tenuto: TenutoSchema.optional(),
  // strongAccent: StrongAccentSchema.optional(), 
  placement: z.enum(['above', 'below']).optional(), // placement for the group
});
export type Articulations = z.infer<typeof ArticulationsSchema>;

/**
 * The notations element groups musical notations that are not related to pitch or duration.
 * This includes slurs, ties (already handled in NoteSchema), articulations, ornaments, etc.
 */
export const NotationsSchema = z.object({
  slurs: z.array(SlurSchema).optional(),
  articulations: z.array(ArticulationsSchema).optional(), // MusicXML allows multiple <articulations> elements
  // TODO: Add other notation types like <tied>, <tuplet>, <ornaments>, <technical>, <dynamics> (if not in <direction>)
});
export type Notations = z.infer<typeof NotationsSchema>; 