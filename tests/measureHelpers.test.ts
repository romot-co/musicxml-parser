import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { parseMusicXmlString } from "../src/parser/xmlParser";
import { mapDocumentToScorePartwise } from "../src/parser/mappers";
import { getAllNotes, getAllMeasures } from "../src/utils/measureHelpers";

const filePath = path.resolve(
  __dirname,
  "../reference/xmlsamples/MultiPartGroup.musicxml",
);

describe("measure helper utilities", () => {
  it("aggregates notes across parts", async () => {
    const xml = fs.readFileSync(filePath, "utf-8");
    const doc = await parseMusicXmlString(xml);
    expect(doc).not.toBeNull();
    if (!doc) return;
    const score = mapDocumentToScorePartwise(doc);

    expect(score.parts.length).toBe(2);

    const measuresP1 = getAllMeasures(score.parts[0]);
    const measuresP2 = getAllMeasures(score.parts[1]);
    expect(measuresP1.length).toBe(1);
    expect(measuresP2.length).toBe(1);

    const notes = getAllNotes(score);
    expect(notes.length).toBe(2);
    expect(notes[0].pitch?.step).toBe("C");
    expect(notes[1].pitch?.step).toBe("E");
  });
});
