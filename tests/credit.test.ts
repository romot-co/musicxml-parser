import { describe, it, expect } from "vitest";
import { JSDOM } from "jsdom";
import { mapCreditElement } from "../src/parser/mappers";
import type { CreditSymbol, Link, Bookmark } from "../src/types";

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
    const xml = `<credit page="1"><credit-type>title</credit-type><credit-symbol default-x="10" default-y="20" halign="center" valign="top">gClef</credit-symbol></credit>`;
    const element = createElement(xml);
    const credit = mapCreditElement(element)!;
    expect(credit).toBeDefined();
    expect(credit.creditSymbols).toBeDefined();
    expect(credit.creditSymbols?.length).toBe(1);
    const symbol = credit.creditSymbols?.[0] as CreditSymbol;
    expect(symbol.smuflGlyphName).toBe("gClef");
    expect(symbol.formatting?.defaultX).toBe(10);
    expect(symbol.formatting?.defaultY).toBe(20);
    expect(symbol.formatting?.halign).toBe("center");
    expect(symbol.formatting?.valign).toBe("top");
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
});
