import { describe, it, expect } from "vitest";
import { parseMusicXmlString } from "../src/parser/xmlParser";
import {
  mapDocumentToScorePartwise,
  mapDocumentToScoreTimewise,
} from "../src/parser/mappers";

const partwiseXml = `
<score-partwise version="3.1">
  <movement-number>1</movement-number>
  <part-list>
    <score-part id="P1" />
  </part-list>
  <part id="P1"><measure number="1"/></part>
</score-partwise>`;

const timewiseXml = `
<score-timewise version="3.1">
  <movement-number>2</movement-number>
  <part-list>
    <score-part id="P1" />
  </part-list>
  <measure number="1">
    <part id="P1" />
  </measure>
</score-timewise>`;

describe("movement-number parsing", () => {
  it("maps movement-number in score-partwise", async () => {
    const doc = await parseMusicXmlString(partwiseXml);
    expect(doc).not.toBeNull();
    if (!doc) return;
    const score = mapDocumentToScorePartwise(doc);
    expect(score.movementNumber).toBe("1");
  });

  it("maps movement-number in score-timewise", async () => {
    const doc = await parseMusicXmlString(timewiseXml);
    expect(doc).not.toBeNull();
    if (!doc) return;
    const score = mapDocumentToScoreTimewise(doc);
    expect(score.movementNumber).toBe("2");
  });
});
