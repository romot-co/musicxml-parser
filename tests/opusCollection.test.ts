import { describe, it, expect } from "vitest";
import * as path from "path";
import { parseOpusCollection } from "../src/utils/opus";

describe("opus collection parsing", () => {
  it("parses referenced scores", async () => {
    const file = path.join(__dirname, "fixtures", "collection.opus");
    const scores = await parseOpusCollection(file);
    expect(scores.length).toBe(2);
    expect(scores[0].movementTitle).toBe("Opus Part 1");
    expect(scores[1].movementTitle).toBe("Opus Part 2");
  });
});
