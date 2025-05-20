import type { ScorePartwise, ScorePart } from "../types";
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
  /**
   * Each inner array represents a MIDI track. Notes within a track share the
   * same channel and program when provided by the corresponding ScorePart.
   */
  tracks: MidiNote[][];
  /** MIDI channel numbers for each track (1-16) */
  channels?: Array<number | undefined>;
  /** MIDI program numbers for each track (1-128) */
  programs?: Array<number | undefined>;
}

/**
 * Convert a ScorePartwise object to a very simple MIDI-like data structure.
 * This does not produce a binary MIDI file but returns note data that can be
 * fed into a MIDI library.
 */
export function toMidi(score: ScorePartwise): MidiData {
  const tracks: MidiNote[][] = [];
  const channels: Array<number | undefined> = [];
  const programs: Array<number | undefined> = [];

  for (const part of score.parts) {
    const partScore: ScorePartwise = { ...score, parts: [part] };
    const sequence = toToneJsSequence(partScore);
    tracks.push(sequence.notes);

    const meta = (score.partList.scoreParts as ScorePart[]).find(
      (p: ScorePart) => p.id === part.id,
    );
    const midiInfo = meta?.midiInstruments?.[0];
    channels.push(midiInfo?.midiChannel);
    programs.push(midiInfo?.midiProgram);
  }

  return {
    header: {
      format: 1,
      numTracks: tracks.length,
      ticksPerBeat: 480,
    },
    tracks,
    channels,
    programs,
  };
}
