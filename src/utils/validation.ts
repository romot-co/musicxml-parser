import { ScorePartwiseSchema } from "../schemas/scorePartwise";
import type { ScorePartwise } from "../types";

/**
 * Validate a ScorePartwise object using the corresponding Zod schema.
 * @throws {ZodError} If validation fails.
 */
export function validateScore(score: ScorePartwise): void {
  const result = ScorePartwiseSchema.safeParse(score);
  if (!result.success) {
    throw result.error;
  }
}
