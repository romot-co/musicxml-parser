import { describe, it, expect } from "vitest";
import * as path from "path";
import { readMusicXmlFile } from "../src/utils/readMusicXmlFile";

const samplesDir = path.resolve(__dirname, "../reference/xmlsamples");
const dataDir = path.resolve(__dirname, "./data");

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

  it("uses container manifest to locate the score", async () => {
    const xml = await readMusicXmlFile(path.join(dataDir, "container.mxl"));
    const expected =
      '<score-partwise version="3.1"><part-list></part-list><part id="P1"><measure number="1"></measure></part></score-partwise>';
    expect(xml).toBe(expected);
  });
});
