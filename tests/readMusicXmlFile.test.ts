import { describe, it, expect, vi } from "vitest";

vi.mock("child_process", () => {
  const execFile = (
    _cmd: string,
    _args: string[],
    _opts: any,
    cb: (err: NodeJS.ErrnoException | null, stdout?: string | Buffer) => void,
  ) => {
    const err = new Error("spawn unzip ENOENT") as NodeJS.ErrnoException;
    err.code = "ENOENT";
    cb(err);
  };
  return { execFile, default: { execFile } };
});

import { readMusicXmlFile } from "../src/utils/readMusicXmlFile";

describe("readMusicXmlFile unzip fallback", () => {
  it("throws a helpful error when unzip is missing", async () => {
    await expect(readMusicXmlFile("dummy.mxl")).rejects.toThrow(/unzip/);
  });
});
