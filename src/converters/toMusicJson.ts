import type { ScorePartwise } from "../types";

/** Convert a ScorePartwise object to a pretty JSON string. */
export function toMusicJson(score: ScorePartwise): string {
  return JSON.stringify(score, null, 2);
}
