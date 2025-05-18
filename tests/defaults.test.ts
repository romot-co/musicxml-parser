import { describe, it, expect } from "vitest";
import { mapDefaultsElement } from "../src/parser/mappers";
import type { Defaults, Scaling } from "../src/types";
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

describe("Defaults Parsing", () => {
  it("parses scaling when both values are present", () => {
    const xml = `<defaults><scaling><millimeters>7.5</millimeters><tenths>40</tenths></scaling></defaults>`;
    const element = createElement(xml);
    const defaults = mapDefaultsElement(element) as Defaults;
    expect(defaults).toBeDefined();
    expect(defaults.scaling).toBeDefined();
    const scaling = defaults.scaling as Scaling;
    expect(scaling.millimeters).toBe(7.5);
    expect(scaling.tenths).toBe(40);
  });

  it("returns undefined scaling when values are missing", () => {
    const xml = `<defaults><scaling><millimeters>7.5</millimeters></scaling></defaults>`;
    const element = createElement(xml);
    const defaults = mapDefaultsElement(element);
    expect(defaults).toBeUndefined();
  });
});
