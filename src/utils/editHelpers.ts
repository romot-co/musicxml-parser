import { ScorePartwiseSchema } from "../schemas/scorePartwise";
import type { Note, ScorePartwise, Pitch, Part, Measure } from "../types";

function validate(score: ScorePartwise): void {
  // Throws if invalid
  ScorePartwiseSchema.parse(score);
}

/**
 * Add a note to the specified measure of a part.
 * The score is validated after the modification.
 */
export function addNote(
  partId: string,
  measureNo: string,
  note: Note,
  score: ScorePartwise,
): ScorePartwise {
  const part = score.parts.find((p: Part) => p.id === partId);
  if (!part) {
    throw new Error(`Part with id ${partId} not found`);
  }
  const measure = part.measures.find((m: Measure) => m.number === measureNo);
  if (!measure) {
    throw new Error(`Measure ${measureNo} not found in part ${partId}`);
  }
  if (!measure.content) measure.content = [];
  measure.content.push(note);
  return validate(score), score;
}

const STEP_TO_SEMITONE: Record<Pitch["step"], number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

const SEMITONE_TO_PITCH: Array<Pick<Pitch, "step" | "alter"> | Pitch> = [
  { step: "C" },
  { step: "C", alter: 1 },
  { step: "D" },
  { step: "D", alter: 1 },
  { step: "E" },
  { step: "F" },
  { step: "F", alter: 1 },
  { step: "G" },
  { step: "G", alter: 1 },
  { step: "A" },
  { step: "A", alter: 1 },
  { step: "B" },
];

function transposePitch(pitch: Pitch, semitones: number): void {
  const alter = pitch.alter ?? 0;
  const midi =
    (pitch.octave + 1) * 12 + STEP_TO_SEMITONE[pitch.step] + alter + semitones;
  const octave = Math.floor(midi / 12) - 1;
  let s = midi % 12;
  if (s < 0) s += 12;
  const mapping = SEMITONE_TO_PITCH[s];
  pitch.step = mapping.step as Pitch["step"];
  if ("alter" in mapping && mapping.alter !== undefined) {
    pitch.alter = mapping.alter;
  } else {
    delete pitch.alter;
  }
  pitch.octave = octave;
}

/**
 * Transpose all pitched notes in the given part by the specified number of semitones.
 * The score is validated after transposition.
 */
export function transposePart(
  partId: string,
  semitones: number,
  score: ScorePartwise,
): ScorePartwise {
  const part = score.parts.find((p: Part) => p.id === partId);
  if (!part) {
    throw new Error(`Part with id ${partId} not found`);
  }

  for (const measure of part.measures) {
    for (const item of measure.content ?? []) {
      if ((item as { _type?: string })._type === "note") {
        const note = item as Note;
        if (note.pitch) {
          transposePitch(note.pitch, semitones);
        }
      }
    }
  }

  return validate(score), score;
}

export const editHelpers = {
  addNote,
  transposePart,
};

export default editHelpers;
