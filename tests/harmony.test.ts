import { describe, it, expect } from "vitest";
import { JSDOM } from "jsdom";
import { mapHarmonyElement } from "../src/parser/mappers";
import type { Frame } from "../src/types";

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

describe("Harmony frame parsing", () => {
  it("parses harmony with frame information", () => {
    const xml = `
      <harmony print-frame="yes">
        <root><root-step>C</root-step></root>
        <kind>major</kind>
        <frame height="30" width="40" unplayed="x">
          <frame-strings>6</frame-strings>
          <frame-frets>4</frame-frets>
          <first-fret text="III" location="left">3</first-fret>
          <frame-note>
            <string>6</string>
            <fret>3</fret>
          </frame-note>
          <frame-note>
            <string>5</string>
            <fret>2</fret>
            <fingering>2</fingering>
            <barre type="start"/>
          </frame-note>
        </frame>
      </harmony>`;
    const element = createElement(xml);
    const harmony = mapHarmonyElement(element)!;
    expect(harmony).toBeDefined();
    expect(harmony.frame).toBeDefined();
    const frame = harmony.frame as Frame;
    expect(frame.frameStrings).toBe(6);
    expect(frame.frameFrets).toBe(4);
    expect(frame.firstFret?.value).toBe(3);
    expect(frame.firstFret?.text).toBe("III");
    expect(frame.firstFret?.location).toBe("left");
    expect(frame.frameNotes).toBeDefined();
    expect(frame.frameNotes?.length).toBe(2);
    const note2 = frame.frameNotes?.[1]!;
    expect(note2.fingering).toBe("2");
    expect(note2.barre).toBe("start");
  });
});
