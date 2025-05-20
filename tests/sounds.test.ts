import { describe, it, expect } from "vitest";
import { loadSoundsXml, instrumentIdForSound } from "../src/utils/sounds";
import * as path from "path";

describe("sounds.xml loading", () => {
  it("maps instrument ids", async () => {
    const file = path.resolve(
      __dirname,
      "../reference/musicxml-4.0/schema/sounds.xml",
    );
    const map = await loadSoundsXml(file);
    const id = instrumentIdForSound(map, "brass.trumpet");
    expect(typeof id).toBe("number");
    expect(id).toBe(map.get("brass.trumpet"));
  });
});
