import { describe, it, expect } from "vitest";
import { JSDOM } from "jsdom";
import { mapCreditElement } from "../src/parser/mappers";
import type { CreditSymbol, Link, Bookmark, CreditImage } from "../src/types";

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

describe("Credit parsing", () => {
  it("parses credit-symbol inside credit", () => {
    const xml = `<credit page="1"><credit-type>title</credit-type><credit-symbol default-x="10" default-y="20" halign="center" valign="top" underline="1" rotation="45">gClef</credit-symbol></credit>`;
    const element = createElement(xml);
    const credit = mapCreditElement(element)!;
    expect(credit).toBeDefined();
    expect(credit.items).toBeDefined();
    expect(credit.items?.length).toBe(1);
    const symbol = credit.items?.[0] as CreditSymbol;
    expect(symbol.smuflGlyphName).toBe("gClef");
    expect(symbol.formatting?.defaultX).toBe(10);
    expect(symbol.formatting?.defaultY).toBe(20);
    expect(symbol.formatting?.halign).toBe("center");
    expect(symbol.formatting?.valign).toBe("top");
    expect(symbol.formatting?.underline).toBe(1);
    expect(symbol.formatting?.rotation).toBe(45);
  });

  it("parses credit link", () => {
    const xml = `<credit><link href="http://example.com" name="test"/></credit>`;
    const element = createElement(xml);
    const credit = mapCreditElement(element)!;
    expect(credit.links).toBeDefined();
    expect(credit.links?.length).toBe(1);
    const link = credit.links?.[0] as Link;
    expect(link.href).toBe("http://example.com");
    expect(link.name).toBe("test");
  });

  it("parses credit bookmark", () => {
    const xml = `<credit><bookmark id="b1" name="mark"/></credit>`;
    const element = createElement(xml);
    const credit = mapCreditElement(element)!;
    expect(credit.bookmarks).toBeDefined();
    expect(credit.bookmarks?.length).toBe(1);
    const bm = credit.bookmarks?.[0] as Bookmark;
    expect(bm.id).toBe("b1");
    expect(bm.name).toBe("mark");
  });

  it("parses credit-image attributes", () => {
    const xml = `<credit><credit-image source="cover.png" type="image/png" height="25" width="80" default-x="10" default-y="-5" halign="right" valign="bottom"/></credit>`;
    const element = createElement(xml);
    const credit = mapCreditElement(element)!;
    expect(credit.creditImages).toBeDefined();
    expect(credit.creditImages?.length).toBe(1);
    const image = credit.creditImages?.[0] as CreditImage;
    expect(image.source).toBe("cover.png");
    expect(image.type).toBe("image/png");
    expect(image.height).toBe(25);
    expect(image.width).toBe(80);
    expect(image.defaultX).toBe(10);
    expect(image.defaultY).toBe(-5);
    expect(image.halign).toBe("right");
    expect(image.valign).toBe("bottom");
  });

  it("parses mixed credit content and formatting", () => {
    const xml = `<credit page="2">
      <credit-words underline="2">Hello</credit-words>
      <credit-symbol rotation="-30">fClef</credit-symbol>
      <credit-words overline="1">World</credit-words>
    </credit>`;
    const element = createElement(xml);
    const credit = mapCreditElement(element)!;
    expect(credit.items?.length).toBe(3);
    const w1 = credit.items?.[0] as any;
    const s = credit.items?.[1] as any;
    const w2 = credit.items?.[2] as any;
    expect(w1.text).toBe("Hello");
    expect(w1.formatting?.underline).toBe(2);
    expect(s.smuflGlyphName).toBe("fClef");
    expect(s.formatting?.rotation).toBe(-30);
    expect(w2.text).toBe("World");
    expect(w2.formatting?.overline).toBe(1);
  });
});
