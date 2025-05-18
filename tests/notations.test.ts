import { describe, it, expect } from "vitest";
import { mapNoteElement } from "../src/parser/mappers";
import type { Arpeggiate, NonArpeggiate } from "../src/types";
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

describe("Notations arpeggiate and non-arpeggiate", () => {
  it("parses an <arpeggiate> element", () => {
    const xml =
      '<note><pitch><step>C</step><octave>4</octave></pitch><duration>1</duration><notations><arpeggiate number="2" direction="down" unbroken="yes"/></notations></note>';
    const el = createElement(xml);
    const note = mapNoteElement(el);
    expect(note.notations?.arpeggiates).toHaveLength(1);
    const arp = note.notations?.arpeggiates?.[0] as Arpeggiate;
    expect(arp.number).toBe(2);
    expect(arp.direction).toBe("down");
    expect(arp.unbroken).toBe("yes");
  });

  it("parses a <non-arpeggiate> element", () => {
    const xml =
      '<note><pitch><step>C</step><octave>4</octave></pitch><duration>1</duration><notations><non-arpeggiate type="top" number="1"/></notations></note>';
    const el = createElement(xml);
    const note = mapNoteElement(el);
    expect(note.notations?.nonArpeggiates).toHaveLength(1);
    const na = note.notations?.nonArpeggiates?.[0] as NonArpeggiate;
    expect(na.type).toBe("top");
    expect(na.number).toBe(1);
  });
});
