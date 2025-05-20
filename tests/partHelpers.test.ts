import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { parseMusicXmlString } from "../src/parser/xmlParser";
import { mapDocumentToScorePartwise } from "../src/parser/mappers";
import { getPart } from "../src/utils/partHelpers";

const filePath = path.resolve(
  __dirname,
  "../reference/xmlsamples/MultiPartGroup.musicxml",
);

describe("getPart helper", () => {
  it("returns part and metadata for a given id", async () => {
    const xmlString = fs.readFileSync(filePath, "utf-8");
    const doc = await parseMusicXmlString(xmlString);
    expect(doc).not.toBeNull();
    if (!doc) return;
    const score = mapDocumentToScorePartwise(doc);

    const result = getPart(score, "P2");
    expect(result).toBeDefined();
    if (!result) return;
    expect(result.part.id).toBe("P2");
    expect(result.scorePart.partName).toBe("Cello");
    expect(result.part.measures.length).toBe(1);
  });

  it("returns undefined for unknown id", async () => {
    const xmlString = fs.readFileSync(filePath, "utf-8");
    const doc = await parseMusicXmlString(xmlString);
    if (!doc) return;
    const score = mapDocumentToScorePartwise(doc);

    const result = getPart(score, "PX");
    expect(result).toBeUndefined();
  });
});
