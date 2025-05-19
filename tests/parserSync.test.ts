import { describe, it, expect } from "vitest";
import { parseMusicXmlStringSync } from "../src/parser/xmlParser";

const xml = `<score-partwise version="3.1"></score-partwise>`;

describe("parseMusicXmlStringSync", () => {
  it("parses XML synchronously", () => {
    const doc = parseMusicXmlStringSync(xml);
    expect(doc).not.toBeNull();
    expect(doc?.documentElement.nodeName).toBe("score-partwise");
  });
});
