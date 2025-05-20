import { describe, it, expect } from "vitest";
import { JSDOM } from "jsdom";
import {
  mapBackupElement,
  mapForwardElement,
  mapMeasureElement,
} from "../src/parser/mappers";
import type { Backup, Forward } from "../src/types";

function createElement(xml: string): Element {
  const dom = new JSDOM(xml, { contentType: "application/xml" });
  const err = dom.window.document.querySelector("parsererror");
  if (err) {
    throw new Error(`Failed to parse XML: ${err.textContent}`);
  }
  return dom.window.document.documentElement;
}

describe("Backup and Forward mapping", () => {
  it("maps a <backup> element", () => {
    const xml = "<backup><duration>4</duration></backup>";
    const el = createElement(xml);
    const backup = mapBackupElement(el);
    expect(backup).toBeDefined();
    expect(backup._type).toBe("backup");
    expect(backup.duration).toBe(4);
  });

  it("maps a <forward> element", () => {
    const xml =
      "<forward><duration>2</duration><voice>1</voice><staff>2</staff></forward>";
    const el = createElement(xml);
    const forward = mapForwardElement(el);
    expect(forward._type).toBe("forward");
    expect(forward.duration).toBe(2);
    expect(forward.voice).toBe("1");
    expect(forward.staff).toBe(2);
  });

  it("includes backup and forward in measure content", () => {
    const measureXml = `
      <measure number="1">
        <note><pitch><step>C</step><octave>4</octave></pitch><duration>4</duration></note>
        <backup><duration>4</duration></backup>
        <note><rest/><duration>4</duration></note>
        <forward><duration>2</duration></forward>
        <note><pitch><step>D</step><octave>4</octave></pitch><duration>2</duration></note>
      </measure>`;
    const el = createElement(measureXml);
    const measure = mapMeasureElement(el);
    expect(measure.content).toBeDefined();
    expect(measure.notes?.length).toBe(3);
    expect(measure.backups?.length).toBe(1);
    expect(measure.forwards?.length).toBe(1);
  });

  it("maintains order for multiple voices with backups and forwards", () => {
    const xml = `
      <measure number="1">
        <note><pitch><step>C</step><octave>4</octave></pitch><duration>1</duration><voice>1</voice><type>quarter</type></note>
        <note><pitch><step>D</step><octave>4</octave></pitch><duration>1</duration><voice>1</voice><type>quarter</type></note>
        <note><pitch><step>E</step><octave>4</octave></pitch><duration>1</duration><voice>1</voice><type>quarter</type></note>
        <note><pitch><step>F</step><octave>4</octave></pitch><duration>1</duration><voice>1</voice><type>quarter</type></note>
        <backup><duration>4</duration></backup>
        <note><pitch><step>E</step><octave>3</octave></pitch><duration>2</duration><voice>2</voice><type>half</type></note>
        <forward><duration>1</duration></forward>
        <note><pitch><step>G</step><octave>3</octave></pitch><duration>1</duration><voice>2</voice><type>quarter</type></note>
      </measure>`;
    const el = createElement(xml);
    const measure = mapMeasureElement(el);
    expect(measure.content).toBeDefined();
    const content = measure.content!;
    expect((content[4] as Backup)._type).toBe("backup");
    expect((content[6] as Forward)._type).toBe("forward");

    const backups = measure.backups ?? [];
    const forwards = measure.forwards ?? [];
    expect(backups.length).toBe(1);
    expect(forwards.length).toBe(1);

    const notes = measure.notes ?? [];
    const voice1 = notes.filter((n) => n.voice === "1");
    const voice2 = notes.filter((n) => n.voice === "2");
    expect(voice1).toHaveLength(4);
    expect(voice2).toHaveLength(2);
    expect(voice1.map((n) => n.pitch?.step)).toEqual(["C", "D", "E", "F"]);
    expect(voice2.map((n) => n.duration)).toEqual([2, 1]);
  });
});
