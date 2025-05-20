import type { Part, ScorePart, Measure, Note } from "../types";
import { NoteSchema } from "../schemas";

export class PartWrapper {
  readonly part: Part;
  readonly scorePart: ScorePart;

  constructor(part: Part, scorePart: ScorePart) {
    this.part = part;
    this.scorePart = scorePart;
  }

  getMeasure(num: number): Measure | undefined {
    return this.part.measures.find((m) => Number(m.number) === num);
  }

  getNotes(): Note[] {
    const notes: Note[] = [];
    for (const measure of this.part.measures) {
      if (!measure.content) continue;
      for (const item of measure.content) {
        if (NoteSchema.safeParse(item).success) {
          notes.push(item as Note);
        }
      }
    }
    return notes;
  }
}
