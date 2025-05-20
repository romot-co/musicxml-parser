import { promises as fs } from "fs";
import { JSDOM } from "jsdom";

export async function loadSoundsXml(
  filePath: string,
): Promise<Map<string, number>> {
  const data = await fs.readFile(filePath, "utf8");
  const dom = new JSDOM(data, { contentType: "application/xml" });
  const map = new Map<string, number>();
  const soundEls = Array.from(dom.window.document.querySelectorAll("sound"));
  soundEls.forEach((el, idx) => {
    const id = el.getAttribute("id");
    if (id) map.set(id, idx);
  });
  return map;
}

export function instrumentIdForSound(
  map: Map<string, number>,
  sound: string,
): number | undefined {
  return map.get(sound);
}
