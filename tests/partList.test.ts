import { describe, it, expect } from "vitest";
import { parseMusicXmlString } from "../src/parser/xmlParser";
import { mapDocumentToScorePartwise } from "../src/parser/mappers";

const groupedXml = `
<score-partwise version="3.1">
  <part-list>
    <part-group number="1" type="start">
      <group-name>Winds</group-name>
      <group-symbol>bracket</group-symbol>
      <group-barline>yes</group-barline>
    </part-group>
    <score-part id="P1">
      <part-name>Flute</part-name>
    </score-part>
    <score-part id="P2">
      <part-name>Oboe</part-name>
    </score-part>
    <part-group number="1" type="stop"/>
  </part-list>
  <part id="P1"><measure number="1"/></part>
  <part id="P2"><measure number="1"/></part>
</score-partwise>`;

describe("Part-list parsing", () => {
  it("maps part-group elements", async () => {
    const doc = await parseMusicXmlString(groupedXml);
    expect(doc).not.toBeNull();
    if (!doc) return;
    const score = mapDocumentToScorePartwise(doc);
    expect(score.partList.partGroups).toBeDefined();
    expect(score.partList.partGroups?.length).toBe(2);
    const startGroup = score.partList.partGroups?.[0];
    const stopGroup = score.partList.partGroups?.[1];
    expect(startGroup?.type).toBe("start");
    expect(startGroup?.groupName).toBe("Winds");
    expect(startGroup?.groupSymbol).toBe("bracket");
    expect(stopGroup?.type).toBe("stop");
    expect(stopGroup?.number).toBe("1");
  });
});
