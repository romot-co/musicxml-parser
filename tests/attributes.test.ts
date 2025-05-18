import { describe, it, expect } from "vitest";
import { mapAttributesElement } from "../src/parser/mappers";
import type {
  Attributes,
  Key,
  Time,
  Clef,
  PartSymbol,
  MeasureStyle,
  MultipleRest,
  MeasureRepeat,
  BeatRepeat,
  Slash,
} from "../src/types";
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

describe("Attributes Schema Tests", () => {
  describe("mapAttributesElement", () => {
    it("should parse a basic <attributes> element with <key>", () => {
      const xml = `<attributes><key><fifths>2</fifths><mode>major</mode></key></attributes>`;
      const element = createElement(xml);
      const attributes = mapAttributesElement(element);
      expect(attributes).toBeDefined();
      expect(attributes._type).toBe("attributes");
      expect(attributes.key).toBeDefined();
      expect(attributes.key).toHaveLength(1);
      const key = attributes.key?.[0] as Key;
      expect(key.fifths).toBe(2);
      expect(key.mode).toBe("major");
    });

    it("should parse <attributes> with <time> (beats and beat-type)", () => {
      const xml = `<attributes><time><beats>3</beats><beat-type>4</beat-type></time></attributes>`;
      const element = createElement(xml);
      const attributes = mapAttributesElement(element);
      expect(attributes.time).toBeDefined();
      expect(attributes.time).toHaveLength(1);
      const time = attributes.time?.[0] as Time;
      expect(time.beats).toBe("3");
      expect(time["beat-type"]).toBe("4");
      expect(time.senzaMisura).toBeUndefined();
    });

    it("should parse <attributes> with <time> (senza-misura)", () => {
      const xml = `<attributes><time><senza-misura/></time></attributes>`;
      const element = createElement(xml);
      const attributes = mapAttributesElement(element);
      expect(attributes.time).toBeDefined();
      expect(attributes.time).toHaveLength(1);
      const time = attributes.time?.[0] as Time;
      expect(time.senzaMisura).toBe(true);
      expect(time.beats).toBeUndefined();
      expect(time["beat-type"]).toBeUndefined();
    });

    it("should parse <attributes> with <clef>", () => {
      const xml = `<attributes><clef number="1"><sign>G</sign><line>2</line></clef></attributes>`;
      const element = createElement(xml);
      const attributes = mapAttributesElement(element);
      expect(attributes.clef).toBeDefined();
      expect(attributes.clef).toHaveLength(1);
      const clef = attributes.clef?.[0] as Clef;
      expect(clef.sign).toBe("G");
      expect(clef.line).toBe(2);
      expect(clef.number).toBe(1);
    });

    it("should parse <attributes> with <divisions>", () => {
      const xml = `<attributes><divisions>8</divisions></attributes>`;
      const element = createElement(xml);
      const attributes = mapAttributesElement(element);
      expect(attributes.divisions).toBe(8);
    });

    it("should parse <attributes> with <staves>", () => {
      const xml = `<attributes><staves>2</staves></attributes>`;
      const element = createElement(xml);
      const attributes = mapAttributesElement(element);
      expect(attributes.staves).toBe(2);
    });

    it("should parse <attributes> with <part-symbol>", () => {
      const xml = `<attributes><part-symbol group-symbol="brace" top-staff="1" bottom-staff="2" default-x="12.5" default-y="-3" color="#00f">bracket</part-symbol></attributes>`;
      const element = createElement(xml);
      const attributes = mapAttributesElement(element);
      expect(attributes.partSymbol).toBeDefined();
      const ps = attributes.partSymbol as PartSymbol;
      expect(ps.value).toBe("bracket");
      expect(ps.groupSymbol).toBe("brace");
      expect(ps.topStaff).toBe(1);
      expect(ps.bottomStaff).toBe(2);
      expect(ps.defaultX).toBeCloseTo(12.5);
      expect(ps.defaultY).toBeCloseTo(-3);
      expect(ps.color).toBe("#00f");
    });

    it("should ignore invalid group-symbol in <part-symbol>", () => {
      const xml = `<attributes><part-symbol group-symbol="invalid" top-staff="3">square</part-symbol></attributes>`;
      const element = createElement(xml);
      const attributes = mapAttributesElement(element);
      expect(attributes.partSymbol).toBeDefined();
      const ps = attributes.partSymbol as PartSymbol;
      expect(ps.value).toBe("square");
      expect(ps.groupSymbol).toBeUndefined();
      expect(ps.topStaff).toBe(3);
    });

    it("should parse <instruments> count", () => {
      const xml = `<attributes><instruments>5</instruments></attributes>`;
      const element = createElement(xml);
      const attributes = mapAttributesElement(element);
      expect(attributes.instruments).toBe(5);
    });

    it("should parse <transpose> with details", () => {
      const xml = `<attributes><transpose number="1"><diatonic>-2</diatonic><chromatic>-3</chromatic><octave-change>1</octave-change><double above="yes"/></transpose></attributes>`;
      const element = createElement(xml);
      const attributes = mapAttributesElement(element);
      expect(attributes.transpose).toBeDefined();
      expect(attributes.transpose?.length).toBe(1);
      const tr = attributes.transpose?.[0]!;
      expect(tr.number).toBe(1);
      expect(tr.diatonic).toBe(-2);
      expect(tr.chromatic).toBe(-3);
      expect(tr.octaveChange).toBe(1);
      expect(tr.double?.above).toBe("yes");
    });

    it("should parse <staff-details> with <line-detail>", () => {
      const xml = `<attributes><staff-details><staff-lines>5</staff-lines><line-detail line="1" width="0.5" color="#ff0" line-type="dashed" print-object="no"/></staff-details></attributes>`;
      const element = createElement(xml);
      const attributes = mapAttributesElement(element);
      expect(attributes.staffDetails).toBeDefined();
      expect(attributes.staffDetails).toHaveLength(1);
      const sd = attributes.staffDetails?.[0]!;
      expect(sd.lineDetail).toBeDefined();
      expect(sd.lineDetail).toHaveLength(1);
      const ld = sd.lineDetail?.[0]!;
      expect(ld.line).toBe(1);
      expect(ld.width).toBeCloseTo(0.5);
      expect(ld.color).toBe("#ff0");
      expect(ld.lineType).toBe("dashed");
      expect(ld.printObject).toBe("no");
    });

    it("should parse <staff-details> with <staff-tuning>", () => {
      const xml = `<attributes><staff-details><staff-tuning line="1"><tuning-step>E</tuning-step><tuning-octave>4</tuning-octave></staff-tuning></staff-details></attributes>`;
      const element = createElement(xml);
      const attributes = mapAttributesElement(element);
      expect(attributes.staffDetails).toBeDefined();
      expect(attributes.staffDetails).toHaveLength(1);
      const sd = attributes.staffDetails?.[0]!;
      expect(sd.staffTuning).toBeDefined();
      expect(sd.staffTuning).toHaveLength(1);
      const tuning = sd.staffTuning?.[0]!;
      expect(tuning.line).toBe(1);
      expect(tuning.tuningStep).toBe("E");
      expect(tuning.tuningOctave).toBe(4);
    });

    it("should parse <measure-style> with <multiple-rest>", () => {
      const xml = `<attributes><measure-style><multiple-rest use-symbols="yes">4</multiple-rest></measure-style></attributes>`;
      const element = createElement(xml);
      const attributes = mapAttributesElement(element);
      expect(attributes.measureStyle).toBeDefined();
      expect(attributes.measureStyle).toHaveLength(1);
      const style = attributes.measureStyle?.[0] as MeasureStyle;
      expect(style.multipleRest).toBeDefined();
      const mr = style.multipleRest as MultipleRest;
      expect(mr.value).toBe(4);
      expect(mr.useSymbols).toBe("yes");
    });

    it("should parse <measure-style> with <measure-repeat>", () => {
      const xml = `<attributes><measure-style><measure-repeat type="start" slashes="2">3</measure-repeat></measure-style></attributes>`;
      const element = createElement(xml);
      const attributes = mapAttributesElement(element);
      expect(attributes.measureStyle).toBeDefined();
      expect(attributes.measureStyle).toHaveLength(1);
      const style = attributes.measureStyle?.[0] as MeasureStyle;
      expect(style.measureRepeat).toBeDefined();
      const rep = style.measureRepeat as MeasureRepeat;
      expect(rep.value).toBe(3);
      expect(rep.type).toBe("start");
      expect(rep.slashes).toBe(2);
    });

    it("should parse <measure-style> with <beat-repeat>", () => {
      const xml = `<attributes><measure-style><beat-repeat type="stop" slashes="1" use-dots="no"><slash-type>quarter</slash-type></beat-repeat></measure-style></attributes>`;
      const element = createElement(xml);
      const attributes = mapAttributesElement(element);
      expect(attributes.measureStyle).toBeDefined();
      expect(attributes.measureStyle).toHaveLength(1);
      const style = attributes.measureStyle?.[0] as MeasureStyle;
      expect(style.beatRepeat).toBeDefined();
      const br = style.beatRepeat as BeatRepeat;
      expect(br.type).toBe("stop");
      expect(br.slashes).toBe(1);
      expect(br.useDots).toBe("no");
      expect(br.slashType).toBe("quarter");
    });

    it("should parse <measure-style> with <slash>", () => {
      const xml = `<attributes><measure-style><slash type="start" use-dots="yes" use-stems="no"><slash-type>eighth</slash-type></slash></measure-style></attributes>`;
      const element = createElement(xml);
      const attributes = mapAttributesElement(element);
      expect(attributes.measureStyle).toBeDefined();
      expect(attributes.measureStyle).toHaveLength(1);
      const style = attributes.measureStyle?.[0] as MeasureStyle;
      expect(style.slash).toBeDefined();
      const sl = style.slash as Slash;
      expect(sl.type).toBe("start");
      expect(sl.useDots).toBe("yes");
      expect(sl.useStems).toBe("no");
      expect(sl.slashType).toBe("eighth");
    });

    it("should parse beat-repeat with slash-dot elements", () => {
      const xml = `<attributes><measure-style><beat-repeat type="start"><slash-type>quarter</slash-type><slash-dot/><slash-dot/></beat-repeat></measure-style></attributes>`;
      const element = createElement(xml);
      const attributes = mapAttributesElement(element);
      const br = (attributes.measureStyle?.[0] as MeasureStyle)
        .beatRepeat as BeatRepeat;
      expect(br.slashType).toBe("quarter");
      expect(br.slashDot).toBeDefined();
      expect(br.slashDot?.length).toBe(2);
    });

    it("should parse slash style with slash-dot elements", () => {
      const xml = `<attributes><measure-style><slash type="stop"><slash-type>eighth</slash-type><slash-dot/></slash></measure-style></attributes>`;
      const element = createElement(xml);
      const attributes = mapAttributesElement(element);
      const sl = (attributes.measureStyle?.[0] as MeasureStyle).slash as Slash;
      expect(sl.slashType).toBe("eighth");
      expect(sl.slashDot).toBeDefined();
      expect(sl.slashDot?.length).toBe(1);
    });

    it("should ignore invalid <measure-style> with no style child", () => {
      const xml = `<attributes><measure-style number="1"></measure-style></attributes>`;
      const element = createElement(xml);
      const attributes = mapAttributesElement(element);
      expect(attributes.measureStyle).toBeDefined();
      expect(attributes.measureStyle).toHaveLength(0);
    });
  });
});
