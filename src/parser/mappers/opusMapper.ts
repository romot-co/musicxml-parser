import * as fsp from "fs/promises";
import * as fs from "fs";
import * as path from "path";
import { parseMusicXmlString, parseMusicXmlStringSync } from "../xmlParser";
import {
  mapDocumentToScorePartwise,
  mapDocumentToScoreTimewise,
} from "./measureMappers";
import type { OpusDocument, ScorePartwise, ScoreTimewise } from "../../types";

interface MapOptions {
  basePath?: string;
}

async function parseLinkedFile(
  href: string,
  options: MapOptions,
): Promise<ScorePartwise | ScoreTimewise | OpusDocument | null> {
  const resolved = options.basePath
    ? path.resolve(options.basePath, href)
    : href;
  const xml = await fsp.readFile(resolved, "utf-8");
  const doc = await parseMusicXmlString(xml);
  if (!doc) return null;
  return mapDocument(doc, { basePath: path.dirname(resolved) });
}

function parseLinkedFileSync(
  href: string,
  options: MapOptions,
): ScorePartwise | ScoreTimewise | OpusDocument | null {
  const resolved = options.basePath
    ? path.resolve(options.basePath, href)
    : href;
  const xml = fs.readFileSync(resolved, "utf-8");
  const doc = parseMusicXmlStringSync(xml);
  if (!doc) return null;
  return mapDocumentSync(doc, { basePath: path.dirname(resolved) });
}

export async function mapOpusElement(
  element: Element,
  options: MapOptions,
): Promise<OpusDocument> {
  const title = element.querySelector("title")?.textContent?.trim();
  const version = element.getAttribute("version") || undefined;
  const movements: Array<ScorePartwise | ScoreTimewise | OpusDocument> = [];
  for (const child of Array.from(element.children)) {
    if (child.nodeName === "score" || child.nodeName === "opus-link") {
      const href = child.getAttribute("xlink:href");
      if (href) {
        const parsed = await parseLinkedFile(href, options);
        if (parsed) movements.push(parsed);
      }
    } else if (child.nodeName === "opus") {
      movements.push(await mapOpusElement(child, options));
    }
  }
  return { version, title, movements };
}

export function mapOpusElementSync(
  element: Element,
  options: MapOptions,
): OpusDocument {
  const title = element.querySelector("title")?.textContent?.trim();
  const version = element.getAttribute("version") || undefined;
  const movements: Array<ScorePartwise | ScoreTimewise | OpusDocument> = [];
  for (const child of Array.from(element.children)) {
    if (child.nodeName === "score" || child.nodeName === "opus-link") {
      const href = child.getAttribute("xlink:href");
      if (href) {
        const parsed = parseLinkedFileSync(href, options);
        if (parsed) movements.push(parsed);
      }
    } else if (child.nodeName === "opus") {
      movements.push(mapOpusElementSync(child, options));
    }
  }
  return { version, title, movements };
}

export function mapDocument(
  doc: XMLDocument,
  options: MapOptions,
): Promise<ScorePartwise | ScoreTimewise | OpusDocument> {
  const root = doc.documentElement.nodeName;
  if (root === "score-partwise")
    return Promise.resolve(mapDocumentToScorePartwise(doc));
  if (root === "score-timewise")
    return Promise.resolve(mapDocumentToScoreTimewise(doc));
  if (root === "opus") return mapOpusElement(doc.documentElement, options);
  throw new Error(`Unsupported root element <${root}>`);
}

export function mapDocumentSync(
  doc: XMLDocument,
  options: MapOptions,
): ScorePartwise | ScoreTimewise | OpusDocument {
  const root = doc.documentElement.nodeName;
  if (root === "score-partwise") return mapDocumentToScorePartwise(doc);
  if (root === "score-timewise") return mapDocumentToScoreTimewise(doc);
  if (root === "opus") return mapOpusElementSync(doc.documentElement, options);
  throw new Error(`Unsupported root element <${root}>`);
}
