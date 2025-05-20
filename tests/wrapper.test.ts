import { describe, it, expect } from "vitest";
import { parseMusicXml } from "../src/parser";
import { ScoreWrapper } from "../src/wrappers";

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
        <type>quarter</type>
      </note>
    </measure>
  </part>
</score-partwise>`;

describe("Wrapper classes", () => {
  it("provides access to parts and notes", async () => {
    const score = await parseMusicXml(xml);
    expect(score).not.toBeNull();
    if (!score) return;
    const wrapper = new ScoreWrapper(score);
    const part = wrapper.getPart("P1");
    expect(part).toBeDefined();
    if (!part) return;
    const measure = part.getMeasure(1);
    expect(measure?.number).toBe("1");
    const notes = part.getNotes();
    expect(notes).toHaveLength(1);
    expect(notes[0].pitch?.step).toBe("C");
  });
});
