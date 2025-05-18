import { z } from "zod";
import { TieSchema } from "./tie";
import { YesNoEnum } from "./common";
import { WavyLineSchema } from "./wavyLine";
import { AccidentalSchema } from "./accidental";

/**
 * The slur element is used to represent slurs. Slurs can be nested.
 */
export const SlurSchema = z.object({
  type: z.enum(["start", "stop", "continue"]),
  number: z.number().int().optional(), // For nested slurs, default is 1
  placement: z.enum(["above", "below"]).optional(),
  orientation: z.enum(["over", "under"]).optional(),
  color: z.string().optional(),
  lineType: z.string().optional(),
  bezierX: z.number().optional(),
  bezierY: z.number().optional(),
  bezierX2: z.number().optional(),
  bezierY2: z.number().optional(),
  bezierOffset: z.number().optional(),
  bezierOffset2: z.number().optional(),
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
  type: z.enum(["start", "stop"]),
  number: z.number().int().optional(),
});
export type Tuplet = z.infer<typeof TupletSchema>;


/**
 * Represents a glissando notation.
 */
export const GlissandoSchema = z.object({
  value: z.string().optional(),
  type: z.enum(["start", "stop"]),
  number: z.number().int().optional(),
});
export type Glissando = z.infer<typeof GlissandoSchema>;

/**
 * Represents a slide notation.
 */
export const SlideSchema = z.object({
  value: z.string().optional(),
  type: z.enum(["start", "stop"]),
  number: z.number().int().optional(),
});
export type Slide = z.infer<typeof SlideSchema>;

/**
 * Represents a tremolo notation.
 */
export const TremoloSchema = z.object({
  value: z.number().int(),
  type: z.enum(["single", "start", "stop", "unmeasured"]).optional(),
});
export type Tremolo = z.infer<typeof TremoloSchema>;

/** Ornaments **/

const TrillLikeSchema = z.object({
  placement: z.enum(["above", "below"]).optional(),
  accelerate: YesNoEnum.optional(),
  beats: z.number().optional(),
  secondBeats: z.number().optional(),
  lastBeat: z.number().optional(),
});
export const TrillMarkSchema = TrillLikeSchema;
export type TrillMark = z.infer<typeof TrillMarkSchema>;

const TurnBaseSchema = TrillLikeSchema.extend({
  slash: YesNoEnum.optional(),
});
export const TurnSchema = TurnBaseSchema;
export type Turn = z.infer<typeof TurnSchema>;

export const MordentSchema = TrillLikeSchema.extend({
  long: YesNoEnum.optional(),
  approach: z.enum(["above", "below"]).optional(),
  departure: z.enum(["above", "below"]).optional(),
});
export type Mordent = z.infer<typeof MordentSchema>;

const EmptyPlacementSchema = z.object({
  placement: z.enum(["above", "below"]).optional(),
});
export const SchleiferSchema = EmptyPlacementSchema;
export type Schleifer = z.infer<typeof SchleiferSchema>;

export const ValuePlacementSchema = z.object({
  value: z.string().optional(),
  placement: z.enum(["above", "below"]).optional(),
});

export const OtherOrnamentSchema = z.object({
  value: z.string().optional(),
  placement: z.enum(["above", "below"]).optional(),
  smufl: z.string().optional(),
});
export type OtherOrnament = z.infer<typeof OtherOrnamentSchema>;

export const OrnamentsSchema = z.object({
  trillMarks: z.array(TrillMarkSchema).optional(),
  turns: z.array(TurnSchema).optional(),
  delayedTurns: z.array(TurnSchema).optional(),
  invertedTurns: z.array(TurnSchema).optional(),
  delayedInvertedTurns: z.array(TurnSchema).optional(),
  verticalTurns: z.array(TrillMarkSchema).optional(),
  invertedVerticalTurns: z.array(TrillMarkSchema).optional(),
  shakes: z.array(TrillMarkSchema).optional(),
  wavyLines: z.array(WavyLineSchema).optional(),
  mordents: z.array(MordentSchema).optional(),
  invertedMordents: z.array(MordentSchema).optional(),
  schleifers: z.array(SchleiferSchema).optional(),
  tremolos: z.array(TremoloSchema).optional(),
  haydns: z.array(TrillMarkSchema).optional(),
  otherOrnaments: z.array(OtherOrnamentSchema).optional(),
  accidentalMarks: z.array(AccidentalSchema).optional(),
});
export type Ornaments = z.infer<typeof OrnamentsSchema>;

