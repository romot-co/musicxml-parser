import type {
  ScorePartwise,
  Note,
  MeasureContent,
  Attributes,
  Direction,
  Barline,
  ScoreInstrument,
  MidiInstrument,
  MidiDevice,
} from "../types";

function indent(level: number): string {
  return "  ".repeat(level);
}

function serializeNote(note: Note, level: number, lines: string[]): void {
  lines.push(`${indent(level)}<note>`);
  if (note.pitch) {
    lines.push(`${indent(level + 1)}<pitch>`);
    lines.push(`${indent(level + 2)}<step>${note.pitch.step}</step>`);
    if (note.pitch.alter !== undefined) {
      lines.push(`${indent(level + 2)}<alter>${note.pitch.alter}</alter>`);
    }
    lines.push(`${indent(level + 2)}<octave>${note.pitch.octave}</octave>`);
    lines.push(`${indent(level + 1)}</pitch>`);
  } else if (note.rest) {
    lines.push(`${indent(level + 1)}<rest/>`);
  }
  if (note.duration !== undefined) {
    lines.push(`${indent(level + 1)}<duration>${note.duration}</duration>`);
  }
  if (note.type) {
    lines.push(`${indent(level + 1)}<type>${note.type}</type>`);
  }
  lines.push(`${indent(level)}</note>`);
}

function serializeAttributes(
  attrs: Attributes,
  level: number,
  lines: string[],
): void {
  lines.push(`${indent(level)}<attributes>`);
  if (attrs.divisions !== undefined) {
    lines.push(`${indent(level + 1)}<divisions>${attrs.divisions}</divisions>`);
  }
  if (attrs.key) {
    for (const k of attrs.key) {
      lines.push(`${indent(level + 1)}<key>`);
      lines.push(`${indent(level + 2)}<fifths>${k.fifths}</fifths>`);
      if (k.mode) lines.push(`${indent(level + 2)}<mode>${k.mode}</mode>`);
      lines.push(`${indent(level + 1)}</key>`);
    }
  }
  if (attrs.time) {
    for (const t of attrs.time) {
      lines.push(`${indent(level + 1)}<time>`);
      if (t.beats && t["beat-type"]) {
        lines.push(`${indent(level + 2)}<beats>${t.beats}</beats>`);
        lines.push(
          `${indent(level + 2)}<beat-type>${t["beat-type"]}</beat-type>`,
        );
      } else if (t.senzaMisura) {
        lines.push(`${indent(level + 2)}<senza-misura/>`);
      }
      lines.push(`${indent(level + 1)}</time>`);
    }
  }
  if (attrs.clef) {
    for (const c of attrs.clef) {
      const attrsStr = c.number !== undefined ? ` number="${c.number}"` : "";
      lines.push(`${indent(level + 1)}<clef${attrsStr}>`);
      lines.push(`${indent(level + 2)}<sign>${c.sign}</sign>`);
      if (c.line !== undefined)
        lines.push(`${indent(level + 2)}<line>${c.line}</line>`);
      lines.push(`${indent(level + 1)}</clef>`);
    }
  }
  if (attrs.staves !== undefined) {
    lines.push(`${indent(level + 1)}<staves>${attrs.staves}</staves>`);
  }
  if (attrs.instruments !== undefined) {
    lines.push(
      `${indent(level + 1)}<instruments>${attrs.instruments}</instruments>`,
    );
  }
  lines.push(`${indent(level)}</attributes>`);
}

function serializeDirection(
  direction: Direction,
  level: number,
  lines: string[],
): void {
  let attrsStr = "";
  if (direction.placement) attrsStr += ` placement="${direction.placement}"`;
  if (direction.staff !== undefined) attrsStr += ` staff="${direction.staff}"`;
  if (direction.directive) attrsStr += ` directive="${direction.directive}"`;
  lines.push(`${indent(level)}<direction${attrsStr}>`);
  for (const dt of direction.direction_type) {
    lines.push(`${indent(level + 1)}<direction-type>`);
    if (dt.words) {
      lines.push(`${indent(level + 2)}<words>${dt.words.text}</words>`);
    }
    if (dt.dynamics) {
      lines.push(`${indent(level + 2)}<dynamics>`);
      lines.push(`${indent(level + 3)}<${dt.dynamics.value}/>`);
      lines.push(`${indent(level + 2)}</dynamics>`);
    }
    lines.push(`${indent(level + 1)}</direction-type>`);
  }
  if (direction.offset !== undefined) {
    lines.push(`${indent(level + 1)}<offset>${direction.offset}</offset>`);
  }
  if (direction.sound && direction.sound.tempo !== undefined) {
    lines.push(`${indent(level + 1)}<sound tempo="${direction.sound.tempo}"/>`);
  }
  lines.push(`${indent(level)}</direction>`);
}

