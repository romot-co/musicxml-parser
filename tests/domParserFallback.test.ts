import { describe, it, expect } from "vitest";
import { parseMusicXmlString } from "../src/parser/xmlParser";

const simpleXml = `<score-partwise version="3.1"></score-partwise>`;

describe("DOMParser fallback", () => {
  it("uses jsdom when DOMParser is undefined", async () => {
    const original = (globalThis as any).DOMParser;
    // simulate environment without DOMParser

    delete (globalThis as any).DOMParser;

    const doc = await parseMusicXmlString(simpleXml);
    expect(doc).not.toBeNull();
    expect(doc?.documentElement.nodeName).toBe("score-partwise");

    // restore
    if (original) {
      (globalThis as any).DOMParser = original;
    }
  });
});
