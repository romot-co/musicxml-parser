import { describe, it, expect } from "vitest";
import * as path from "path";
import { readMusicXmlFile } from "../src/utils/readMusicXmlFile";

const samplesDir = path.resolve(__dirname, "../reference/xmlsamples");

describe("readMusicXmlFile", () => {
  it("extracts MusicXML from MXL archives", async () => {
    const fromArchive = await readMusicXmlFile(
      path.join(samplesDir, "ActorPreludeSample.mxl"),
    );
    const direct = await readMusicXmlFile(
      path.join(samplesDir, "ActorPreludeSample.musicxml"),
    );
    expect(fromArchive).toBe(direct);
  });
});
