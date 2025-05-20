import type {
  Part,
  Measure,
  ScorePartwise,
  Note,
  MeasureContent,
} from "../types";
import { NoteSchema } from "../schemas";

export function getAllMeasures(part: Part): Measure[] {
  return part.measures;
}

function isNote(content: MeasureContent): content is Note {
  return (
    (content as Note)._type === "note" && NoteSchema.safeParse(content).success
  );
}

export function getAllNotes(score: ScorePartwise | Part): Note[] {
  if (Array.isArray((score as ScorePartwise).parts)) {
    return (score as ScorePartwise).parts.flatMap((p: Part) => getAllNotes(p));
  }
  const part = score as Part;
  return part.measures.flatMap((m) => (m.content ?? []).filter(isNote));
}
