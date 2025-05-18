import { describe, it, expect } from "vitest";
import { JSDOM } from "jsdom";
import { mapDirectionElement } from "../src/parser/mappers";
import type { DirectionType } from "../src/types";

function createElement(xmlString: string): Element {
  const dom = new JSDOM(xmlString, { contentType: "application/xml" });
  const err = dom.window.document.querySelector("parsererror");
  if (err) throw new Error("Invalid XML");
  return dom.window.document.documentElement;
}

describe("Direction parsing", () => {
  it("parses words with color attribute", () => {
    const xml = `<direction><direction-type><words font-family="Times" color="#ff0000">Allegro</words></direction-type></direction>`;
    const el = createElement(xml);
    const direction = mapDirectionElement(el);
    expect(direction.direction_type[0].words?.text).toBe("Allegro");
    expect(direction.direction_type[0].words?.formatting?.fontFamily).toBe(
      "Times",
    );
    expect(direction.direction_type[0].words?.formatting?.color).toBe(
      "#ff0000",
    );
  });

  it("parses metronome per-minute formatting", () => {
    const xml = `<direction><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute font-size="12" color="blue">120</per-minute></metronome></direction-type></direction>`;
    const el = createElement(xml);
    const direction = mapDirectionElement(el);
    const met = direction.direction_type[0].metronome;
    expect(met?.["per-minute"]?.["per-minute"]).toBe("120");
    expect(met?.["per-minute"]?.formatting?.fontSize).toBe("12");
    expect(met?.["per-minute"]?.formatting?.color).toBe("blue");
  });

  it("parses dynamics and other direction-type elements", () => {
    const xml = `<direction><direction-type><dynamics color="red"><f/></dynamics><pedal type="start"/><wedge type="crescendo" spread="15"/><segno/><coda/></direction-type></direction>`;
    const el = createElement(xml);
    const direction = mapDirectionElement(el);
    const dt: DirectionType = direction.direction_type[0];
    expect(dt.dynamics?.value).toBe("f");
    expect(dt.dynamics?.formatting?.color).toBe("red");
    expect(dt.pedal?.type).toBe("start");
    expect(dt.wedge?.type).toBe("crescendo");
    expect(dt.wedge?.spread).toBe(15);
    expect(dt.segno).toBeDefined();
    expect(dt.coda).toBeDefined();
  });

  it("parses wedge with all attributes", () => {
    const xml = `<direction><direction-type><wedge type="crescendo" number="3" spread="12.5" niente="yes" line-type="dashed" dash-length="1.2" space-length="2.3" default-x="4.5" default-y="-3" relative-x="1" relative-y="-2" color="red" id="w1"/></direction-type></direction>`;
    const el = createElement(xml);
    const direction = mapDirectionElement(el);
    const wedge = direction.direction_type[0].wedge!;
    expect(wedge.type).toBe("crescendo");
    expect(wedge.number).toBe(3);
    expect(wedge.spread).toBe(12.5);
    expect(wedge.niente).toBe("yes");
    expect(wedge.lineType).toBe("dashed");
    expect(wedge.dashLength).toBe(1.2);
    expect(wedge.spaceLength).toBe(2.3);
    expect(wedge.defaultX).toBe(4.5);
    expect(wedge.defaultY).toBe(-3);
    expect(wedge.relativeX).toBe(1);
    expect(wedge.relativeY).toBe(-2);
    expect(wedge.color).toBe("red");
    expect(wedge.id).toBe("w1");
  });

  it("parses metronome notes and relation", () => {
    const xml = `<direction><direction-type><metronome><metronome-note><metronome-type>quarter</metronome-type><metronome-dot/></metronome-note><metronome-relation>equals</metronome-relation><metronome-note><metronome-type>eighth</metronome-type></metronome-note></metronome></direction-type></direction>`;
    const el = createElement(xml);
    const direction = mapDirectionElement(el);
    const met = direction.direction_type[0].metronome!;
    expect(met["metronome-note"]?.length).toBe(2);
    expect(met["metronome-note"]?.[0]["metronome-type"]).toBe("quarter");
    expect(met["metronome-note"]?.[0]["metronome-dot"]?.length).toBe(1);
    expect(met["metronome-relation"]).toBe("equals");
    expect(met["metronome-note"]?.[1]["metronome-type"]).toBe("eighth");
  });

  it("parses directive attribute", () => {
    const xml = `<direction directive="yes"><direction-type><words>Tempo</words></direction-type></direction>`;
    const el = createElement(xml);
    const direction = mapDirectionElement(el);
    expect(direction.directive).toBe("yes");
  });
});
