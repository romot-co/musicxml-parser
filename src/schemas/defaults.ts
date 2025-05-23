import { z } from "zod";
import {
  FontStyleEnum,
  FontWeightEnum,
  MarginsSchema,
  LineWidthSchema,
} from "./common";

/**
 * Defines the scaling from global tenths to physical units.
 * Both millimeters and tenths are required in MusicXML.
 */
export const ScalingSchema = z.object({
  /** Distance in millimeters between one tenth and the next. */
  millimeters: z.number(),
  /** Number of tenths per staff space. */
  tenths: z.number(),
});
export const PageLayoutSchema = z.object({
  pageHeight: z.number().optional(),
  pageWidth: z.number().optional(),
  pageMargins: z.array(MarginsSchema).optional(),
});
export const SystemDividersSchema = z.object({
  /** Presence of a left-divider element. */
  leftDivider: z.boolean().optional(),
  /** Presence of a right-divider element. */
  rightDivider: z.boolean().optional(),
});

export const SystemLayoutSchema = z.object({
  systemMargins: MarginsSchema.optional(),
  systemDistance: z.number().optional(),
  topSystemDistance: z.number().optional(),
  systemDividers: SystemDividersSchema.optional(),
});
export const StaffLayoutSchema = z.object({
  /** Optional staff number this layout applies to. Staves are numbered from top
   *  to bottom starting at 1. */
  number: z.number().int().optional(),
  /** Distance from the previous staff in tenths. */
  staffDistance: z.number().optional(),
});
export const NoteSizeTypeEnum = z.enum(["cue", "grace", "grace-cue", "large"]);

export const NoteSizeSchema = z.object({
  type: NoteSizeTypeEnum,
  value: z.number(),
});

export const DistanceSchema = z.object({
  type: z.string(),
  value: z.number(),
});

export const GlyphSchema = z.object({
  type: z.string(),
  value: z.string(),
});

export const OtherAppearanceSchema = z.object({
  type: z.string(),
  value: z.string(),
});

export const AppearanceSchema = z.object({
  lineWidths: z.array(LineWidthSchema).optional(),
  noteSizes: z.array(NoteSizeSchema).optional(),
  distances: z.array(DistanceSchema).optional(),
  glyphs: z.array(GlyphSchema).optional(),
  otherAppearances: z.array(OtherAppearanceSchema).optional(),
});

export const ConcertScoreSchema = z.object({}); // Empty element

export const MusicFontSchema = z.object({
  fontFamily: z.string().optional(),
  fontStyle: FontStyleEnum.optional(),
  fontSize: z.string().optional(),
  fontWeight: FontWeightEnum.optional(),
});
export const WordFontSchema = MusicFontSchema;

export const LyricFontSchema = MusicFontSchema.extend({
  number: z.string().optional(), // NMTOKEN
  name: z.string().optional(), // CDATA
});

export const LyricLanguageSchema = z.object({
  number: z.string().optional(), // NMTOKEN
  name: z.string().optional(), // CDATA
  xmlLang: z.string(), // CDATA #REQUIRED
});

export const DefaultsSchema = z.object({
  scaling: ScalingSchema.optional(),
  concertScore: ConcertScoreSchema.optional(),
  pageLayout: PageLayoutSchema.optional(),
  systemLayout: SystemLayoutSchema.optional(),
  staffLayout: z.array(StaffLayoutSchema).optional(), // staff-layout can appear multiple times
  appearance: AppearanceSchema.optional(),
  musicFont: MusicFontSchema.optional(),
  wordFont: WordFontSchema.optional(),
  lyricFonts: z.array(LyricFontSchema).optional(),
  lyricLanguages: z.array(LyricLanguageSchema).optional(),
});

export type Scaling = z.infer<typeof ScalingSchema>;
export type PageLayout = z.infer<typeof PageLayoutSchema>;
export type SystemLayout = z.infer<typeof SystemLayoutSchema>;
export type SystemDividers = z.infer<typeof SystemDividersSchema>;
export type StaffLayout = z.infer<typeof StaffLayoutSchema>;
export type Appearance = z.infer<typeof AppearanceSchema>;
export type NoteSize = z.infer<typeof NoteSizeSchema>;
export type Distance = z.infer<typeof DistanceSchema>;
export type Glyph = z.infer<typeof GlyphSchema>;
export type OtherAppearance = z.infer<typeof OtherAppearanceSchema>;
export type ConcertScore = z.infer<typeof ConcertScoreSchema>;
export type MusicFont = z.infer<typeof MusicFontSchema>;
export type WordFont = z.infer<typeof WordFontSchema>;
export type LyricFont = z.infer<typeof LyricFontSchema>;
export type LyricLanguage = z.infer<typeof LyricLanguageSchema>;
export type Defaults = z.infer<typeof DefaultsSchema>;
