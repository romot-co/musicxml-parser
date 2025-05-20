import { describe, it, expect, beforeEach } from "vitest";
import path from "path";
import {
  loadSoundsXml,
  getStandardInstrumentId,
  getStandardInstrumentMap,
} from "../src/utils/loadSoundsXml";

const samplePath = path.join(__dirname, "sounds-sample.xml");

describe("loadSoundsXml", () => {
  beforeEach(async () => {
    await loadSoundsXml(samplePath);
  });

  it("creates a mapping from names to ids", () => {
    const map = getStandardInstrumentMap();
    expect(map).toBeDefined();
    expect(map?.get("piano")).toBe("keyboard.piano");
    expect(getStandardInstrumentId("Trumpet")).toBe("brass.trumpet");
    expect(getStandardInstrumentId("Violin Solo")).toBe("strings.violin");
  });
});
