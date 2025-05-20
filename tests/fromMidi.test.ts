import { describe, it, expect } from "vitest";
import { fromMidi } from "../src/importers/fromMidi";
import { toMidi } from "../src/converters";

const midiData = new Uint8Array([
  0x4d, 0x54, 0x68, 0x64, 0x00, 0x00, 0x00, 0x06, 0x00, 0x00, 0x00, 0x01, 0x01,
  0xe0, 0x4d, 0x54, 0x72, 0x6b, 0x00, 0x00, 0x00, 0x0d, 0x00, 0x90, 0x3c, 0x40,
  0x83, 0x60, 0x80, 0x3c, 0x40, 0x00, 0xff, 0x2f, 0x00,
]);

describe("fromMidi", () => {
  it("parses a simple MIDI file", () => {
    const score = fromMidi(midiData);
    expect(score.parts.length).toBe(1);
    expect(score.parts[0].measures[0].content.length).toBe(1);
    const midi = toMidi(score);
    expect(midi.header.ticksPerBeat).toBe(480);
    expect(midi.tracks.length).toBe(1);
    expect(midi.tracks[0].midi).toBe(60);
    expect(midi.tracks[0].duration).toBe(480);
  });
});
