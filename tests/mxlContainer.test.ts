import { describe, it, expect } from "vitest";
import * as path from "path";
import { readMusicXmlFile } from "../src/utils/readMusicXmlFile";

const fixDir = path.resolve(__dirname, "./fixtures");

describe("MXL container handling", () => {
  it("reads rootfile via container.xml", async () => {
    const mxl = await readMusicXmlFile(
      path.join(fixDir, "container-sample.mxl"),
    );
    const direct = await readMusicXmlFile(path.join(fixDir, "score.xml"));
    expect(mxl).toBe(direct);
  });
});
