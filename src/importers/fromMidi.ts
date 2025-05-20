import type { ScorePartwise, MeasureContent, Note, Pitch } from "../types";

interface MidiHeader {
  format: number;
  numTracks: number;
  ticksPerBeat: number;
}

interface MidiNote {
  time: number;
  duration: number;
  midi: number;
}

function readVar(data: Uint8Array, posObj: { value: number }): number {
  let result = 0;
  while (true) {
    const b = data[posObj.value++];
    result = (result << 7) | (b & 0x7f);
    if ((b & 0x80) === 0) break;
  }
  return result;
}

function parseMidi(data: Uint8Array): {
  header: MidiHeader;
  notes: MidiNote[];
} {
  let pos = 0;
  const readStr = (n: number) => {
    const s = String.fromCharCode(...data.slice(pos, pos + n));
    pos += n;
    return s;
  };
  const readU32 = () => {
    const v =
      (data[pos] << 24) |
      (data[pos + 1] << 16) |
      (data[pos + 2] << 8) |
      data[pos + 3];
    pos += 4;
    return v >>> 0;
  };
  const readU16 = () => {
    const v = (data[pos] << 8) | data[pos + 1];
    pos += 2;
    return v;
  };

  if (readStr(4) !== "MThd") throw new Error("Invalid MIDI header");
  const headerLength = readU32();
  const format = readU16();
  const numTracks = readU16();
  const ticksPerBeat = readU16();
  pos += headerLength - 6;

  const notes: MidiNote[] = [];

  for (let t = 0; t < numTracks; t++) {
    if (readStr(4) !== "MTrk") throw new Error("Invalid track header");
    const length = readU32();
    const trackEnd = pos + length;
    let time = 0;
    let status = 0;
    const active = new Map<number, number>();

    while (pos < trackEnd) {
      const deltaPos = { value: pos };
      const delta = readVar(data, deltaPos);
      pos = deltaPos.value;
      time += delta;
      let b = data[pos++];
      if (b >= 0x80) {
        status = b;
      } else {
        // running status
        pos--;
        b = status;
      }
      if (status === 0xff) {
        // meta event
        pos++; // type
        const lenPos = { value: pos };
        const len = readVar(data, lenPos);
        pos = lenPos.value + len;
        continue;
      }
      if (status === 0xf0 || status === 0xf7) {
        const lenPos = { value: pos };
        const len = readVar(data, lenPos);
        pos = lenPos.value + len;
        continue;
      }
      const eventType = status & 0xf0;
      if (eventType === 0x90) {
        const note = data[pos++];
        const vel = data[pos++];
        if (vel === 0) {
          const start = active.get(note);
          if (start !== undefined) {
            active.delete(note);
            notes.push({ time: start, duration: time - start, midi: note });
          }
        } else {
          active.set(note, time);
        }
      } else if (eventType === 0x80) {
        const note = data[pos++];
        pos++; // velocity
        const start = active.get(note);
        if (start !== undefined) {
          active.delete(note);
          notes.push({ time: start, duration: time - start, midi: note });
        }
      } else {
        if (eventType === 0xc0 || eventType === 0xd0) {
          pos++;
        } else {
          pos += 2;
        }
      }
    }
  }
  notes.sort((a, b) => a.time - b.time);
  return { header: { format, numTracks, ticksPerBeat }, notes };
}

function midiToPitch(midi: number): Pitch {
  const map: Array<[Pitch["step"], number]> = [
    ["C", 0],
    ["C", 1],
    ["D", 0],
    ["D", 1],
    ["E", 0],
    ["F", 0],
    ["F", 1],
    ["G", 0],
    ["G", 1],
    ["A", 0],
    ["A", 1],
    ["B", 0],
  ];
  const semitone = midi % 12;
  const octave = Math.floor(midi / 12) - 1;
  const [step, alter] = map[semitone];
  if (alter !== 0) {
    return { step, alter, octave };
  }
  return { step, octave };
}

export function fromMidi(data: Uint8Array): ScorePartwise {
  const { header: _header, notes } = parseMidi(data);
  const contents: MeasureContent[] = [];
  let time = 0;
  for (const n of notes) {
    if (n.time > time) {
      const rest: Note = { _type: "note", rest: {}, duration: n.time - time };
      contents.push(rest);
      time = n.time;
    }
    const pitch = midiToPitch(n.midi);
    const note: Note = { _type: "note", pitch, duration: n.duration };
    contents.push(note);
    time = n.time + n.duration;
  }
  const score: ScorePartwise = {
    version: "1.0",
    partList: { scoreParts: [{ id: "P1", partName: "MIDI Import" }] },
    parts: [{ id: "P1", measures: [{ number: "1", content: contents }] }],
  };
  // Preserve ticksPerBeat by storing in defaults? For now ignore header
  return score;
}
