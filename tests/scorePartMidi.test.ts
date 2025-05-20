import { describe, it, expect } from "vitest";
import { parseMusicXmlString } from "../src/parser/xmlParser";
import { mapDocumentToScorePartwise } from "../src/parser/mappers";

const xml = `
<score-partwise version="3.1">
  <part-list>
    <score-part id="P1">
      <part-name>Piano</part-name>
      <part-abbreviation>Pno.</part-abbreviation>
      <score-instrument id="P1-I1">
        <instrument-name>Piano</instrument-name>
        <instrument-sound>keyboard.piano</instrument-sound>
      </score-instrument>
      <midi-device id="P1-I1" port="1">Device</midi-device>
      <midi-instrument id="P1-I1">
        <midi-channel>1</midi-channel>
        <midi-program>1</midi-program>
        <volume>80</volume>
        <pan>0</pan>
      </midi-instrument>
    </score-part>
  </part-list>
  <part id="P1"><measure number="1"/></part>
</score-partwise>`;

describe("Score-part MIDI parsing", () => {
  it("maps score-instrument and MIDI elements", async () => {
    const doc = await parseMusicXmlString(xml);
    expect(doc).not.toBeNull();
    if (!doc) return;
    const score = mapDocumentToScorePartwise(doc);
    const part = score.partList.scoreParts[0];
    expect(part.partName).toBe("Piano");
    expect(part.partAbbreviation).toBe("Pno.");
    expect(part.scoreInstruments?.length).toBe(1);
    const instr = part.scoreInstruments?.[0];
    expect(instr?.instrumentName).toBe("Piano");
    expect(instr?.instrumentSound).toBe("keyboard.piano");
    expect(instr?.standardId).toBe("keyboard.piano");
    expect(part.midiDevices?.[0].value).toBe("Device");
    expect(part.midiDevices?.[0].port).toBe(1);
    expect(part.midiInstruments?.[0].midiChannel).toBe(1);
    expect(part.midiInstruments?.[0].midiProgram).toBe(1);
  });
});
