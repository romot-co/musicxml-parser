import { describe, it, expect } from "vitest";
import { parseMusicXmlString } from "../src/parser/xmlParser";
import { mapDocumentToScorePartwise } from "../src/parser/mappers";

const xml = `
<score-partwise version="3.1" xmlns:xlink="http://www.w3.org/1999/xlink">
  <work>
    <work-number>1</work-number>
    <work-title>Test Piece</work-title>
    <opus xlink:href="collection.opus" xlink:type="simple" xlink:title="Album"/>
  </work>
  <part-list>
    <score-part id="P1"><part-name>Music</part-name></score-part>
  </part-list>
  <part id="P1"><measure number="1"/></part>
</score-partwise>`;

describe("Work element parsing", () => {
  it("maps opus element when present", async () => {
    const doc = await parseMusicXmlString(xml);
    expect(doc).not.toBeNull();
    if (!doc) return;
    const score = mapDocumentToScorePartwise(doc);
    expect(score.work).toBeDefined();
    expect(score.work?.opus).toBeDefined();
    expect(score.work?.opus?.href).toBe("collection.opus");
    expect(score.work?.opus?.type).toBe("simple");
    expect(score.work?.opus?.title).toBe("Album");
  });
});
