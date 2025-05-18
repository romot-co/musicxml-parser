import { z } from 'zod';
import { TextFormattingSchema } from './credit'; // Assuming TextFormattingSchema includes font attributes

// Placeholder for MetronomeBeatUnitDotSchema if needed later
// export const MetronomeBeatUnitDotSchema = z.object({});

/**
 * Represents the <words> element, typically used for text indications like dynamics, tempo markings, etc.
 */
export const WordsSchema = z.object({
  text: z.string(),
  formatting: TextFormattingSchema.optional(), // Includes font and color attributes
});
export type Words = z.infer<typeof WordsSchema>;

export const MetronomeBeatUnitSchema = z.object({
  'beat-unit': z.string(), // e.g., "quarter", "eighth"
  'beat-unit-dot': z.array(z.object({})).optional(), // Array for multiple dots
});
export type MetronomeBeatUnit = z.infer<typeof MetronomeBeatUnitSchema>;

export const MetronomePerMinuteSchema = z.object({
  'per-minute': z.string(), // Number as string, e.g., "120"
  formatting: TextFormattingSchema.optional(),
});
export type MetronomePerMinute = z.infer<typeof MetronomePerMinuteSchema>;

export const MetronomeSchema = z.object({
  'beat-unit': MetronomeBeatUnitSchema.optional(),
  'per-minute': MetronomePerMinuteSchema.optional(),
  // TODO: Add other metronome children like <metronome-note>, <metronome-relation>
  // parentheses: z.boolean().optional(), // Example attribute
});
export type Metronome = z.infer<typeof MetronomeSchema>;

/** Simple representation of a <dynamics> element. */
export const DynamicsSchema = z.object({
  value: z.string(),
  formatting: TextFormattingSchema.optional(),
});
export type Dynamics = z.infer<typeof DynamicsSchema>;

/** Basic pedal marking. */
export const PedalSchema = z.object({
  type: z.enum(['start', 'stop', 'change', 'continue']).optional(),
});
export type Pedal = z.infer<typeof PedalSchema>;

/** Crescendo/diminuendo wedge. */
export const WedgeSchema = z.object({
  type: z.enum(['crescendo', 'diminuendo', 'stop', 'continue']).optional(),
  spread: z.number().optional(),
});
export type Wedge = z.infer<typeof WedgeSchema>;

export const SegnoSchema = z.object({});
export type Segno = z.infer<typeof SegnoSchema>;

export const CodaSchema = z.object({});
export type Coda = z.infer<typeof CodaSchema>;

/**
 * Represents the <direction-type> element, which contains the actual content of a direction.
 */
export const DirectionTypeSchema = z.object({
  words: WordsSchema.optional(),
  metronome: MetronomeSchema.optional(),
  dynamics: DynamicsSchema.optional(),
  pedal: PedalSchema.optional(),
  wedge: WedgeSchema.optional(),
  segno: SegnoSchema.optional(),
  coda: CodaSchema.optional(),
});
export type DirectionType = z.infer<typeof DirectionTypeSchema>;

/**
 * Represents the <direction> element, used for musical indications.
 */
export const DirectionSchema = z.object({
  _type: z.literal('direction'),
  /**
   * The direction-type element contains the musical information for the direction.
   * Multiple direction-type elements may be combined to represent complex musical instructions.
   */
  direction_type: z.array(DirectionTypeSchema).min(1),
  /**
   * The placement attribute indicates whether the direction applies to the current staff or the system as a whole.
   * Typical values are "above", "below", or "between".
   */
  placement: z.enum(['above', 'below', 'between']).optional(),
  /**
   * The staff attribute, if present, indicates the staff to which the direction applies.
   * If absent, the direction applies to all staves in the part (e.g., for a Grand Staff).
   */
  staff: z.number().int().optional(),
  // TODO: Add other <direction> attributes like `directive`
});
export type Direction = z.infer<typeof DirectionSchema>; 