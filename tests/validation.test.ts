import { describe, it, expect } from "vitest";
import { validateScore } from "../src/utils/validation";
import type { ScorePartwise } from "../src/types";

describe("validateScore", () => {
  it("throws when required fields are missing", () => {
    const invalid = { version: "3.1" } as unknown as ScorePartwise;
    expect(() => validateScore(invalid)).toThrow();
  });

  it("throws when parts array is empty", () => {
    const invalid = {
      version: "3.1",
      partList: { scoreParts: [{ id: "P1" }] },
      parts: [],
    } as unknown as ScorePartwise;
    expect(() => validateScore(invalid)).toThrow();
  });
});
