import { describe, it, expect } from "vitest";
import { parseMusicXmlString } from "../src/parser/xmlParser";
import { mapDocumentToScorePartwise } from "../src/parser/mappers";

const xmlViolin = `
<score-partwise version="3.1">
  <part-list>
    <score-part id="P1">
      <part-name>Violin</part-name>
      <score-instrument id="P1-I1">
        <instrument-name>Violin</instrument-name>
      </score-instrument>
    </score-part>
  </part-list>
  <part id="P1"><measure number="1"/></part>
</score-partwise>`;

describe("Standard instrument mapping", () => {
  it("maps by instrument-sound when provided", async () => {
    const xml = `
    <score-partwise version="3.1">
      <part-list>
        <score-part id="P1">
          <part-name>Piano</part-name>
          <score-instrument id="P1-I1">
            <instrument-name>Piano</instrument-name>
            <instrument-sound>keyboard.piano</instrument-sound>
          </score-instrument>
        </score-part>
      </part-list>
      <part id="P1"><measure number="1"/></part>
    </score-partwise>`;
    const doc = await parseMusicXmlString(xml);
    expect(doc).not.toBeNull();
    if (!doc) return;
    const score = mapDocumentToScorePartwise(doc);
    const instr = score.partList.scoreParts[0].scoreInstruments?.[0];
    expect(instr?.standardId).toBe("keyboard.piano");
  });

  it("maps by instrument name when sound missing", async () => {
    const doc = await parseMusicXmlString(xmlViolin);
    expect(doc).not.toBeNull();
    if (!doc) return;
    const score = mapDocumentToScorePartwise(doc);
    const instr = score.partList.scoreParts[0].scoreInstruments?.[0];
    expect(instr?.standardId).toBe("strings.violin");
  });
});
