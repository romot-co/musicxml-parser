import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { parseMusicXmlString } from "../src/parser/xmlParser";
import { mapDocumentToScorePartwise } from "../src/parser/mappers";
import type {
  Supports,
  Relation,
  Miscellaneous,
  MiscellaneousField,
} from "../src/types";

const filePath = path.resolve(
  __dirname,
  "../reference/identification/IdentificationWithExtras.musicxml",
);

describe("Identification extras parsing", () => {
  it("maps supports, relation, and miscellaneous elements", () => {
    const xmlString = fs.readFileSync(filePath, "utf-8");
    const xmlDoc = parseMusicXmlString(xmlString);
    if (!xmlDoc) throw new Error("failed to parse xml");
    const score = mapDocumentToScorePartwise(xmlDoc);
    const id = score.identification;
    expect(id).toBeDefined();
    expect(id?.encoding?.supports?.length).toBe(2);
    const supports = id?.encoding?.supports as Supports[];
    expect(supports[0].element).toBe("accidental");
    expect(supports[0].type).toBe("yes");
    expect(supports[1].attribute).toBe("color");

    expect(id?.relations?.length).toBe(2);
    const relations = id?.relations as Relation[];
    expect(relations[0].text).toBe("Original Source");
    expect(relations[0].type).toBe("music");

    expect(id?.miscellaneous).toBeDefined();
    const misc = id?.miscellaneous as Miscellaneous;
    expect(misc.fields.length).toBe(2);
    const fieldNames = misc.fields.map((f) => f.name);
    expect(fieldNames).toContain("comment");
  });
});
