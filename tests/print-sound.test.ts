import { describe, it, expect } from "vitest";
import { mapMeasureElement } from "../src/parser/mappers";
import type { Measure, Print, Sound } from "../src/types";
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

describe("Measure print and sound parsing", () => {
  it("should parse <print> and <sound> elements within a measure", () => {
    const xml = `<measure number="1"><print new-system="yes" page-number="2"/><sound tempo="120"/></measure>`;
    const element = createElement(xml);
    const measure = mapMeasureElement(element);
    expect(measure.content).toBeDefined();
    const print = measure.content?.[0] as Print;
    const sound = measure.content?.[1] as Sound;
    expect(print._type).toBe("print");
    expect(print.newSystem).toBe("yes");
    expect(print.pageNumber).toBe("2");
    expect(sound._type).toBe("sound");
    expect(sound.tempo).toBe(120);
  });

  it("parses additional print attributes and layout elements", () => {
    const xml = `\
<measure number="1">\
  <print blank-page="3" staff-spacing="12.5" id="pr1">\
    <page-layout>\
      <page-height>1000</page-height>\
      <page-width>800</page-width>\
      <page-margins type="both">\
        <left-margin>50</left-margin>\
        <right-margin>50</right-margin>\
        <top-margin>60</top-margin>\
        <bottom-margin>60</bottom-margin>\
      </page-margins>\
    </page-layout>\
    <system-layout>\
      <system-margins>\
        <left-margin>30</left-margin>\
        <right-margin>30</right-margin>\
      </system-margins>\
      <system-distance>120</system-distance>\
      <top-system-distance>150</top-system-distance>\
    </system-layout>\
    <staff-layout number="1">\
      <staff-distance>70</staff-distance>\
    </staff-layout>\
  </print>\
</measure>`;

    const element = createElement(xml);
    const measure = mapMeasureElement(element);
    const print = measure.content?.[0] as Print;
    expect(print.blankPage).toBe("3");
    expect(print.staffSpacing).toBe(12.5);
    expect(print.id).toBe("pr1");
    expect(print.pageLayout?.pageHeight).toBe(1000);
    expect(print.pageLayout?.pageMargins?.[0]?.type).toBe("both");
    expect(print.systemLayout?.systemDistance).toBe(120);
    expect(print.staffLayout?.[0].number).toBe(1);
    expect(print.staffLayout?.[0].staffDistance).toBe(70);
  });

  it("parses additional <sound> attributes", () => {
    const xml =
      `<measure number="1"><sound tempo="90" dacapo="yes" segno="seg1" dalsegno="ds1" ` +
      `pizzicato="yes" pan="30" elevation="10" damper-pedal="50" soft-pedal="no" ` +
      `sostenuto-pedal="yes" divisions="2" forward-repeat="no" fine="end" time-only="1,3" id="s1"/></measure>`;
    const element = createElement(xml);
    const measure = mapMeasureElement(element);
    const sound = (measure.content?.[0] as Sound) ?? {};
    expect(sound.tempo).toBe(90);
    expect(sound.dacapo).toBe("yes");
    expect(sound.segno).toBe("seg1");
    expect(sound.dalsegno).toBe("ds1");
    expect(sound.pizzicato).toBe("yes");
    expect(sound.pan).toBe(30);
    expect(sound.elevation).toBe(10);
    expect(sound.damperPedal).toBe(50);
    expect(sound.softPedal).toBe("no");
    expect(sound.sostenutoPedal).toBe("yes");
    expect(sound.divisions).toBe(2);
    expect(sound.forwardRepeat).toBe("no");
    expect(sound.fine).toBe("end");
    expect(sound.timeOnly).toBe("1,3");
    expect(sound.id).toBe("s1");
  });
});
