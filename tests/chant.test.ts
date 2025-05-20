import { describe, it, expect, beforeAll } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { parseMusicXmlString } from "../src/parser/xmlParser";
import { mapDocumentToScorePartwise } from "../src/parser/mappers";
import type {
  ScorePartwise,
  Measure,
  Note,
  Attributes,
  Direction,
} from "../src/types";
import {
  NoteSchema,
  AttributesSchema,
  DirectionSchema,
  LyricSchema,
} from "../src/schemas";

const filePath = path.resolve(
  __dirname,
  "../reference/xmlsamples/Chant.musicxml",
);

// Helper functions to extract elements from Measure content
function getNotesFromContent(content: Measure["content"] | undefined): Note[] {
  if (!content) return [];
  return content.filter(
    (item): item is Note =>
      (item as any)._type === "note" && NoteSchema.safeParse(item).success,
  );
}

function getAttributesFromContent(
  content: Measure["content"] | undefined,
): Attributes[] {
  if (!content) return [];
  return content.filter(
    (item): item is Attributes =>
      (item as any)._type === "attributes" &&
      AttributesSchema.safeParse(item).success,
  );
}

function getDirectionsFromContent(
  content: Measure["content"] | undefined,
): Direction[] {
  if (!content) return [];
  return content.filter(
    (item): item is Direction =>
      (item as any)._type === "direction" &&
      DirectionSchema.safeParse(item).success,
  );
}

