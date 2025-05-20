import { promises as fs } from "fs";
import * as path from "path";
import { parseMusicXmlString } from "../parser/xmlParser";
import { mapDocumentToScorePartwise } from "../parser/mappers";
import type { ScorePartwise } from "../types";

export async function parseOpusCollection(
  filePath: string,
): Promise<ScorePartwise[]> {
  const xml = await fs.readFile(filePath, "utf8");
  const doc = await parseMusicXmlString(xml);
  if (!doc) throw new Error("Invalid opus document");
  const dir = path.dirname(filePath);
  const scores: ScorePartwise[] = [];
  const scoreElements = Array.from(doc.getElementsByTagName("score"));
  for (const el of scoreElements) {
    const href = el.getAttribute("xlink:href");
    if (!href) continue;
    const scoreXml = await fs.readFile(path.join(dir, href), "utf8");
    const scoreDoc = await parseMusicXmlString(scoreXml);
    if (scoreDoc) scores.push(mapDocumentToScorePartwise(scoreDoc));
  }
  return scores;
}
