import { describe, it, expect } from "vitest";
import { parseMusicXmlString } from "../src/parser/xmlParser";
import { mapDocumentToScorePartwise } from "../src/parser/mappers";
import { addNote, transposePart } from "../src/utils/editHelpers";
import type { Note } from "../src/types";

const xml = `
<score-partwise version="3.1">
  <part-list>
    <score-part id="P1">
      <part-name>Music</part-name>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <note>
        <pitch><step>C</step><octave>4</octave></pitch>
        <duration>1</duration>
      </note>
    </measure>
  </part>
</score-partwise>`;

async function loadScore() {
  const doc = await parseMusicXmlString(xml);
  if (!doc) throw new Error("parse failed");
  return mapDocumentToScorePartwise(doc);
}

describe("edit helpers", () => {
  it("adds a note to a measure", async () => {
    const score = await loadScore();
    const newNote: Note = {
      _type: "note",
      pitch: { step: "D", octave: 4 },
      duration: 1,
    };
    addNote("P1", "1", newNote, score);
    const measure = score.parts[0].measures[0];
    expect(measure.content?.length).toBe(2);
    const added = measure.content?.[1] as Note;
    expect(added.pitch?.step).toBe("D");
  });

  it("transposes all notes in a part", async () => {
    const score = await loadScore();
    transposePart("P1", 2, score);
    const note = score.parts[0].measures[0].content?.[0] as Note;
    expect(note.pitch?.step).toBe("D");
  });
});
