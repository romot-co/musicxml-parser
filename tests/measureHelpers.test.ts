import { describe, it, expect } from "vitest";
import { parseMusicXml } from "../src/parser";
import type { ScorePartwise } from "../src/types";
import {
  getNotes,
  getAttributes,
  getDirections,
  getBackups,
  getForwards,
  getBarlines,
} from "../src/utils/measureHelpers";

const xml = `<score-partwise version="3.1">
  <part-list>
    <score-part id="P1">
      <part-name>Music</part-name>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes><divisions>1</divisions></attributes>
      <direction placement="above"><direction-type><words>Allegro</words></direction-type></direction>
      <note><pitch><step>C</step><octave>4</octave></pitch><duration>1</duration></note>
      <backup><duration>1</duration></backup>
      <note><rest/><duration>1</duration></note>
      <forward><duration>1</duration></forward>
      <note><pitch><step>D</step><octave>4</octave></pitch><duration>1</duration></note>
      <barline location="right"><bar-style>light-heavy</bar-style></barline>
    </measure>
  </part>
</score-partwise>`;

describe("measureHelpers", () => {
  it("extracts elements from a measure", async () => {
    const parsed = (await parseMusicXml(xml)) as ScorePartwise;
    const measure = parsed.parts[0].measures[0];

    const notes = getNotes(measure);
    expect(notes).toHaveLength(3);
    expect(notes[0].pitch?.step).toBe("C");
    expect(notes[1].rest).toBeDefined();

    const attrs = getAttributes(measure);
    expect(attrs).toHaveLength(1);
    expect(attrs[0].divisions).toBe(1);

    const dirs = getDirections(measure);
    expect(dirs).toHaveLength(1);
    expect(dirs[0].placement).toBe("above");

    expect(getBackups(measure)).toHaveLength(1);
    expect(getForwards(measure)).toHaveLength(1);
    expect(getBarlines(measure)).toHaveLength(1);
  });
});
