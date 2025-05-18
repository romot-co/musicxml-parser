import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { parseMusicXmlString } from "../src/parser/xmlParser";
import { mapDocumentToScorePartwise } from "../src/parser/mappers";

const filePath = path.resolve(
  __dirname,
  "../reference/xmlsamples/MultiPartGroup.musicxml",
);

describe("Multi-part score with group", () => {
  it("parses parts and part-list correctly", async () => {
    const xmlString = fs.readFileSync(filePath, "utf-8");
    const doc = await parseMusicXmlString(xmlString);
    expect(doc).not.toBeNull();
    if (!doc) return;
    const score = mapDocumentToScorePartwise(doc);

    // two parts present
    expect(score.parts.length).toBe(2);
    expect(score.parts[0].id).toBe("P1");
    expect(score.parts[1].id).toBe("P2");

    // part-list contains group and score-parts
    expect(score.partList.scoreParts.length).toBe(2);
    expect(score.partList.partGroups?.length).toBe(2);
    expect(score.partList.partGroups?.[0].type).toBe("start");
    expect(score.partList.partGroups?.[0].groupName).toBe("Strings");
    expect(score.partList.partGroups?.[1].type).toBe("stop");

    // measures read correctly
    expect(score.parts[0].measures.length).toBe(1);
    expect(score.parts[0].measures[0].number).toBe("1");
    expect(score.parts[1].measures.length).toBe(1);
    expect(score.parts[1].measures[0].number).toBe("1");
  });
});
