export * from "./xmlParser";
export * from "./mappers";

import type { ScorePartwise } from "../types";
import {
  parseMusicXmlString,
  parseMusicXmlStringSync,
} from "./xmlParser";
import { mapDocumentToScorePartwise } from "./mappers";

/**
 * Parse a MusicXML string and map it directly to {@link ScorePartwise}.
 */
export async function parseMusicXml(
  xml: string,
): Promise<ScorePartwise | null> {
  const doc = await parseMusicXmlString(xml);
  return doc ? mapDocumentToScorePartwise(doc) : null;
}

/**
 * Synchronous version of {@link parseMusicXml}.
 */
export function parseMusicXmlSync(xml: string): ScorePartwise | null {
  const doc = parseMusicXmlStringSync(xml);
  return doc ? mapDocumentToScorePartwise(doc) : null;
}
