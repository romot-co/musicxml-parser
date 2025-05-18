import { z } from "zod";
import { FermataSchema } from "./fermata";
import { WavyLineSchema } from "./wavyLine";
import { FootnoteSchema, LevelSchema } from "./editorial";

/**
 * The bar-style simple type represents the graphic appearance of a barline.
 * Standard values are regular, dotted, dashed, heavy, light-light, light-heavy, heavy-light, heavy-heavy, tick, short, and none.
 */
export const BarStyleEnum = z.enum([
  "regular",
  "dotted",
  "dashed",
  "heavy",
  "light-light",
  "light-heavy",
  "heavy-light",
  "heavy-heavy",
  "tick",
  "short",
  "none",
]);
export type BarStyle = z.infer<typeof BarStyleEnum>;

/**
 * The repeat element is used to indicate repeats and endings.
 * The direction attribute indicates forward or backward repeats.
 */
export const RepeatSchema = z.object({
  direction: z.enum(["forward", "backward"]),
  /** MusicXML 4.0: The times attribute indicates the number of times the repeated section is played. */
  times: z.number().int().positive().optional(),
  /** MusicXML 4.0: The winged attribute indicates the style of winged repeats. */
  winged: z
    .enum(["none", "straight", "curved", "double-straight", "double-curved"])
    .optional(),
});
export type Repeat = z.infer<typeof RepeatSchema>;

/**
 * The ending element is used for 1st and 2nd endings.
 * The number attribute indicates the ending number(s), and type is start, stop, or discontinue.
 */
export const EndingSchema = z.object({
  number: z.string(), // Comma-separated list of ending numbers, e.g., "1", "2,5"
  type: z.enum(["start", "stop", "discontinue"]),
  text: z.string().optional(), // The text of the ending, e.g., "1.", "To Coda"
  "print-object": z.enum(["yes", "no"]).optional(),
  // Position and font attributes from %print-style
  defaultX: z.number().optional(),
  defaultY: z.number().optional(),
  relativeX: z.number().optional(),
  relativeY: z.number().optional(),
  fontFamily: z.string().optional(),
  fontStyle: z.enum(["normal", "italic"]).optional(),
  fontSize: z.string().optional(),
  fontWeight: z.enum(["normal", "bold"]).optional(),
  color: z.string().optional(),
  // System relation and additional positioning attributes
  system: z.enum(["none", "only-top", "also-top"]).optional(),
  endLength: z.number().optional(),
  textX: z.number().optional(),
  textY: z.number().optional(),
});
export type Ending = z.infer<typeof EndingSchema>;

/**
 * The barline element is used to represent barlines, including repeats and endings.
 */
export const BarlineSchema = z.object({
  _type: z.literal("barline"),
  /**
   * The location attribute indicates whether the barline appears to the left, right, or center of the measure.
   * Defaults to right if not specified.
   */
  location: z.enum(["left", "right", "middle"]).optional(),
  /**
   * The bar-style element indicates the style of the barline (e.g., heavy, light-light, none).
   */
  barStyle: BarStyleEnum.optional(),
  /**
   * The repeat element indicates a repeat mark.
   */
  repeat: RepeatSchema.optional(),
  /**
   * The ending element indicates an ending for a repeated section.
   */
  ending: EndingSchema.optional(),
  /**
   * The coda element, if present, indicates a coda mark.
   * This is an empty element in MusicXML.
   */
  coda: z.object({}).optional(),
  /**
   * The segno element, if present, indicates a segno mark.
   * This is an empty element in MusicXML.
   */
  segno: z.object({}).optional(),
  /** Editorial footnote information. */
  footnote: FootnoteSchema.optional(),
  /** Editorial level information. */
  level: LevelSchema.optional(),
  /** Optional wavy-line element used for trills or vibrato marks. */
  wavyLine: WavyLineSchema.optional(),
  /**
   * Optional fermata markings that appear with the barline. Up to two are allowed.
   */
  fermata: z.array(FermataSchema).optional(),
  /** Segno attribute for playback when a segno child is present. */
  segnoAttr: z.string().optional(),
  /** Coda attribute for playback when a coda child is present. */
  codaAttr: z.string().optional(),
  /** Divisions attribute used with segno or coda jumps. */
  divisions: z.number().optional(),
  /** Optional unique ID value. */
  id: z.string().optional(),
});
export type Barline = z.infer<typeof BarlineSchema>;
