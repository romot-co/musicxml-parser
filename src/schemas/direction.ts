import { z } from "zod";
import { TextFormattingSchema, CreditImageSchema } from "./credit"; // Assuming TextFormattingSchema includes font attributes
import { YesNoEnum } from "./common";
import { SoundSchema } from "./sound";

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

/** Representation of a <rehearsal> element. */
export const RehearsalSchema = z.object({
  text: z.string(),
  formatting: TextFormattingSchema.optional(),
});
export type Rehearsal = z.infer<typeof RehearsalSchema>;

export const MetronomeBeatUnitSchema = z.object({
  "beat-unit": z.string(), // e.g., "quarter", "eighth"
  "beat-unit-dot": z.array(z.object({})).optional(), // Array for multiple dots
});
export type MetronomeBeatUnit = z.infer<typeof MetronomeBeatUnitSchema>;

export const MetronomePerMinuteSchema = z.object({
  "per-minute": z.string(), // Number as string, e.g., "120"
  formatting: TextFormattingSchema.optional(),
});
export type MetronomePerMinute = z.infer<typeof MetronomePerMinuteSchema>;

export const MetronomeNoteSchema = z.object({
  "metronome-type": z.string().optional(),
  "metronome-dot": z.array(z.object({})).optional(),
});
export type MetronomeNote = z.infer<typeof MetronomeNoteSchema>;

export const MetronomeRelationSchema = z.object({
  "metronome-relation": z.string().optional(),
});
export type MetronomeRelation = z.infer<typeof MetronomeRelationSchema>;

export const MetronomeSchema = z.object({
  "beat-unit": MetronomeBeatUnitSchema.optional(),
  "per-minute": MetronomePerMinuteSchema.optional(),
  "metronome-note": z.array(MetronomeNoteSchema).optional(),
  "metronome-relation": z.string().optional(),
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
  type: z.enum(["start", "stop", "change", "continue"]).optional(),
});
export type Pedal = z.infer<typeof PedalSchema>;

/** Crescendo/diminuendo wedge. */
export const WedgeSchema = z.object({
  type: z.enum(["crescendo", "diminuendo", "stop", "continue"]).optional(),
  spread: z.number().optional(),
  number: z.number().int().optional(),
  niente: YesNoEnum.optional(),
  lineType: z.string().optional(),
  dashLength: z.number().optional(),
  spaceLength: z.number().optional(),
  defaultX: z.number().optional(),
  defaultY: z.number().optional(),
  relativeX: z.number().optional(),
  relativeY: z.number().optional(),
  color: z.string().optional(),
  id: z.string().optional(),
});
export type Wedge = z.infer<typeof WedgeSchema>;

export const SegnoSchema = z.object({});
export type Segno = z.infer<typeof SegnoSchema>;

export const CodaSchema = z.object({});
export type Coda = z.infer<typeof CodaSchema>;

export const OctaveShiftSchema = z.object({
  type: z.enum(["up", "down", "stop", "continue"]).optional(),
  number: z.number().int().optional(),
  size: z.number().int().optional(),
  dashLength: z.number().optional(),
  spaceLength: z.number().optional(),
  defaultX: z.number().optional(),
  defaultY: z.number().optional(),
  relativeX: z.number().optional(),
  relativeY: z.number().optional(),
  color: z.string().optional(),
  id: z.string().optional(),
});
export type OctaveShift = z.infer<typeof OctaveShiftSchema>;

export const DashesSchema = z.object({
  type: z.enum(["start", "stop", "continue"]).optional(),
  number: z.number().int().optional(),
  dashLength: z.number().optional(),
  spaceLength: z.number().optional(),
  defaultX: z.number().optional(),
  defaultY: z.number().optional(),
  relativeX: z.number().optional(),
  relativeY: z.number().optional(),
  color: z.string().optional(),
  id: z.string().optional(),
});
export type Dashes = z.infer<typeof DashesSchema>;

export const BracketSchema = z.object({
  type: z.enum(["start", "stop", "continue"]).optional(),
  number: z.number().int().optional(),
  lineEnd: z.enum(["up", "down", "both", "arrow", "none"]).optional(),
  endLength: z.number().optional(),
  lineType: z.string().optional(),
  dashLength: z.number().optional(),
  spaceLength: z.number().optional(),
  defaultX: z.number().optional(),
  defaultY: z.number().optional(),
  relativeX: z.number().optional(),
  relativeY: z.number().optional(),
  color: z.string().optional(),
  id: z.string().optional(),
});
export type Bracket = z.infer<typeof BracketSchema>;

