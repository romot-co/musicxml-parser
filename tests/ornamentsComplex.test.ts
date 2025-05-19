import { describe, it, expect } from "vitest";
import { JSDOM } from "jsdom";
import { mapNoteElement } from "../src/parser/mappers";
import type { Glissando, Ornaments } from "../src/types";

function createElement(xmlString: string): Element {
  const dom = new JSDOM(xmlString, { contentType: "application/xml" });
  const err = dom.window.document.querySelector("parsererror");
  if (err) throw new Error("Invalid XML");
  return dom.window.document.documentElement;
}

describe("Complex ornaments parsing", () => {
  it("parses glissando with orientation and detailed ornaments", () => {
    const xml = `<note><pitch><step>A</step><octave>4</octave></pitch><duration>1</duration><notations>
      <glissando type="start" orientation="up" number="2">gliss</glissando>
      <ornaments>
        <mordent long="yes" approach="above" departure="below"/>
        <wavy-line type="start" accelerate="yes" beats="2" second-beats="1" last-beat="3" placement="below" color="red"/>
        <other-ornament smufl="ornamentX">X</other-ornament>
      </ornaments>
    </notations></note>`;
    const el = createElement(xml);
    const note = mapNoteElement(el);
    const gliss = note.notations?.glissandos?.[0] as Glissando;
    expect(gliss.type).toBe("start");
    expect(gliss.orientation).toBe("up");
    expect(gliss.number).toBe(2);
    const orn = note.notations?.ornaments?.[0] as Ornaments;
    expect(orn.mordents?.[0].long).toBe("yes");
    expect(orn.mordents?.[0].approach).toBe("above");
    expect(orn.mordents?.[0].departure).toBe("below");
    const wavy = orn.wavyLines?.[0]!;
    expect(wavy.type).toBe("start");
    expect(wavy.accelerate).toBe("yes");
    expect(wavy.beats).toBe(2);
    expect(wavy.secondBeats).toBe(1);
    expect(wavy.lastBeat).toBe(3);
    expect(wavy.placement).toBe("below");
    expect(wavy.color).toBe("red");
    expect(orn.otherOrnaments?.[0].smufl).toBe("ornamentX");
  });
});