/** Technical notations **/

export const FingeringSchema = z.object({
  value: z.string().optional(),
  substitution: YesNoEnum.optional(),
  alternate: YesNoEnum.optional(),
  placement: z.enum(["above", "below"]).optional(),
});
export type Fingering = z.infer<typeof FingeringSchema>;

export const StringSchema = z.object({
  value: z.number().int().optional(),
  placement: z.enum(["above", "below"]).optional(),
});
export type StringNumber = z.infer<typeof StringSchema>;

export const FretSchema = z.object({
  value: z.number().int().optional(),
  placement: z.enum(["above", "below"]).optional(),
});
export type Fret = z.infer<typeof FretSchema>;

export const HammerOnPullOffSchema = z.object({
  value: z.string().optional(),
  type: z.enum(["start", "stop"]),
  number: z.number().int().optional(),
  placement: z.enum(["above", "below"]).optional(),
});
export type HammerOnPullOff = z.infer<typeof HammerOnPullOffSchema>;

export const BendSchema = z.object({
  shape: z.enum(["angled", "curved"]).optional(),
  bendAlter: z.number().optional(),
  release: z.boolean().optional(),
  withBar: z.string().optional(),
  placement: z.enum(["above", "below"]).optional(),
});
export type Bend = z.infer<typeof BendSchema>;

export const TapSchema = z.object({
  value: z.string().optional(),
  hand: z.enum(["left", "right"]).optional(),
  placement: z.enum(["above", "below"]).optional(),
});
export type Tap = z.infer<typeof TapSchema>;

export const OtherTechnicalSchema = z.object({
  value: z.string().optional(),
  placement: z.enum(["above", "below"]).optional(),
  smufl: z.string().optional(),
});
export type OtherTechnical = z.infer<typeof OtherTechnicalSchema>;

export const TechnicalSchema = z.object({
  upBows: z.array(EmptyPlacementSchema).optional(),
  downBows: z.array(EmptyPlacementSchema).optional(),
  harmonics: z.array(EmptyPlacementSchema).optional(),
  openStrings: z.array(EmptyPlacementSchema).optional(),
  thumbPositions: z.array(EmptyPlacementSchema).optional(),
  fingerings: z.array(FingeringSchema).optional(),
  plucks: z.array(ValuePlacementSchema).optional(),
  frets: z.array(FretSchema).optional(),
  strings: z.array(StringSchema).optional(),
  hammerOns: z.array(HammerOnPullOffSchema).optional(),
  pullOffs: z.array(HammerOnPullOffSchema).optional(),
  bends: z.array(BendSchema).optional(),
  taps: z.array(TapSchema).optional(),
  otherTechnical: z.array(OtherTechnicalSchema).optional(),
});

/**
 * Represents an other-notation element.
 */
export const OtherNotationSchema = z.object({
  value: z.string().optional(),
  type: z.enum(["start", "stop", "single"]),
  number: z.number().int().optional(),
});
export type OtherNotation = z.infer<typeof OtherNotationSchema>;

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
  placement: z.enum(["above", "below"]).optional(), // placement for the group
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
  glissandos: z.array(GlissandoSchema).optional(),
  slides: z.array(SlideSchema).optional(),
  tremolos: z.array(TremoloSchema).optional(),
  otherNotations: z.array(OtherNotationSchema).optional(),
});
export type Notations = z.infer<typeof NotationsSchema>;
