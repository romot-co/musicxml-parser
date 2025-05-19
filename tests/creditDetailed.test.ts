import { describe, it, expect } from "vitest";
import { JSDOM } from "jsdom";
import { mapCreditElement } from "../src/parser/mappers";
import type { CreditWords, CreditSymbol, CreditImage, Link, Bookmark } from "../src/types";

function createElement(xmlString: string): Element {
  const dom = new JSDOM(xmlString, { contentType: "application/xml" });
  const parsererror = dom.window.document.querySelector("parsererror");
  if (parsererror) throw new Error("Invalid XML");
  return dom.window.document.documentElement;
}

describe("Detailed Credit parsing", () => {
  it("parses mixed credit elements", () => {
    const xml = `<credit page="1">
      <credit-type>title</credit-type>
      <credit-type>subtitle</credit-type>
      <link href="http://example.com"/>
      <bookmark id="b1" name="start"/>
      <credit-words default-x="5" default-y="10" halign="center">Hello</credit-words>
      <credit-words font-weight="bold">World</credit-words>
      <credit-symbol default-x="1">gClef</credit-symbol>
      <credit-image source="img.png" type="image/png" width="100" height="50"/>
    </credit>`;
    const el = createElement(xml);
    const credit = mapCreditElement(el)!;
    expect(credit.page).toBe("1");
    expect(credit.creditTypes?.length).toBe(2);
    expect(credit.links?.length).toBe(1);
    expect(credit.bookmarks?.length).toBe(1);
    expect(credit.creditWords?.length).toBe(2);
    const w1 = credit.creditWords?.[0] as CreditWords;
    expect(w1.text).toBe("Hello");
    expect(w1.formatting?.defaultX).toBe(5);
    expect(w1.formatting?.justify).toBe("center");
    const w2 = credit.creditWords?.[1] as CreditWords;
    expect(w2.text).toBe("World");
    expect(w2.formatting?.fontWeight).toBe("bold");
    const symbol = credit.creditSymbols?.[0] as CreditSymbol;
    expect(symbol.smuflGlyphName).toBe("gClef");
    expect(symbol.formatting?.defaultX).toBe(1);
    const image = credit.creditImage as CreditImage;
    expect(image.width).toBe(100);
    expect(image.height).toBe(50);
  });
});

