import { promises as fs } from "fs";
import { parseMusicXmlStringSync } from "../parser/xmlParser";

let soundsMap: Map<string, string> | undefined;

export async function loadSoundsXml(
  filePath: string,
): Promise<Map<string, string>> {
  const xml = await fs.readFile(filePath, "utf8");
  const doc = parseMusicXmlStringSync(xml);
  if (!doc) throw new Error("Failed to parse sounds.xml");
  const map = new Map<string, string>();
  const soundElements = Array.from(doc.getElementsByTagName("sound"));
  for (const el of soundElements) {
    const id = el.getAttribute("id");
    if (!id) continue;
    map.set(id.toLowerCase(), id);
    const text =
      el.childNodes.length === 1 ? el.textContent?.trim() : undefined;
    if (text) map.set(text.toLowerCase(), id);
    const sub = el.querySelectorAll("any,solo,ensemble");
    sub.forEach((child) => {
      const t = child.textContent?.trim();
      if (t) map.set(t.toLowerCase(), id);
    });
  }
  soundsMap = map;
  return map;
}

export function getStandardInstrumentId(
  nameOrSound: string,
): string | undefined {
  return soundsMap?.get(nameOrSound.toLowerCase());
}

export function getStandardInstrumentMap(): Map<string, string> | undefined {
  return soundsMap;
}
