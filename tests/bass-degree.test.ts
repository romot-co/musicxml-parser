import { describe, it, expect } from "vitest";
import { JSDOM } from "jsdom";
import { mapBassElement, mapDegreeElement } from "../src/parser/mappers";

function createElement(xml: string): Element {
  const dom = new JSDOM(xml, { contentType: "application/xml" });
  const err = dom.window.document.querySelector("parsererror");
  if (err) throw new Error(`Failed to parse XML: ${err.textContent}`);
  return dom.window.document.documentElement;
}

describe("Bass and Degree element parsing", () => {
  it("parses bass with step, alter and text", () => {
    const xml = `<bass><bass-step>E</bass-step><bass-alter>-1</bass-alter><text>bass-text</text></bass>`;
    const el = createElement(xml);
    const bass = mapBassElement(el)!;
    expect(bass.step).toBe("E");
    expect(bass.alter).toBe(-1);
    expect(bass.text).toBe("bass-text");
  });

  it("parses degree with value, type, alter and attributes", () => {
    const xml = `<degree text="display" print-object="no"><degree-value>6</degree-value><degree-alter>1</degree-alter><degree-type>alter</degree-type></degree>`;
    const el = createElement(xml);
    const degree = mapDegreeElement(el)!;
    expect(degree.value).toBe(6);
    expect(degree.type).toBe("alter");
    expect(degree.alter).toBe(1);
    expect(degree.text).toBe("display");
    expect(degree.printObject).toBe("no");
  });
});
