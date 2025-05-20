import { describe, it, expect } from "vitest";
import * as path from "path";
import * as fs from "fs/promises";
import { parseMusicXml } from "../src/parser";

const baseDir = path.resolve(__dirname, "opus-samples");

async function read(file: string) {
  return fs.readFile(path.join(baseDir, file), "utf-8");
}

describe("Opus root parsing", () => {
  it("loads referenced movements", async () => {
    const xml = await read("opus.xml");
    const opus = await parseMusicXml(xml, { basePath: baseDir });
    expect(opus && (opus as any).movements).toBeDefined();
    if (!opus || !("movements" in opus)) return;
    expect(opus.movements.length).toBe(2);
  });
});
