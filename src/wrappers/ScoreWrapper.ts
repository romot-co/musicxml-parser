import type { ScorePartwise, Part, ScorePart } from "../types";
import { PartWrapper } from "./PartWrapper";

export class ScoreWrapper {
  readonly score: ScorePartwise;

  constructor(score: ScorePartwise) {
    this.score = score;
  }

  getPart(id: string): PartWrapper | undefined {
    const part = this.score.parts.find((p: Part) => p.id === id);
    const scorePart = this.score.partList.scoreParts.find(
      (sp: ScorePart) => sp.id === id,
    );
    if (!part || !scorePart) return undefined;
    return new PartWrapper(part, scorePart);
  }
}
