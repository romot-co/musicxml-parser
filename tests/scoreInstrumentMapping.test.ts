import { describe, it, expect } from "vitest";
import { parseMusicXmlString } from "../src/parser/xmlParser";
import { mapDocumentToScorePartwise } from "../src/parser/mappers";
import path from "path";
import { loadSoundsXml } from "../src/utils/loadSoundsXml";

const soundsPath = path.join(__dirname, "sounds-sample.xml");

const xmlName = `
<score-partwise version="3.1">
  <part-list>
    <score-part id="P1">
      <part-name>Piano</part-name>
      <score-instrument id="P1-I1">
        <instrument-name>Piano</instrument-name>
      </score-instrument>
    </score-part>
  </part-list>
  <part id="P1"><measure number="1"/></part>
</score-partwise>`;

const xmlSound = `
<score-partwise version="3.1">
  <part-list>
    <score-part id="P1">
      <part-name>Trumpet</part-name>
      <score-instrument id="P1-I1">
        <instrument-sound>brass.trumpet</instrument-sound>
      </score-instrument>
    </score-part>
  </part-list>
  <part id="P1"><measure number="1"/></part>
</score-partwise>`;

describe("score-instrument mapping", () => {
  it("maps standard id from instrument name", async () => {
    await loadSoundsXml(soundsPath);
    const doc = await parseMusicXmlString(xmlName);
    const score = mapDocumentToScorePartwise(doc!);
    const instr = score.partList.scoreParts[0].scoreInstruments?.[0];
    expect(instr?.standardInstrumentId).toBe("keyboard.piano");
  });

  it("maps standard id from instrument sound", async () => {
    await loadSoundsXml(soundsPath);
    const doc = await parseMusicXmlString(xmlSound);
    const score = mapDocumentToScorePartwise(doc!);
    const instr = score.partList.scoreParts[0].scoreInstruments?.[0];
    expect(instr?.standardInstrumentId).toBe("brass.trumpet");
  });
});
