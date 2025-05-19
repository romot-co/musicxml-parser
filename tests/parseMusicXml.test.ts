import { describe, it, expect } from "vitest";
import { parseMusicXml } from "../src/parser";

const xml = `<score-partwise version="3.1"><part-list><score-part id="P1"></score-part></part-list><part id="P1"></part></score-partwise>`;

describe("parseMusicXml", () => {
  it("returns ScorePartwise", async () => {
    const score = await parseMusicXml(xml);
    expect(score).toBeDefined();
    expect(score?.version).toBe("3.1");
    expect(score?.parts.length).toBe(1);
  });
});
