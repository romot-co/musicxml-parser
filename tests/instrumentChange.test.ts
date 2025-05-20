import { describe, it, expect } from "vitest";
import { JSDOM } from "jsdom";
import { mapSoundElement } from "../src/parser/mappers";

function createElement(xmlString: string): Element {
  const dom = new JSDOM(xmlString, { contentType: "application/xml" });
  const err = dom.window.document.querySelector("parsererror");
  if (err) throw new Error("Invalid XML");
  return dom.window.document.documentElement;
}

describe("Instrument-change parsing", () => {
  it("parses instrument-change within sound", () => {
    const xml = `<sound><instrument-change id="P1-I1"><instrument-sound>piano</instrument-sound><solo/></instrument-change></sound>`;
    const el = createElement(xml);
    const sound = mapSoundElement(el);
    expect(sound.instrumentChanges?.length).toBe(1);
    const change = sound.instrumentChanges?.[0];
    expect(change?.id).toBe("P1-I1");
    expect(change?.instrumentSound).toBe("piano");
    expect(change?.solo).toBe(true);
  });
});
