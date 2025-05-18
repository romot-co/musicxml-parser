import { describe, it, expect } from "vitest";
import { JSDOM } from "jsdom";
import {
  mapBackupElement,
  mapForwardElement,
  mapMeasureElement,
} from "../src/parser/mappers";
import type { Backup, Forward, Note } from "../src/types";
import { NoteSchema } from "../src/schemas";

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
    const notes = measure.content?.filter(
      (c): c is Note =>
        (c as any)._type === "note" && NoteSchema.safeParse(c).success,
    );
    const backups = measure.content?.filter(
      (c): c is Backup => (c as any)._type === "backup",
    );
    const forwards = measure.content?.filter(
      (c): c is Forward => (c as any)._type === "forward",
    );
    expect(notes?.length).toBe(3);
    expect(backups?.length).toBe(1);
    expect(forwards?.length).toBe(1);
  });
});
