import type { ScorePartwise } from "../types";
import { toToneJsSequence } from "./toToneJsSequence";

export interface MidiHeader {
  format: number;
  numTracks: number;
  ticksPerBeat: number;
}

export interface MidiNote {
  time: number;
  duration: number;
  midi: number;
}

export interface MidiData {
  header: MidiHeader;
  tracks: MidiNote[];
}

/**
 * Convert a ScorePartwise object to a very simple MIDI-like data structure.
 * This does not produce a binary MIDI file but returns note data that can be
 * fed into a MIDI library.
 */
export function toMidi(score: ScorePartwise): MidiData {
  const sequence = toToneJsSequence(score);
  const midiNotes: MidiNote[] = sequence.notes.map((n) => ({
    time: n.time,
    duration: n.duration,
    midi: n.midi,
  }));
  return {
    header: {
      format: 1,
      numTracks: 1,
      ticksPerBeat: 480,
    },
    tracks: midiNotes,
  };
}
