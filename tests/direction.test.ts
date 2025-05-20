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

  it("parses metronome parentheses attribute", () => {
    const xml = `<direction><direction-type><metronome parentheses="yes"><beat-unit>quarter</beat-unit><per-minute>120</per-minute></metronome></direction-type></direction>`;
    const el = createElement(xml);
    const direction = mapDirectionElement(el);
    const met = direction.direction_type[0].metronome!;
    expect(met.parentheses).toBe("yes");
  });

  it("parses directive attribute", () => {
    const xml = `<direction directive="yes"><direction-type><words>Tempo</words></direction-type></direction>`;
    const el = createElement(xml);
    const direction = mapDirectionElement(el);
    expect(direction.directive).toBe("yes");
  });

  it("parses rehearsal element", () => {
    const xml = `<direction><direction-type><rehearsal font-weight="bold">A</rehearsal></direction-type></direction>`;
    const el = createElement(xml);
    const direction = mapDirectionElement(el);
    const reh = direction.direction_type[0].rehearsal!;
    expect(reh.text).toBe("A");
    expect(reh.formatting?.fontWeight).toBe("bold");
  });

  it("parses octave-shift element", () => {
    const xml = `<direction><direction-type><octave-shift type="down" size="8" number="1" dash-length="7.5" space-length="7.5"/></direction-type></direction>`;
    const el = createElement(xml);
    const direction = mapDirectionElement(el);
    const os = direction.direction_type[0].octaveShift!;
    expect(os.type).toBe("down");
    expect(os.size).toBe(8);
    expect(os.number).toBe(1);
    expect(os.dashLength).toBe(7.5);
    expect(os.spaceLength).toBe(7.5);
  });

  it("parses dashes element", () => {
    const xml = `<direction><direction-type><dashes type="start" number="2" dash-length="3" space-length="1"/></direction-type></direction>`;
    const el = createElement(xml);
    const direction = mapDirectionElement(el);
    const d = direction.direction_type[0].dashes!;
    expect(d.type).toBe("start");
    expect(d.number).toBe(2);
    expect(d.dashLength).toBe(3);
    expect(d.spaceLength).toBe(1);
  });

  it("parses bracket element", () => {
    const xml = `<direction><direction-type><bracket type="start" line-end="down" number="1" line-type="solid"/></direction-type></direction>`;
    const el = createElement(xml);
    const direction = mapDirectionElement(el);
    const b = direction.direction_type[0].bracket!;
    expect(b.type).toBe("start");
    expect(b.lineEnd).toBe("down");
    expect(b.number).toBe(1);
    expect(b.lineType).toBe("solid");
  });

  it("parses image element", () => {
    const xml = `<direction><direction-type><image source="img.png" type="image/png" width="20" height="10"/></direction-type></direction>`;
    const el = createElement(xml);
    const direction = mapDirectionElement(el);
    const img = direction.direction_type[0].image!;
    expect(img.source).toBe("img.png");
    expect(img.type).toBe("image/png");
    expect(img.width).toBe(20);
    expect(img.height).toBe(10);
  });

  it("extracts tempo from sound child", () => {
    const xml = `<direction><direction-type><words>Tempo</words></direction-type><sound tempo="144"/></direction>`;
    const el = createElement(xml);
    const direction = mapDirectionElement(el);
    expect(direction.sound?.tempo).toBe(144);
  });

  it("parses offset value", () => {
    const xml = `<direction><direction-type><words>Offset</words></direction-type><offset>2.5</offset></direction>`;
    const el = createElement(xml);
    const direction = mapDirectionElement(el);
    expect(direction.offset).toBe(2.5);
  });

  it("parses eyeglasses and damping elements", () => {
    const xml = `<direction><direction-type><eyeglasses/><damp/><damp-all/></direction-type></direction>`;
    const el = createElement(xml);
    const direction = mapDirectionElement(el);
    const dt = direction.direction_type[0];
    expect(dt.eyeglasses).toBeDefined();
    expect(dt.damp).toBeDefined();
    expect(dt.dampAll).toBeDefined();
  });

  it("parses string-mute element", () => {
    const xml = `<direction><direction-type><string-mute type="on"/></direction-type></direction>`;
    const el = createElement(xml);
    const direction = mapDirectionElement(el);
    expect(direction.direction_type[0].stringMute?.type).toBe("on");
  });

  it("parses harp-pedals element", () => {
    const xml = `<direction><direction-type><harp-pedals><pedal-tuning><pedal-step>D</pedal-step><pedal-alter>-1</pedal-alter></pedal-tuning><pedal-tuning><pedal-step>E</pedal-step></pedal-tuning></harp-pedals></direction-type></direction>`;
    const el = createElement(xml);
    const direction = mapDirectionElement(el);
    const hp = direction.direction_type[0].harpPedals!;
    expect(hp["pedal-tuning"].length).toBe(2);
    expect(hp["pedal-tuning"][0]["pedal-step"]).toBe("D");
    expect(hp["pedal-tuning"][0]["pedal-alter"]).toBe(-1);
  });

  it("parses scordatura element", () => {
    const xml = `<direction><direction-type><scordatura><accord string="1"><tuning-step>A</tuning-step><tuning-octave>4</tuning-octave></accord></scordatura></direction-type></direction>`;
    const el = createElement(xml);
    const direction = mapDirectionElement(el);
    const sc = direction.direction_type[0].scordatura!;
    expect(sc.accord.length).toBe(1);
    expect(sc.accord[0]["tuning-step"]).toBe("A");
    expect(sc.accord[0].string).toBe("1");
  });

  it("parses other-direction element", () => {
    const xml = `<direction><direction-type><other-direction>custom</other-direction></direction-type></direction>`;
    const el = createElement(xml);
    const direction = mapDirectionElement(el);
    expect(direction.direction_type[0].otherDirection?.text).toBe("custom");
  });
});
