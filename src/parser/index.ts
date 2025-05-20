export * from "./xmlParser";
export * from "./mappers";

import type { ScorePartwise, ScoreTimewise, OpusDocument } from "../types";
import { parseMusicXmlString, parseMusicXmlStringSync } from "./xmlParser";
import { mapDocument, mapDocumentSync } from "./mappers";

/**
 * Parse a MusicXML string and map it directly to {@link ScorePartwise}.
 */
export async function parseMusicXml(
  xml: string,
  options: { basePath?: string } = {},
): Promise<ScorePartwise | ScoreTimewise | OpusDocument | null> {
  const doc = await parseMusicXmlString(xml);
  return doc ? mapDocument(doc, options) : null;
}

/**
 * Synchronous version of {@link parseMusicXml}.
 */
export function parseMusicXmlSync(
  xml: string,
  options: { basePath?: string } = {},
): ScorePartwise | ScoreTimewise | OpusDocument | null {
  const doc = parseMusicXmlStringSync(xml);
  return doc ? mapDocumentSync(doc, options) : null;
}
