import { describe, it, expect } from "vitest";
import { JSDOM } from "jsdom";
import { mapMeasureElement } from "../src/parser/mappers";
import type { FiguredBass, Grouping, Bookmark, Link } from "../src/types";

function createElement(xml: string): Element {
  const dom = new JSDOM(xml, { contentType: "application/xml" });
  const err = dom.window.document.querySelector("parsererror");
  if (err) throw new Error(`Failed to parse XML: ${err.textContent}`);
  return dom.window.document.documentElement;
}

describe("Measure extras parsing", () => {
  it("parses figured-bass, grouping, bookmark, and link", () => {
    const xml = `<measure number="1" xmlns:xlink="http://www.w3.org/1999/xlink">
      <figured-bass parentheses="yes">
        <figure>
          <prefix>+</prefix>
          <figure-number>6</figure-number>
          <suffix>#</suffix>
        </figure>
        <duration>2</duration>
      </figured-bass>
      <grouping type="start" number="1">
        <feature type="analysis">motif</feature>
      </grouping>
      <bookmark id="b1" name="start" element="note" position="1"/>
      <link xlink:href="http://example.com" name="ref" element="note" position="2"/>
    </measure>`;
    const el = createElement(xml);
    const measure = mapMeasureElement(el);
    expect(measure.content).toBeDefined();
    const fb = measure.content?.[0] as FiguredBass;
    expect(fb._type).toBe("figured-bass");
    expect(fb.figures[0].figureNumber).toBe("6");
    expect(fb.duration).toBe(2);
    const grouping = measure.content?.[1] as Grouping;
    expect(grouping.type).toBe("start");
    expect(grouping.features?.[0].value).toBe("motif");
    const bookmark = measure.content?.[2] as Bookmark;
    expect(bookmark.id).toBe("b1");
    const link = measure.content?.[3] as Link;
    expect(link.href).toBe("http://example.com");
  });
});
