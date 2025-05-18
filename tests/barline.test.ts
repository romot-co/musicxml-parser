import { describe, it, expect } from "vitest";
import { mapBarlineElement } from "../src/parser/mappers";
import type { Barline, Repeat, Ending, Fermata } from "../src/types";
import type { WavyLine, Footnote, Level } from "../src/types";
import { JSDOM } from "jsdom";

// Helper to create an Element from an XML string snippet
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

describe("Barline Schema Tests", () => {
  describe("mapBarlineElement", () => {
    it("should parse a basic <barline> element with <bar-style>", () => {
      const xml = `<barline location="right"><bar-style color="#000000">light-heavy</bar-style></barline>`;
      const element = createElement(xml);
      const barline = mapBarlineElement(element);
      expect(barline).toBeDefined();
      expect(barline._type).toBe("barline");
      expect(barline.location).toBe("right");
      expect(barline.barStyle).toBe("light-heavy");
      expect(barline.barStyleColor).toBe("#000000");
    });

    it('should parse <barline> with <repeat direction="forward">', () => {
      const xml = `<barline><repeat direction="forward"/></barline>`;
      const element = createElement(xml);
      const barline = mapBarlineElement(element);
      expect(barline.repeat).toBeDefined();
      const repeat = barline.repeat as Repeat;
      expect(repeat.direction).toBe("forward");
    });

    it('should parse <barline> with <repeat direction="backward" times="2">', () => {
      const xml = `<barline><repeat direction="backward" times="2"/></barline>`;
      const element = createElement(xml);
      const barline = mapBarlineElement(element);
      expect(barline.repeat).toBeDefined();
      const repeat = barline.repeat as Repeat;
      expect(repeat.direction).toBe("backward");
      expect(repeat.times).toBe(2);
    });

    it("should parse repeat attributes winged and after-jump", () => {
      const xml = `<barline><repeat direction="backward" winged="curved" after-jump="yes"/></barline>`;
      const element = createElement(xml);
      const barline = mapBarlineElement(element);
      const repeat = barline.repeat as Repeat;
      expect(repeat.winged).toBe("curved");
      expect(repeat.afterJump).toBe("yes");
    });

    it('should parse <barline> with <ending type="start" number="1">', () => {
      const xml = `<barline><ending type="start" number="1">1.</ending></barline>`;
      const element = createElement(xml);
      const barline = mapBarlineElement(element);
      expect(barline.ending).toBeDefined();
      const ending = barline.ending as Ending;
      expect(ending.type).toBe("start");
      expect(ending.number).toBe("1");
      expect(ending.text).toBe("1.");
    });

    it('should parse <barline> with <ending type="stop" number="1" print-object="no">', () => {
      const xml = `<barline><ending type="stop" number="1" print-object="no"/></barline>`;
      const element = createElement(xml);
      const barline = mapBarlineElement(element);
      expect(barline.ending).toBeDefined();
      const ending = barline.ending as Ending;
      expect(ending.type).toBe("stop");
      expect(ending.number).toBe("1");
      expect(ending["print-object"]).toBe("no");
    });

    it('should parse <barline> with location="middle"', () => {
      const xml = `<barline location="middle"><bar-style>dotted</bar-style></barline>`;
      const element = createElement(xml);
      const barline = mapBarlineElement(element);
      expect(barline.location).toBe("middle");
      expect(barline.barStyle).toBe("dotted");
    });

    it("should parse coda and segno child elements", () => {
      const xml = `<barline><coda/><segno/></barline>`;
      const element = createElement(xml);
      const barline = mapBarlineElement(element);
      expect(barline.coda).toBeDefined();
      expect(barline.segno).toBeDefined();
    });

    it("should parse fermata elements", () => {
      const xml = `<barline><fermata type="upright">angled</fermata><fermata type="inverted"/></barline>`;
      const element = createElement(xml);
      const barline = mapBarlineElement(element);
      expect(barline.fermata).toBeDefined();
      const fermatas = barline.fermata as Fermata[];
      expect(fermatas.length).toBe(2);
      expect(fermatas[0].value).toBe("angled");
      expect(fermatas[0].type).toBe("upright");
      expect(fermatas[1].type).toBe("inverted");
    });

    it("should parse a wavy-line element", () => {
      const xml = `<barline><wavy-line type="continue" number="2"/></barline>`;
      const element = createElement(xml);
      const barline = mapBarlineElement(element);
      expect(barline.wavyLine).toBeDefined();
      const wavy = barline.wavyLine as WavyLine;
      expect(wavy.type).toBe("continue");
      expect(wavy.number).toBe(2);
    });

    it("should parse footnote and level elements", () => {
      const xml = `<barline><footnote>ref</footnote><level reference="yes" parentheses="yes">ed</level></barline>`;
      const element = createElement(xml);
      const barline = mapBarlineElement(element);
      expect(barline.footnote).toBeDefined();
      expect((barline.footnote as Footnote).value).toBe("ref");
      expect(barline.level).toBeDefined();
      const level = barline.level as Level;
      expect(level.reference).toBe("yes");
      expect(level.parentheses).toBe("yes");
      expect(level.value).toBe("ed");
    });

    it("should parse barline attributes segno, coda and divisions", () => {
      const xml = `<barline segno="S1" coda="C1" divisions="480" id="b1"/>`;
      const element = createElement(xml);
      const barline = mapBarlineElement(element);
      expect(barline.segnoAttr).toBe("S1");
      expect(barline.codaAttr).toBe("C1");
      expect(barline.divisions).toBe(480);
      expect(barline.id).toBe("b1");
    });

    it("should parse ending attributes like end-length and system", () => {
      const xml = `<barline><ending type="start" number="1" end-length="5" text-x="2" text-y="3" system="only-top" default-x="1" default-y="2" relative-x="-1" relative-y="-2" font-family="Arial" font-style="italic" font-size="12" font-weight="bold" color="#111111">1.</ending></barline>`;
      const element = createElement(xml);
      const barline = mapBarlineElement(element);
      expect(barline.ending).toBeDefined();
      const ending = barline.ending as Ending;
      expect(ending.endLength).toBe(5);
      expect(ending.textX).toBe(2);
      expect(ending.textY).toBe(3);
      expect(ending.system).toBe("only-top");
      expect(ending.defaultX).toBe(1);
      expect(ending.defaultY).toBe(2);
      expect(ending.relativeX).toBe(-1);
      expect(ending.relativeY).toBe(-2);
      expect(ending.fontFamily).toBe("Arial");
      expect(ending.fontStyle).toBe("italic");
      expect(ending.fontSize).toBe("12");
      expect(ending.fontWeight).toBe("bold");
      expect(ending.color).toBe("#111111");
    });
  });
});
