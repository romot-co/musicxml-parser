import { z } from "zod";

/**
 * The stem type represents the visual appearance of a stem.
 * Typical values are "up", "down", "none", and "double".
 */
export const StemValueEnum = z.enum(["up", "down", "none", "double"]);
export type StemValue = z.infer<typeof StemValueEnum>;

/**
 * Schema for the <stem> element.
 * It typically contains a value indicating the stem direction.
 */
export const StemSchema = StemValueEnum; // The schema is just the enum itself
export type Stem = StemValue; // Type is the same as StemValue
