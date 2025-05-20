import { describe, it, expect } from "vitest";
import { parseMusicXmlString } from "../src/parser/xmlParser";
import { mapDocumentToScorePartwise } from "../src/parser/mappers";
import type { MeasureContent } from "../src/types";
import { toMusicXML } from "../src/converters";

const xml = `
<score-partwise version="3.1">
  <part-list>
    <score-part id="P1">
      <part-name>Flute</part-name>
      <part-abbreviation>Fl.</part-abbreviation>
      <score-instrument id="P1-I1">
        <instrument-name>Flute</instrument-name>
      </score-instrument>
      <midi-instrument id="P1-I1">
        <midi-channel>1</midi-channel>
        <midi-program>74</midi-program>
      </midi-instrument>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key><fifths>0</fifths></key>
        <time><beats>4</beats><beat-type>4</beat-type></time>
        <clef><sign>G</sign><line>2</line></clef>
      </attributes>
      <direction placement="above">
        <direction-type><words>Allegro</words></direction-type>
      </direction>
      <note>
        <pitch><step>C</step><octave>4</octave></pitch>
        <duration>1</duration>
        <type>quarter</type>
      </note>
      <barline location="right"><bar-style>light-heavy</bar-style><repeat direction="backward"/></barline>
    </measure>
  </part>
</score-partwise>`;

describe("toMusicXML serialization", () => {
  it("preserves basic elements when serializing and parsing back", async () => {
    const doc = await parseMusicXmlString(xml);
    if (!doc) throw new Error("parse failed");
    const score1 = mapDocumentToScorePartwise(doc);
    const xmlOut = toMusicXML(score1);
    const doc2 = await parseMusicXmlString(xmlOut);
    if (!doc2) throw new Error("reparse failed");
    const score2 = mapDocumentToScorePartwise(doc2);

    const part = score2.partList.scoreParts[0];
    expect(part.partAbbreviation).toBe("Fl.");
    expect(part.scoreInstruments?.[0].instrumentName).toBe("Flute");
    expect(part.midiInstruments?.[0].midiProgram).toBe(74);

    const measure = score2.parts[0].measures[0];
    const attrs = measure.content?.find(
      (c: MeasureContent) => (c as any)._type === "attributes",
    ) as any;
    expect(attrs.divisions).toBe(1);
    const dir = measure.content?.find(
      (c: MeasureContent) => (c as any)._type === "direction",
    ) as any;
    expect(dir.direction_type[0].words.text).toBe("Allegro");
    const bar = measure.content?.find(
      (c: MeasureContent) => (c as any)._type === "barline",
    ) as any;
    expect(bar.repeat.direction).toBe("backward");
  });
});
