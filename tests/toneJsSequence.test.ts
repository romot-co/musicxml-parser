import { describe, it, expect } from "vitest";
import { parseMusicXmlString } from "../src/parser/xmlParser";
import { mapDocumentToScorePartwise } from "../src/parser/mappers";
import { toToneJsSequence } from "../src/converters";

const multiPartXml = `
<score-partwise version="3.1">
  <part-list>
    <score-part id="P1"><part-name>One</part-name></score-part>
    <score-part id="P2"><part-name>Two</part-name></score-part>
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
  <part id="P2">
    <measure number="1">
      <note>
        <pitch><step>E</step><octave>4</octave></pitch>
        <duration>1</duration>
        <type>quarter</type>
      </note>
    </measure>
  </part>
</score-partwise>`;

const multiVoiceXml = `
<score-partwise version="3.1">
  <part-list>
    <score-part id="P1"><part-name>Music</part-name></score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <note>
        <pitch><step>C</step><octave>4</octave></pitch>
        <duration>4</duration>
        <voice>1</voice>
        <type>whole</type>
      </note>
      <backup><duration>4</duration></backup>
      <note>
        <pitch><step>E</step><octave>4</octave></pitch>
        <duration>4</duration>
        <voice>2</voice>
        <type>whole</type>
      </note>
    </measure>
  </part>
</score-partwise>`;

describe("toToneJsSequence multi-track timing", () => {
  it("places notes from different parts at the same time", async () => {
    const doc = await parseMusicXmlString(multiPartXml);
    if (!doc) throw new Error("parse failed");
    const score = mapDocumentToScorePartwise(doc);
    const seq = toToneJsSequence(score);
    expect(seq.notes).toHaveLength(2);
    const times = seq.notes.map((n) => n.time);
    expect(times).toEqual([0, 0]);
    const parts = seq.notes.map((n) => n.partId);
    expect(parts).toEqual(["P1", "P2"]);
  });

  it("handles voices with backups", async () => {
    const doc = await parseMusicXmlString(multiVoiceXml);
    if (!doc) throw new Error("parse failed");
    const score = mapDocumentToScorePartwise(doc);
    const seq = toToneJsSequence(score);
    expect(seq.notes).toHaveLength(2);
    const times = seq.notes.map((n) => n.time);
    expect(times).toEqual([0, 0]);
    const voices = seq.notes.map((n) => n.voice);
    expect(voices).toEqual(["1", "2"]);
  });
});
