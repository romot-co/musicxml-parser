import { readFileSync } from "fs";
import { JSDOM } from "jsdom";
import { join } from "path";

let soundIds: string[] | null = null;

function loadSoundIds(): string[] {
  if (soundIds) return soundIds;
  try {
    const filePath = join(
      __dirname,
      "../../reference/musicxml-4.0/schema/sounds.xml",
    );
    const xml = readFileSync(filePath, "utf8");
    const dom = new JSDOM(xml, { contentType: "application/xml" });
    soundIds = Array.from(dom.window.document.getElementsByTagName("sound"))
      .map((el) => el.getAttribute("id") || "")
      .filter((id) => id !== "");
  } catch {
    soundIds = [];
  }
  return soundIds;
}

const NAME_TO_ID: Record<string, string> = {
  piano: "keyboard.piano",
  violin: "strings.violin",
  flute: "wind.flute",
  clarinet: "wind.clarinet",
  trumpet: "brass.trumpet",
  cello: "strings.cello",
};

export function mapToStandardInstrumentId(
  name?: string,
  sound?: string,
): string | undefined {
  const ids = loadSoundIds();
  if (sound && ids.includes(sound)) return sound;
  if (!name) return undefined;

  const byName = NAME_TO_ID[name.toLowerCase()];
  if (byName && ids.includes(byName)) return byName;

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  for (const id of ids) {
    if (
      id === slug ||
      id.endsWith(slug) ||
      id.includes(slug.replace(/-/g, "."))
    ) {
      return id;
    }
    const idSlug = id.replace(/[.]/g, "-");
    if (idSlug === slug || idSlug.endsWith(slug)) return id;
  }
  return undefined;
}
