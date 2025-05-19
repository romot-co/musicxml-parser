import { describe, it, expect } from "vitest";
import { JSDOM } from "jsdom";
import { mapDirectionElement } from "../src/parser/mappers";

function createElement(xmlString: string): Element {
  const dom = new JSDOM(xmlString, { contentType: "application/xml" });
  const err = dom.window.document.querySelector("parsererror");
  if (err) throw new Error("Invalid XML");
  return dom.window.document.documentElement;
}

describe("Advanced Direction parsing", () => {
  it("parses multiple direction-type elements and wedge attributes", () => {
    const xml = `<direction placement="below" staff="2">
      <direction-type><words font-style="italic">rit.</words></direction-type>
      <direction-type><wedge type="diminuendo" number="2" spread="11" niente="no" line-type="dotted" dash-length="1.1" space-length="2" default-x="1" default-y="-1" relative-x="0.5" relative-y="0" color="green" id="w2"/></direction-type>
      <sound dynamics="70"/>
      <offset>-0.5</offset>
    </direction>`;
    const el = createElement(xml);
    const direction = mapDirectionElement(el);
    expect(direction.placement).toBe("below");
    expect(direction.staff).toBe(2);
    expect(direction.direction_type.length).toBe(2);
    expect(direction.direction_type[0].words?.text).toBe("rit.");
    const wedge = direction.direction_type[1].wedge!;
    expect(wedge.type).toBe("diminuendo");
    expect(wedge.number).toBe(2);
    expect(wedge.spread).toBe(11);
    expect(wedge.niente).toBe("no");
    expect(wedge.lineType).toBe("dotted");
    expect(wedge.dashLength).toBe(1.1);
    expect(wedge.spaceLength).toBe(2);
    expect(wedge.defaultX).toBe(1);
    expect(wedge.defaultY).toBe(-1);
    expect(wedge.relativeX).toBe(0.5);
    expect(wedge.relativeY).toBe(0);
    expect(wedge.color).toBe("green");
    expect(wedge.id).toBe("w2");
    expect(direction.sound?.dynamics).toBe(70);
    expect(direction.offset).toBe(-0.5);
  });
});

