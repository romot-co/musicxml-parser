import { z } from 'zod';
import { FontSchema, MarginsSchema, LineWidthSchema } from './common';

// Placeholders for complex layout and appearance types
export const ScalingSchema = z.object({ // TODO: Define scaling details (millimeters, tenths)
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
export const SystemLayoutSchema = z.object({
  systemMargins: MarginsSchema.optional(),
  systemDistance: z.number().optional(),
  topSystemDistance: z.number().optional(),
}); 
export const StaffLayoutSchema = z.object({
  /** Optional staff number this layout applies to. Staves are numbered from top
   *  to bottom starting at 1. */
  number: z.number().int().optional(),
  /** Distance from the previous staff in tenths. */
  staffDistance: z.number().optional(),
});
export const AppearanceSchema = z.object({
  lineWidths: z.array(LineWidthSchema).optional(),
}); 

export const ConcertScoreSchema = z.object({}); // Empty element

export const MusicFontSchema = FontSchema;
export const WordFontSchema = FontSchema;

export const LyricFontSchema = FontSchema.extend({
  number: z.string().optional(), // NMTOKEN
  name: z.string().optional(),   // CDATA
});

export const LyricLanguageSchema = z.object({
  number: z.string().optional(), // NMTOKEN
  name: z.string().optional(),   // CDATA
  xmlLang: z.string(),           // CDATA #REQUIRED
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
export type StaffLayout = z.infer<typeof StaffLayoutSchema>;
export type Appearance = z.infer<typeof AppearanceSchema>;
export type ConcertScore = z.infer<typeof ConcertScoreSchema>;
export type MusicFont = z.infer<typeof MusicFontSchema>;
export type WordFont = z.infer<typeof WordFontSchema>;
export type LyricFont = z.infer<typeof LyricFontSchema>;
export type LyricLanguage = z.infer<typeof LyricLanguageSchema>;
export type Defaults = z.infer<typeof DefaultsSchema>; 