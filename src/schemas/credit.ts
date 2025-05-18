import { z } from "zod";
import { FontSchema } from "./common"; // Assuming ColorSchema might be added here later
import { LinkSchema } from "./link";
import { BookmarkSchema } from "./bookmark";

// Placeholder for text formatting attributes (simplified)
export const TextFormattingSchema = z
  .object({
    justify: z.enum(["left", "center", "right"]).optional(),
    halign: z.enum(["left", "center", "right"]).optional(),
    defaultX: z.number().optional(),
    defaultY: z.number().optional(),
    valign: z.enum(["top", "middle", "bottom", "baseline"]).optional(),
    // ... other attributes like Smufl, text-decoration etc.
    color: z.string().optional(),
  })
  .merge(FontSchema); // Include font attributes

// Placeholder for symbol formatting attributes (simplified)
export const SymbolFormattingSchema = z.object({
  defaultX: z.number().optional(),
  defaultY: z.number().optional(),
  halign: z.enum(["left", "center", "right"]).optional(),
  valign: z.enum(["top", "middle", "bottom"]).optional(),
  // ... color, etc.
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
  creditWords: z.array(CreditWordsSchema).optional(), // Simplified: only allowing multiple words
  creditSymbols: z.array(CreditSymbolSchema).optional(), // Simplified
  creditImage: CreditImageSchema.optional(), // Simplified: only one image
  // The DTD allows a sequence of (credit-words | credit-symbol), which is hard to model directly with Zod objects for now.
  // This simplified schema allows arrays of words, symbols, or a single image.
});

export type TextFormatting = z.infer<typeof TextFormattingSchema>;
export type SymbolFormatting = z.infer<typeof SymbolFormattingSchema>;
export type CreditType = z.infer<typeof CreditTypeSchema>;
export type CreditWords = z.infer<typeof CreditWordsSchema>;
export type CreditSymbol = z.infer<typeof CreditSymbolSchema>;
export type CreditImage = z.infer<typeof CreditImageSchema>;
export type Credit = z.infer<typeof CreditSchema>;
