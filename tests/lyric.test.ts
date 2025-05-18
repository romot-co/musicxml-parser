import { describe, it, expect } from "vitest";
import { mapLyricElement } from "../src/parser/mappers";
import type { Lyric } from "../src/types";
import { JSDOM } from "jsdom";

function createElement(xmlString: string): Element {
  const dom = new JSDOM(xmlString, { contentType: "application/xml" });
  const parsererror = dom.window.document.querySelector("parsererror");
  if (parsererror) {
    throw new Error(
      `Failed to parse XML string snippet: ${parsererror.textContent}`,
    );
  }
  if (!dom.window.document.documentElement) {
    throw new Error("No document element found in XML string snippet.");
  }
  return dom.window.document.documentElement;
}

describe("Lyric mapping", () => {
  it("parses xml:lang and formatting attributes", () => {
    const xml = `<lyric xml:lang="la" justify="center"><text font-style="italic" underline="2">Deus</text></lyric>`;
    const element = createElement(xml);
    const lyric = mapLyricElement(element) as Lyric;
    expect(lyric.text).toBe("Deus");
    expect(lyric.xmlLang).toBe("la");
    expect(lyric.formatting?.justify).toBe("center");
    expect(lyric.formatting?.fontStyle).toBe("italic");
    expect(lyric.formatting?.underline).toBe(2);
  });
});
