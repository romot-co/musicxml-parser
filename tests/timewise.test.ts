import { describe, it, expect } from "vitest";
import { parseMusicXmlString } from "../src/parser/xmlParser";
import { mapDocumentToScoreTimewise } from "../src/parser/mappers";
import type { Note, MeasureContent } from "../src/types";
import { NoteSchema } from "../src/schemas";

function getNotes(content: MeasureContent[] | undefined): Note[] {
  if (!content) return [];
  return content.filter(
    (c): c is Note =>
      (c as any)._type === "note" && NoteSchema.safeParse(c).success,
  );
}

const sampleTimewiseXml = `
<score-timewise version="3.1">
  <part-list>
    <score-part id="P1">
      <part-name>Music</part-name>
    </score-part>
  </part-list>
  <measure number="1">
    <part id="P1">
      <attributes>
        <divisions>1</divisions>
        <key>
          <fifths>0</fifths>
          <mode>major</mode>
        </key>
        <time>
          <beats>4</beats>
          <beat-type>4</beat-type>
        </time>
        <clef>
          <sign>G</sign>
          <line>2</line>
        </clef>
      </attributes>
      <note>
        <pitch><step>C</step><octave>4</octave></pitch>
        <duration>1</duration>
        <type>quarter</type>
      </note>
      <note>
        <rest/>
        <duration>1</duration>
        <type>quarter</type>
      </note>
    </part>
  </measure>
</score-timewise>
`;

describe("Timewise MusicXML parsing", () => {
  it("parses a simple timewise score", async () => {
    const doc = await parseMusicXmlString(sampleTimewiseXml);
    expect(doc).not.toBeNull();
    if (!doc) return;
    const score = mapDocumentToScoreTimewise(doc);
    expect(score.measures).toHaveLength(1);
    const measure = score.measures[0];
    expect(measure.parts).toHaveLength(1);
    const part = measure.parts[0];
    expect(part.id).toBe("P1");
    const notes = getNotes(part.content);
    expect(notes).toHaveLength(2);
    expect(notes[0].pitch?.step).toBe("C");
    expect(notes[1].rest).toBeDefined();
  });
});
