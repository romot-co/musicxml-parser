import type { ScorePartwise, Note, MeasureContent } from "../types";

function indent(level: number): string {
  return "  ".repeat(level);
}

/** Serialize a ScorePartwise object into a minimal MusicXML string. */
export function toMusicXML(score: ScorePartwise): string {
  const lines: string[] = [];
  const version = score.version ?? "1.0";
  lines.push(`<score-partwise version="${version}">`);

  // Part list
  lines.push(`${indent(1)}<part-list>`);
  for (const part of score.partList.scoreParts) {
    lines.push(`${indent(2)}<score-part id="${part.id}">`);
    if (part.partName) {
      lines.push(`${indent(3)}<part-name>${part.partName}</part-name>`);
    }
    lines.push(`${indent(2)}</score-part>`);
  }
  lines.push(`${indent(1)}</part-list>`);

  const isNote = (mc: MeasureContent): mc is Note =>
    (mc as Note)._type === "note";

  // Parts
  for (const part of score.parts) {
    lines.push(`${indent(1)}<part id="${part.id}">`);
    for (const measure of part.measures) {
      lines.push(`${indent(2)}<measure number="${measure.number}">`);
      if (measure.content) {
        for (const item of measure.content) {
          if (isNote(item)) {
            lines.push(`${indent(3)}<note>`);
            if (item.pitch) {
              lines.push(`${indent(4)}<pitch>`);
              lines.push(`${indent(5)}<step>${item.pitch.step}</step>`);
              if (item.pitch.alter !== undefined) {
                lines.push(`${indent(5)}<alter>${item.pitch.alter}</alter>`);
              }
              lines.push(`${indent(5)}<octave>${item.pitch.octave}</octave>`);
              lines.push(`${indent(4)}</pitch>`);
            } else if (item.rest) {
              lines.push(`${indent(4)}<rest/>`);
            }
            if (item.duration !== undefined) {
              lines.push(`${indent(4)}<duration>${item.duration}</duration>`);
            }
            if (item.type) {
              lines.push(`${indent(4)}<type>${item.type}</type>`);
            }
            lines.push(`${indent(3)}</note>`);
          }
        }
      }
      lines.push(`${indent(2)}</measure>`);
    }
    lines.push(`${indent(1)}</part>`);
  }

  lines.push(`</score-partwise>`);
  return lines.join("\n");
}
