import { z } from "zod";

// Common types and utility schemas can be defined here.
// For example, a schema for positive numbers, specific string formats, etc.

export const YesNoEnum = z.enum(["yes", "no"]);

export type YesNo = z.infer<typeof YesNoEnum>;

export const FontStyleEnum = z.enum(["normal", "italic"]);
export const FontWeightEnum = z.enum(["normal", "bold"]);

export const FontSchema = z.object({
  fontFamily: z.string().optional(), // Comma-separated list of font names
  fontStyle: FontStyleEnum.optional(),
  fontSize: z.string().optional(), // CSS font-size values (e.g., "10pt", "1.2em")
  fontWeight: FontWeightEnum.optional(),
});
export type Font = z.infer<typeof FontSchema>;

export const MarginsSchema = z.object({
  leftMargin: z.number().optional(),
  rightMargin: z.number().optional(),
  topMargin: z.number().optional(),
  bottomMargin: z.number().optional(),
});
export type Margins = z.infer<typeof MarginsSchema>;

export const LineWidthSchema = z.object({
  type: z.string().optional(), // NMTOKEN
  value: z.number().optional(),
});
export type LineWidth = z.infer<typeof LineWidthSchema>;

/** Boolean yes/no or numeric value. Used for pedal playback levels. */
export const YesNoNumberSchema = z.union([YesNoEnum, z.number()]);
export type YesNoNumber = z.infer<typeof YesNoNumberSchema>;

/** Rotation degrees from -180 to 180, used for pan and elevation. */
export const RotationDegreesSchema = z.number().min(-180).max(180);
export type RotationDegrees = z.infer<typeof RotationDegreesSchema>;

// export {}; // Ensures this is treated as a module - can be removed if other exports exist
