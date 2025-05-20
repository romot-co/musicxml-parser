import { z } from "zod";
import { FontStyleEnum, FontWeightEnum } from "./common"; // Assuming ColorSchema might be added here later
import { LinkSchema } from "./link";
import { BookmarkSchema } from "./bookmark";

// Placeholder for text formatting attributes (simplified)
export const TextFormattingSchema = z.object({
  fontFamily: z.string().optional(),
  fontStyle: FontStyleEnum.optional(),
  fontSize: z.string().optional(),
  fontWeight: FontWeightEnum.optional(),
  justify: z.enum(["left", "center", "right"]).optional(),
  halign: z.enum(["left", "center", "right"]).optional(),
  valign: z.enum(["top", "middle", "bottom", "baseline"]).optional(),
  defaultX: z.number().optional(),
  defaultY: z.number().optional(),
  relativeX: z.number().optional(),
  relativeY: z.number().optional(),
  underline: z.number().optional(),
  overline: z.number().optional(),
  lineThrough: z.number().optional(),
  rotation: z.number().optional(),
  letterSpacing: z.string().optional(),
  lineHeight: z.string().optional(),
  dir: z.enum(["ltr", "rtl", "lro", "rlo"]).optional(),
  enclosure: z.string().optional(),
  xmlLang: z.string().optional(),
  xmlSpace: z.enum(["default", "preserve"]).optional(),
  color: z.string().optional(),
});

// Placeholder for symbol formatting attributes (simplified)
export const SymbolFormattingSchema = z.object({
  fontFamily: z.string().optional(),
  fontStyle: FontStyleEnum.optional(),
  fontSize: z.string().optional(),
  fontWeight: FontWeightEnum.optional(),
  justify: z.enum(["left", "center", "right"]).optional(),
  halign: z.enum(["left", "center", "right"]).optional(),
  valign: z.enum(["top", "middle", "bottom"]).optional(),
  defaultX: z.number().optional(),
  defaultY: z.number().optional(),
  relativeX: z.number().optional(),
  relativeY: z.number().optional(),
  underline: z.number().optional(),
  overline: z.number().optional(),
  lineThrough: z.number().optional(),
  rotation: z.number().optional(),
  letterSpacing: z.string().optional(),
  lineHeight: z.string().optional(),
  dir: z.enum(["ltr", "rtl", "lro", "rlo"]).optional(),
  enclosure: z.string().optional(),
  color: z.string().optional(),
});

export const CreditTypeSchema = z.string();

export const CreditWordsSchema = z.object({
  text: z.string(),
  formatting: TextFormattingSchema.optional(),
});

export const CreditSymbolSchema = z.object({
  smuflGlyphName: z.string(), // The PCDATA content for credit-symbol
  formatting: SymbolFormattingSchema.optional(),
});

export const CreditImageSchema = z.object({
  source: z.string(), // CDATA #REQUIRED
  type: z.string(), // CDATA #REQUIRED
  height: z.number().optional(),
  width: z.number().optional(),
  defaultX: z.number().optional(),
  defaultY: z.number().optional(),
  halign: z.enum(["left", "center", "right"]).optional(),
  valign: z.enum(["top", "middle", "bottom"]).optional(),
});

export const CreditSchema = z.object({
  page: z.string().optional(), // NMTOKEN, usually number
  creditTypes: z.array(CreditTypeSchema).optional(),
  links: z.array(LinkSchema).optional(),
  bookmarks: z.array(BookmarkSchema).optional(),
  items: z.array(z.union([CreditWordsSchema, CreditSymbolSchema])).optional(),
  creditImages: z.array(CreditImageSchema).optional(),
});

export type TextFormatting = z.infer<typeof TextFormattingSchema>;
export type SymbolFormatting = z.infer<typeof SymbolFormattingSchema>;
export type CreditType = z.infer<typeof CreditTypeSchema>;
export type CreditWords = z.infer<typeof CreditWordsSchema>;
export type CreditSymbol = z.infer<typeof CreditSymbolSchema>;
export type CreditImage = z.infer<typeof CreditImageSchema>;
export type Credit = z.infer<typeof CreditSchema>;
