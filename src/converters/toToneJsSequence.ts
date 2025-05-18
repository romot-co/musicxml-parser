import type { ScorePartwise, Note, MeasureContent } from "../types";

export interface ToneJsNote {
  time: number;
  duration: number;
  midi: number;
}

export interface ToneJsSequence {
  notes: ToneJsNote[];
}

/**
 * Convert a ScorePartwise object to a minimal Tone.js-like sequence.
 * The conversion is simplistic and only interprets pitched notes.
 */
export function toToneJsSequence(score: ScorePartwise): ToneJsSequence {
  const notes: ToneJsNote[] = [];
  const stepToSemitone: Record<string, number> = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11,
  };

  let time = 0;
  const isNote = (mc: MeasureContent): mc is Note =>
    (mc as Note)._type === "note";

  for (const part of score.parts) {
    for (const measure of part.measures) {
      for (const item of measure.content ?? []) {
        if (isNote(item)) {
          if (item.pitch) {
            const step = item.pitch.step;
            const octave = item.pitch.octave;
            const alter = item.pitch.alter ?? 0;
            const midi = (octave + 1) * 12 + stepToSemitone[step] + alter;
            const duration = item.duration ?? 1;
            notes.push({ time, duration, midi });
            time += duration;
          } else if (item.rest) {
            const restDuration = item.duration ?? 1;
            time += restDuration;
          }
        }
      }
    }
  }

  return { notes };
}
