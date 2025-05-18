import { describe, it, expect } from "vitest";
import { mapDefaultsElement } from "../src/parser/mappers";
import type {
  Defaults,
  Scaling,
  PageLayout,
  SystemLayout,
  Appearance,
} from "../src/types";
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

  it("parses page-layout with margins", () => {
    const xml = `
      <defaults>
        <page-layout>
          <page-height>1000</page-height>
          <page-width>800</page-width>
          <page-margins type="both">
            <left-margin>50</left-margin>
            <right-margin>60</right-margin>
            <top-margin>70</top-margin>
            <bottom-margin>80</bottom-margin>
          </page-margins>
        </page-layout>
      </defaults>`;
    const element = createElement(xml);
    const defaults = mapDefaultsElement(element)!;
    const layout = defaults.pageLayout as PageLayout;
    expect(layout.pageHeight).toBe(1000);
    expect(layout.pageWidth).toBe(800);
    expect(layout.pageMargins?.[0]?.type).toBe("both");
    expect(layout.pageMargins?.[0]?.leftMargin).toBe(50);
    expect(layout.pageMargins?.[0]?.rightMargin).toBe(60);
  });

  it("parses system-layout with dividers", () => {
    const xml = `
      <defaults>
        <system-layout>
          <system-margins>
            <left-margin>30</left-margin>
            <right-margin>40</right-margin>
          </system-margins>
          <system-distance>120</system-distance>
          <top-system-distance>150</top-system-distance>
          <system-dividers>
            <left-divider/>
            <right-divider/>
          </system-dividers>
        </system-layout>
      </defaults>`;
    const element = createElement(xml);
    const defaults = mapDefaultsElement(element)!;
    const sys = defaults.systemLayout as SystemLayout;
    expect(sys.systemMargins?.leftMargin).toBe(30);
    expect(sys.systemMargins?.rightMargin).toBe(40);
    expect(sys.systemDistance).toBe(120);
    expect(sys.topSystemDistance).toBe(150);
    expect(sys.systemDividers?.leftDivider).toBe(true);
    expect(sys.systemDividers?.rightDivider).toBe(true);
  });

  it("parses appearance details", () => {
    const xml = `
      <defaults>
        <appearance>
          <line-width type="beam">1.2</line-width>
          <note-size type="cue">70</note-size>
          <distance type="hyphen">20</distance>
          <glyph type="quarter-rest">restQuarter</glyph>
          <other-appearance type="custom">foo</other-appearance>
        </appearance>
      </defaults>`;
    const element = createElement(xml);
    const defaults = mapDefaultsElement(element)!;
    const app = defaults.appearance as Appearance;
    expect(app.lineWidths?.[0].type).toBe("beam");
    expect(app.lineWidths?.[0].value).toBeCloseTo(1.2);
    expect(app.noteSizes?.[0].type).toBe("cue");
    expect(app.noteSizes?.[0].value).toBe(70);
    expect(app.distances?.[0].type).toBe("hyphen");
    expect(app.distances?.[0].value).toBe(20);
    expect(app.glyphs?.[0].type).toBe("quarter-rest");
    expect(app.glyphs?.[0].value).toBe("restQuarter");
    expect(app.otherAppearances?.[0].type).toBe("custom");
    expect(app.otherAppearances?.[0].value).toBe("foo");
  });
});
