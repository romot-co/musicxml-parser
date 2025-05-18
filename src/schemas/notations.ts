import { z } from 'zod';
import { TieSchema } from './tie';

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

/**
 * Represents a tenuto articulation mark.
 */
export const TenutoSchema = z.object({});
export type Tenuto = z.infer<typeof TenutoSchema>;

/**
 * Represents a spiccato articulation mark.
 */
export const SpiccatoSchema = z.object({});
export type Spiccato = z.infer<typeof SpiccatoSchema>;

/**
 * Represents a staccatissimo articulation mark.
 */
export const StaccatissimoSchema = z.object({});
export type Staccatissimo = z.infer<typeof StaccatissimoSchema>;

/**
 * Represents a strong-accent articulation mark.
 */
export const StrongAccentSchema = z.object({});
export type StrongAccent = z.infer<typeof StrongAccentSchema>;

/**
 * The tuplet element represents tuplet notation.
 */
export const TupletSchema = z.object({
  type: z.enum(['start', 'stop']),
  number: z.number().int().optional(),
});
export type Tuplet = z.infer<typeof TupletSchema>;

/**
 * Placeholder schema for ornaments.
 */
export const OrnamentsSchema = z.object({});
export type Ornaments = z.infer<typeof OrnamentsSchema>;

/**
 * Placeholder schema for technical notations.
 */
export const TechnicalSchema = z.object({});
export type Technical = z.infer<typeof TechnicalSchema>;

/**
 * The articulations element groups multiple articulation marks.
 */
export const ArticulationsSchema = z.object({
  accent: AccentSchema.optional(),
  staccato: StaccatoSchema.optional(),
  tenuto: TenutoSchema.optional(),
  spiccato: SpiccatoSchema.optional(),
  staccatissimo: StaccatissimoSchema.optional(),
  strongAccent: StrongAccentSchema.optional(),
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
  tied: z.array(TieSchema).optional(),
  tuplets: z.array(TupletSchema).optional(),
  ornaments: z.array(OrnamentsSchema).optional(),
  technical: z.array(TechnicalSchema).optional(),
});
export type Notations = z.infer<typeof NotationsSchema>; 