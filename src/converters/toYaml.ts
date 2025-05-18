import type { ScorePartwise } from "../types";
import { dump } from "js-yaml";

/** Convert a ScorePartwise object to a YAML string. */
export function toYaml(score: ScorePartwise): string {
  return dump(score);
}