export const ImageSchema = CreditImageSchema;
export type Image = z.infer<typeof ImageSchema>;

export const EyeglassesSchema = z.object({});
export type Eyeglasses = z.infer<typeof EyeglassesSchema>;

export const DampSchema = z.object({});
export type Damp = z.infer<typeof DampSchema>;

export const DampAllSchema = z.object({});
export type DampAll = z.infer<typeof DampAllSchema>;

export const StringMuteSchema = z.object({
  type: z.enum(["on", "off"]).optional(),
});
export type StringMute = z.infer<typeof StringMuteSchema>;

export const PedalTuningSchema = z.object({
  "pedal-step": z.string(),
  "pedal-alter": z.number().optional(),
});
export type PedalTuning = z.infer<typeof PedalTuningSchema>;

export const HarpPedalsSchema = z.object({
  "pedal-tuning": z.array(PedalTuningSchema),
});
export type HarpPedals = z.infer<typeof HarpPedalsSchema>;

export const AccordSchema = z.object({
  string: z.string().optional(),
  "tuning-step": z.string(),
  "tuning-alter": z.number().optional(),
  "tuning-octave": z.number(),
});
export type Accord = z.infer<typeof AccordSchema>;

export const ScordaturaSchema = z.object({
  accord: z.array(AccordSchema),
});
export type Scordatura = z.infer<typeof ScordaturaSchema>;

export const PrincipalVoiceSchema = z.object({
  type: z.enum(["start", "stop"]).optional(),
  symbol: z.enum(["Hauptstimme", "Nebenstimme", "plain", "none"]).optional(),
  text: z.string().optional(),
});
export type PrincipalVoice = z.infer<typeof PrincipalVoiceSchema>;

export const AccordionRegistrationSchema = z.object({
  "accordion-high": z.boolean().optional(),
  "accordion-middle": z.string().optional(),
  "accordion-low": z.boolean().optional(),
});
export type AccordionRegistration = z.infer<typeof AccordionRegistrationSchema>;

export const StaffDivideSchema = z.object({
  type: z.enum(["down", "up", "up-down"]).optional(),
});
export type StaffDivide = z.infer<typeof StaffDivideSchema>;

export const OtherDirectionSchema = z.object({
  text: z.string(),
});
export type OtherDirection = z.infer<typeof OtherDirectionSchema>;

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
  rehearsal: RehearsalSchema.optional(),
  octaveShift: OctaveShiftSchema.optional(),
  dashes: DashesSchema.optional(),
  bracket: BracketSchema.optional(),
  image: ImageSchema.optional(),
  eyeglasses: EyeglassesSchema.optional(),
  damp: DampSchema.optional(),
  dampAll: DampAllSchema.optional(),
  stringMute: StringMuteSchema.optional(),
  harpPedals: HarpPedalsSchema.optional(),
  scordatura: ScordaturaSchema.optional(),
  principalVoice: PrincipalVoiceSchema.optional(),
  accordionRegistration: AccordionRegistrationSchema.optional(),
  staffDivide: StaffDivideSchema.optional(),
  otherDirection: OtherDirectionSchema.optional(),
});
export type DirectionType = z.infer<typeof DirectionTypeSchema>;

/**
 * Represents the <direction> element, used for musical indications.
 */
export const DirectionSchema = z.object({
  _type: z.literal("direction"),
  /**
   * The direction-type element contains the musical information for the direction.
   * Multiple direction-type elements may be combined to represent complex musical instructions.
   */
  direction_type: z.array(DirectionTypeSchema).min(1),
  /**
   * The placement attribute indicates whether the direction applies to the current staff or the system as a whole.
   * Typical values are "above", "below", or "between".
   */
  placement: z.enum(["above", "below", "between"]).optional(),
  /**
   * The staff attribute, if present, indicates the staff to which the direction applies.
   * If absent, the direction applies to all staves in the part (e.g., for a Grand Staff).
   */
  staff: z.number().int().optional(),
  directive: YesNoEnum.optional(),
  /** Offset in divisions from the start of the current measure or note */
  offset: z.number().optional(),
  /** Playback information attached to the direction */
  sound: SoundSchema.optional(),
});
export type Direction = z.infer<typeof DirectionSchema>;
