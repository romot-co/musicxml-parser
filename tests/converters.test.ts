import { describe, it, expect } from "vitest";
import { parseMusicXmlString } from "../src/parser/xmlParser";
import { mapDocumentToScorePartwise } from "../src/parser/mappers";
import {
  toMusicJson,
  toYaml,
  toToneJsSequence,
  toMidi,
} from "../src/converters";
import { load } from "js-yaml";

const xml = `
<score-partwise version="3.1">
  <part-list>
    <score-part id="P1">
      <part-name>Music</part-name>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <note>
        <pitch><step>C</step><octave>4</octave></pitch>
        <duration>1</duration>
        <type>quarter</type>
      </note>
    </measure>
  </part>
</score-partwise>`;

describe("Conversion utilities", () => {
  it("serializes to JSON and YAML", async () => {
    const doc = await parseMusicXmlString(xml);
    if (!doc) throw new Error("parse failed");
    const score = mapDocumentToScorePartwise(doc);
    const json = toMusicJson(score);
    expect(JSON.parse(json)).toEqual(score);
    const yamlStr = toYaml(score);
    const obj = load(yamlStr);
    expect(obj).toEqual(JSON.parse(json));
  });

  it("creates Tone.js sequence and MIDI data", async () => {
    const doc = await parseMusicXmlString(xml);
    if (!doc) throw new Error("parse failed");
    const score = mapDocumentToScorePartwise(doc);
    const seq = toToneJsSequence(score);
    expect(seq.notes.length).toBe(1);
    expect(seq.notes[0].midi).toBe(60);
    const midi = toMidi(score);
    expect(midi.tracks.length).toBe(1);
    expect(midi.tracks[0].midi).toBe(60);
  });
});
