import { describe, it, expect } from "vitest";
import { parseMusicXmlString } from "../src/parser/xmlParser";
import { mapDocumentToScorePartwise } from "../src/parser/mappers";
import {
  toMusicJson,
  toYaml,
  toToneJsSequence,
  toMidi,
  toMusicXML,
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
    expect(midi.tracks[0][0].midi).toBe(60);
  });

  it("creates multiple MIDI tracks for multiple parts", async () => {
    const multiXml = `
<score-partwise version="3.1">
  <part-list>
    <score-part id="P1">
      <part-name>First</part-name>
    </score-part>
    <score-part id="P2">
      <part-name>Second</part-name>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <note>
        <pitch><step>C</step><octave>4</octave></pitch>
        <duration>1</duration>
      </note>
    </measure>
  </part>
  <part id="P2">
    <measure number="1">
      <note>
        <pitch><step>E</step><octave>4</octave></pitch>
        <duration>1</duration>
      </note>
    </measure>
  </part>
</score-partwise>`;
    const doc2 = await parseMusicXmlString(multiXml);
    if (!doc2) throw new Error("parse failed");
    const score2 = mapDocumentToScorePartwise(doc2);
    const midi2 = toMidi(score2);
    expect(midi2.tracks.length).toBe(2);
    expect(midi2.tracks[0][0].midi).toBe(60);
    expect(midi2.tracks[1][0].midi).toBe(64);
  });

  it("serializes back to MusicXML", async () => {
    const doc = await parseMusicXmlString(xml);
    if (!doc) throw new Error("parse failed");
    const score = mapDocumentToScorePartwise(doc);
    const xmlString = toMusicXML(score);
    const parsed = await parseMusicXmlString(xmlString);
    expect(parsed).not.toBeNull();
    if (!parsed) return;
    const part = parsed.querySelector("part-list score-part");
    expect(part?.getAttribute("id")).toBe("P1");
    const step = parsed.querySelector(
      "part measure note pitch step",
    )?.textContent;
    expect(step).toBe("C");
  });
});
