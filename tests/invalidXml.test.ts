import { describe, it, expect, vi } from "vitest";
import { parseMusicXmlString } from "../src/parser/xmlParser";

describe("Invalid XML handling", () => {
  it("returns null and logs an error for malformed XML", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const xml = "<score-partwise><bad></score>";
    const result = await parseMusicXmlString(xml);
    expect(result).toBeNull();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
