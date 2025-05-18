/**
 * Parses an XML string into a DOM Document.
 * This function is primarily intended for browser environments.
 * For Node.js, a library like jsdom would be required to provide DOMParser.
 * @param xmlString The XML string to parse.
 * @returns The parsed Document object, or null if parsing fails.
 * @throws Error if DOMParser is not available in the current environment.
 */
export function parseMusicXmlString(xmlString: string): Document | null {
  let DOMParserImpl: typeof DOMParser | undefined =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).DOMParser;

  if (!DOMParserImpl) {
    if (typeof process !== "undefined" && process.versions?.node) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { JSDOM } = require("jsdom") as typeof import("jsdom");
        DOMParserImpl = new JSDOM().window.DOMParser;
      } catch (e) {
        throw new Error(
          "DOMParser is not available and jsdom could not be loaded.",
        );
      }
    } else {
      throw new Error(
        "DOMParser is not available in this environment. For Node.js, consider using a library like jsdom.",
      );
    }
  }

  const parser = new DOMParserImpl();
  const doc = parser.parseFromString(xmlString, "application/xml");

  // Check for parsing errors (browser-specific)
  // https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString
  // "If the string cannot be parsed or is not well-formed XML, the parser may return an error document,
  //  or throw an exception, depending on the browser and the specific error."
  // A common way to check is to look for a <parsererror> element.
  const parserError = doc.getElementsByTagName("parsererror");
  if (parserError.length > 0) {
    console.error("Error parsing XML:", parserError[0].textContent);
    return null;
  }

  return doc;
}