describe("Chant.musicxml Parser Test", () => {
  let scorePartwise: ScorePartwise | null = null;

  beforeAll(async () => {
    try {
      const xmlString = fs.readFileSync(filePath, "utf-8");
      const xmlDoc = await parseMusicXmlString(xmlString);
      if (xmlDoc) {
        scorePartwise = mapDocumentToScorePartwise(xmlDoc);
      } else {
        scorePartwise = null;
      }
    } catch (e) {
      console.error(
        `Failed to read or parse Chant.musicxml: ${(e as Error).message}`,
      );
      scorePartwise = null;
    }
  });

  it("should parse the file without errors", () => {
    expect(scorePartwise).not.toBeNull();
    if (!scorePartwise) return;
    expect(scorePartwise.version).toBe("4.0");
  });

  it("should parse movement-title correctly", () => {
    if (!scorePartwise) throw new Error("scorePartwise is null");
    expect(scorePartwise.movementTitle).toBe("Quem queritis");
  });

  it("should parse identification rights and encoding", () => {
    if (!scorePartwise) throw new Error("scorePartwise is null");
    expect(scorePartwise.identification).toBeDefined();
    const id = scorePartwise.identification;
    expect(id?.rights).toBeDefined();
    expect(id?.rights).toHaveLength(1);
    expect(id?.rights?.[0].text).toBe("Copyright © 2010 MakeMusic, Inc.");

    expect(id?.encoding).toBeDefined();
    const encoding = scorePartwise.identification?.encoding;
    expect(encoding?.software).toBeDefined();
    expect(encoding?.software).toContain("Finale v27.0 for Mac");
    expect(encoding?.["encoding-date"]).toBeDefined();
    expect(encoding?.["encoding-date"]).toContain("2021-06-04");
  });

  it("should parse defaults including fonts and lyric language", () => {
    if (!scorePartwise) throw new Error("scorePartwise is null");
    expect(scorePartwise.defaults).toBeDefined();
    expect(scorePartwise.defaults?.scaling?.millimeters).toBe(6.4382);
    expect(scorePartwise.defaults?.scaling?.tenths).toBe(40);

    expect(scorePartwise.defaults?.musicFont?.fontFamily).toBe(
      "Maestro,engraved",
    );
    expect(scorePartwise.defaults?.musicFont?.fontSize).toBe("18.25");
    expect(scorePartwise.defaults?.wordFont?.fontFamily).toBe("Book Antiqua");
    expect(scorePartwise.defaults?.wordFont?.fontSize).toBe("10");

    expect(scorePartwise.defaults?.lyricFonts).toBeDefined();
    expect(scorePartwise.defaults?.lyricFonts).toHaveLength(1);
    expect(scorePartwise.defaults?.lyricFonts?.[0].fontFamily).toBe(
      "Book Antiqua",
    );
    expect(scorePartwise.defaults?.lyricFonts?.[0].fontSize).toBe("10");

    expect(scorePartwise.defaults?.lyricLanguages).toBeDefined();
    expect(scorePartwise.defaults?.lyricLanguages).toHaveLength(1);
    expect(scorePartwise.defaults?.lyricLanguages?.[0].xmlLang).toBe("la");
  });

  it("should parse part-list and score-part", () => {
    if (!scorePartwise) throw new Error("scorePartwise is null");
    expect(scorePartwise.partList).toBeDefined();
    expect(scorePartwise.partList.scoreParts).toHaveLength(1);
    const scorePart = scorePartwise.partList.scoreParts[0];
    expect(scorePart.id).toBe("P1");
    // part-name has print-object="no" so it might not be mapped or might be empty
    // For now, we check if it exists as per mapping logic.
    expect(scorePart.partName).toBeDefined();
  });

  it("should parse Measure 1 attributes, direction, notes, and lyrics", () => {
    if (!scorePartwise) throw new Error("scorePartwise is null");
    expect(scorePartwise.parts).toHaveLength(1);
    const part = scorePartwise.parts[0];
    expect(part.measures).toBeDefined();
    const measure1 = part.measures.find((m: Measure) => m.number === "1");
    expect(measure1).toBeDefined();
    if (!measure1) return;

    // Check attributes
    const attributesArray = getAttributesFromContent(measure1.content);
    expect(attributesArray).toHaveLength(1);
    const attrs = attributesArray[0];
    expect(attrs?.divisions).toBe(8);
    expect(attrs?.key?.[0].fifths).toBe(0);
    // Check for <senza-misura/>
    expect(attrs?.time?.[0].senzaMisura).toBe(true);
    expect(attrs?.time?.[0].beats).toBeUndefined();
    expect(attrs?.time?.[0]["beat-type"]).toBeUndefined();
    expect(attrs?.clef?.[0].sign).toBe("G");
    expect(attrs?.clef?.[0].line).toBe(2);

    // Check direction
    const directionsArray = getDirectionsFromContent(measure1.content);
    expect(directionsArray.length).toBeGreaterThanOrEqual(1); // At least "Angelus dicit:"
    const angelusDirection = directionsArray.find(
      (d) => d.direction_type?.[0]?.words?.text === "Angelus dicit:",
    );
    expect(angelusDirection).toBeDefined();
    expect(angelusDirection?.placement).toBe("above");
    // expect(angelusDirection?.direction_type?.[0]?.words?.formatting?.['xml:lang']).toBe('la'); // xml:lang on words is not in TextFormattingSchema

    // Check notes and lyrics
    const notesArray = getNotesFromContent(measure1.content);
    expect(notesArray.length).toBeGreaterThanOrEqual(26); // Based on the provided XML for measure 1

    const firstNote = notesArray[0];
    expect(firstNote?.pitch?.step).toBe("G");
    expect(firstNote?.pitch?.octave).toBe(4);
    expect(firstNote?.duration).toBe(8);
    expect(firstNote?.type).toBe("quarter");
    expect(firstNote?.stem).toBe("up");
    expect(firstNote?.lyrics).toBeDefined();
    expect(firstNote?.lyrics).toHaveLength(1);
    const firstLyric = firstNote?.lyrics?.[0];
    if (!firstLyric) throw new Error("First lyric not found");
    expect(LyricSchema.safeParse(firstLyric).success).toBe(true);
    expect(firstLyric.syllabic).toBe("single");
    expect(firstLyric.text).toBe("Quem");
    // Default justify for lyric is not explicitly in LyricSchema, but might be an attribute on <lyric> element in XML
    // Current LyricSchema doesn't have justify.

    const secondNote = notesArray[1];
    expect(secondNote?.pitch?.step).toBe("F");
    expect(secondNote?.pitch?.octave).toBe(4);

    // Check barline at the end of the measure (if it's part of measure content)
    // Barlines are often at the end of measure data or as a direct child of <measure>
    // The current getBarlineFromContent might need adjustment if barlines are not directly in 'content' array
    // For now, let's assume it might be part of the content for simplicity in this auto-generated test.
    // If the barline is a direct property of the measure (e.g., measure.barlines), test that instead.
    // Based on Chant.xml, the barline is a direct child, not in a 'content' array per se in the typical sense.
    // It will be mapped as a MeasureContent item with _type: 'barline'.
    const barlineElement = measure1.content?.find(
      (item: any) => (item as any)._type === "barline",
    );
    expect(barlineElement).toBeDefined();
    // @ts-ignore
    expect(barlineElement?.location).toBe("right");
    // @ts-ignore
    expect(barlineElement?.barStyle).toBe("light-light");
  });

  // Add more specific tests as needed, e.g., for slurs, other measure details.
  it("should parse slurs in Measure 1", () => {
    if (!scorePartwise) throw new Error("scorePartwise is null");
    const measure1 = scorePartwise.parts[0].measures.find(
      (m: Measure) => m.number === "1",
    );
    if (!measure1) throw new Error("Measure 1 not found");
    const notesInMeasure1 = getNotesFromContent(measure1.content);

    const noteWithSlurStart = notesInMeasure1.find((n) =>
      n.notations?.slurs?.some((s) => s.type === "start"),
    );
    expect(noteWithSlurStart).toBeDefined();
    expect(noteWithSlurStart?.notations?.slurs?.[0].type).toBe("start");
    expect(noteWithSlurStart?.notations?.slurs?.[0].placement).toBe("below");

    const noteWithSlurStop = notesInMeasure1.find((n) =>
      n.notations?.slurs?.some((s) => s.type === "stop"),
    );
    expect(noteWithSlurStop).toBeDefined();
  });
});