function serializeBarline(
  barline: Barline,
  level: number,
  lines: string[],
): void {
  const attrsStr = barline.location ? ` location="${barline.location}"` : "";
  lines.push(`${indent(level)}<barline${attrsStr}>`);
  if (barline.barStyle) {
    const color = barline.barStyleColor
      ? ` color="${barline.barStyleColor}"`
      : "";
    lines.push(
      `${indent(level + 1)}<bar-style${color}>${barline.barStyle}</bar-style>`,
    );
  }
  if (barline.repeat) {
    const r = barline.repeat;
    let attrs = ` direction="${r.direction}"`;
    if (r.times !== undefined) attrs += ` times="${r.times}"`;
    if (r.winged) attrs += ` winged="${r.winged}"`;
    if (r.afterJump) attrs += ` after-jump="${r.afterJump}"`;
    lines.push(`${indent(level + 1)}<repeat${attrs}/>`);
  }
  lines.push(`${indent(level)}</barline>`);
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
    if (part.partAbbreviation) {
      lines.push(
        `${indent(3)}<part-abbreviation>${part.partAbbreviation}</part-abbreviation>`,
      );
    }
    if (part.scoreInstruments) {
      for (const instr of part.scoreInstruments as ScoreInstrument[]) {
        lines.push(`${indent(3)}<score-instrument id="${instr.id}">`);
        lines.push(
          `${indent(4)}<instrument-name>${instr.instrumentName}</instrument-name>`,
        );
        if (instr.instrumentSound)
          lines.push(
            `${indent(4)}<instrument-sound>${instr.instrumentSound}</instrument-sound>`,
          );
        lines.push(`${indent(3)}</score-instrument>`);
      }
    }
    if (part.midiDevices) {
      for (const dev of part.midiDevices as MidiDevice[]) {
        let attrs = dev.id ? ` id="${dev.id}"` : "";
        if (dev.port !== undefined) attrs += ` port="${dev.port}"`;
        lines.push(
          `${indent(3)}<midi-device${attrs}>${dev.value}</midi-device>`,
        );
      }
    }
    if (part.midiInstruments) {
      for (const mi of part.midiInstruments as MidiInstrument[]) {
        lines.push(`${indent(3)}<midi-instrument id="${mi.id}">`);
        if (mi.midiChannel !== undefined)
          lines.push(
            `${indent(4)}<midi-channel>${mi.midiChannel}</midi-channel>`,
          );
        if (mi.midiProgram !== undefined)
          lines.push(
            `${indent(4)}<midi-program>${mi.midiProgram}</midi-program>`,
          );
        if (mi.volume !== undefined)
          lines.push(`${indent(4)}<volume>${mi.volume}</volume>`);
        if (mi.pan !== undefined)
          lines.push(`${indent(4)}<pan>${mi.pan}</pan>`);
        lines.push(`${indent(3)}</midi-instrument>`);
      }
    }
    lines.push(`${indent(2)}</score-part>`);
  }
  lines.push(`${indent(1)}</part-list>`);

  const isNote = (mc: MeasureContent): mc is Note =>
    (mc as Note)._type === "note";
  const isAttributes = (mc: MeasureContent): mc is Attributes =>
    (mc as Attributes)._type === "attributes";
  const isDirection = (mc: MeasureContent): mc is Direction =>
    (mc as Direction)._type === "direction";
  const isBarline = (mc: MeasureContent): mc is Barline =>
    (mc as Barline)._type === "barline";

  // Parts
  for (const part of score.parts) {
    lines.push(`${indent(1)}<part id="${part.id}">`);
    for (const measure of part.measures) {
      lines.push(`${indent(2)}<measure number="${measure.number}">`);
      if (measure.content) {
        for (const item of measure.content) {
          if (isNote(item)) {
            serializeNote(item, 3, lines);
          } else if (isAttributes(item)) {
            serializeAttributes(item, 3, lines);
          } else if (isDirection(item)) {
            serializeDirection(item, 3, lines);
          } else if (isBarline(item)) {
            serializeBarline(item, 3, lines);
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
