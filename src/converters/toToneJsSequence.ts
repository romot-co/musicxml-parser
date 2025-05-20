import type {
  ScorePartwise,
  Note,
  MeasureContent,
  Backup,
  Forward,
} from "../types";

export interface ToneJsNote {
  time: number;
  duration: number;
  midi: number;
  partId: string;
  voice?: string;
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

  const isNote = (mc: MeasureContent): mc is Note =>
    (mc as Note)._type === "note";
  const isBackup = (mc: MeasureContent): mc is Backup =>
    (mc as Backup)._type === "backup";
  const isForward = (mc: MeasureContent): mc is Forward =>
    (mc as Forward)._type === "forward";

  for (const part of score.parts) {
    let partTime = 0; // absolute time at start of measure

    for (const measure of part.measures) {
      let cursor = 0; // time position within measure
      let maxTime = 0; // track measure length

      for (const item of measure.content ?? []) {
        if (isNote(item)) {
          if (item.pitch) {
            const step = item.pitch.step;
            const octave = item.pitch.octave;
            const alter = item.pitch.alter ?? 0;
            const midi = (octave + 1) * 12 + stepToSemitone[step] + alter;
            const duration = item.duration ?? 1;
            notes.push({
              time: partTime + cursor,
              duration,
              midi,
              partId: part.id,
              voice: item.voice,
            });
            if (!item.isChord) {
              cursor += duration;
              if (cursor > maxTime) maxTime = cursor;
            }
          } else if (item.rest) {
            const restDuration = item.duration ?? 1;
            if (!item.isChord) {
              cursor += restDuration;
              if (cursor > maxTime) maxTime = cursor;
            }
          }
        } else if (isBackup(item)) {
          cursor -= item.duration;
          if (cursor < 0) cursor = 0;
        } else if (isForward(item)) {
          cursor += item.duration;
          if (cursor > maxTime) maxTime = cursor;
        }
      }

      partTime += maxTime;
    }
  }

  return { notes };
}
