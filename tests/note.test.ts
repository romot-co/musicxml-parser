import { describe, it, expect } from "vitest";
import { mapNoteElement } from "../src/parser/mappers";
import type { Note, Pitch, Rest, Lyric, Beam, Slur } from "../src/types"; // Added more types as needed
import { JSDOM } from "jsdom";

// Helper to create an Element from an XML string snippet
function createElement(xmlString: string): Element {
  const dom = new JSDOM(xmlString, { contentType: "application/xml" });
  const parsererror = dom.window.document.querySelector("parsererror");
  if (parsererror) {
    throw new Error(
      `Failed to parse XML string snippet: ${parsererror.textContent}`,
    );
  }
  if (!dom.window.document.documentElement) {
    throw new Error("No document element found in XML string snippet.");
  }
  return dom.window.document.documentElement;
}

describe("Note Schema Tests (note.mod)", () => {
  describe("mapNoteElement", () => {
    it("should parse a basic <note> with <pitch>, <duration>, <type>, and <stem>", () => {
      const xml =
        "<note><pitch><step>C</step><octave>4</octave></pitch><duration>2</duration><type>eighth</type><stem>up</stem></note>";
      const element = createElement(xml);
      const note = mapNoteElement(element);
      expect(note).toBeDefined();
      expect(note._type).toBe("note");
      expect(note.pitch).toBeDefined();
      const pitch = note.pitch as Pitch;
      expect(pitch.step).toBe("C");
      expect(pitch.octave).toBe(4);
      expect(note.duration).toBe(2);
      expect(note.type).toBe("eighth");
      expect(note.stem).toBe("up");
    });

    it("should parse a <note> with <rest>", () => {
      const xml =
        "<note><rest/><duration>4</duration><type>quarter</type></note>";
      const element = createElement(xml);
      const note = mapNoteElement(element);
      expect(note.rest).toBeDefined();
      expect(note.pitch).toBeUndefined();
      expect(note.duration).toBe(4);
      expect(note.type).toBe("quarter");
    });

    it("should parse a <note> with <chord>", () => {
      const xml =
        "<note><chord/><pitch><step>E</step><octave>4</octave></pitch><duration>2</duration></note>";
      const element = createElement(xml);
      const note = mapNoteElement(element);
      expect(note.isChord).toBe(true);
      expect(note.pitch?.step).toBe("E");
    });

    it("should parse a <note> with <lyric>", () => {
      const xml =
        "<note><pitch><step>G</step><octave>4</octave></pitch><duration>4</duration><lyric><syllabic>single</syllabic><text>Hel</text></lyric><lyric><syllabic>begin</syllabic><text>lo</text></lyric></note>";
      const element = createElement(xml);
      const note = mapNoteElement(element);
      expect(note.lyrics).toBeDefined();
      expect(note.lyrics).toHaveLength(2);
      const lyric1 = note.lyrics?.[0] as Lyric;
      expect(lyric1.syllabic).toBe("single");
      expect(lyric1.text).toBe("Hel");
      const lyric2 = note.lyrics?.[1] as Lyric;
      expect(lyric2.syllabic).toBe("begin");
      expect(lyric2.text).toBe("lo");
    });

    it("should parse lyric attributes number, name, extend and elision", () => {
      const xml =
        '<note><pitch><step>C</step><octave>4</octave></pitch><duration>4</duration><lyric number="1" name="verse"><syllabic>single</syllabic><text>la</text><extend type="start"/><elision>_</elision></lyric></note>';
      const element = createElement(xml);
      const note = mapNoteElement(element);
      expect(note.lyrics).toBeDefined();
      expect(note.lyrics).toHaveLength(1);
      const lyric = note.lyrics?.[0] as Lyric;
      expect(lyric.number).toBe("1");
      expect(lyric.name).toBe("verse");
      expect(lyric.extend).toBeDefined();
      expect(lyric.extend?.type).toBe("start");
      expect(lyric.elision).toBeDefined();
      expect(lyric.elision?.text).toBe("_");
    });

    it("should parse a <note> with <beam> elements", () => {
      const xml =
        '<note><pitch><step>A</step><octave>4</octave></pitch><duration>1</duration><type>16th</type><beam number="1">begin</beam><beam number="2">begin</beam></note>';
      const element = createElement(xml);
      const note = mapNoteElement(element);
      expect(note.beams).toBeDefined();
      expect(note.beams).toHaveLength(2);
      const beam1 = note.beams?.[0] as Beam;
      expect(beam1.number).toBe(1);
      expect(beam1.value).toBe("begin");
      const beam2 = note.beams?.[1] as Beam;
      expect(beam2.number).toBe(2);
      expect(beam2.value).toBe("begin");
    });

    it("should parse a <note> with <notations> and <slur>", () => {
      const xml =
        '<note><pitch><step>D</step><octave>5</octave></pitch><duration>2</duration><notations><slur type="start" number="1" placement="above"/></notations></note>';
      const element = createElement(xml);
      const note = mapNoteElement(element);
      expect(note.notations).toBeDefined();
      expect(note.notations?.slurs).toBeDefined();
      expect(note.notations?.slurs).toHaveLength(1);
      const slur = note.notations?.slurs?.[0] as Slur;
      expect(slur.type).toBe("start");
      expect(slur.number).toBe(1);
      expect(slur.placement).toBe("above");
    });

    it("should parse a <note> with <accidental>", () => {
      const xml =
        "<note><pitch><step>F</step><alter>1</alter><octave>4</octave></pitch><duration>4</duration><accidental>sharp</accidental></note>";
      const element = createElement(xml);
      const note = mapNoteElement(element);
      expect(note.accidental).toBeDefined();
      expect(note.accidental?.value).toBe("sharp");
      expect(note.pitch?.alter).toBe(1);
    });

    it("should parse a <note> with <dot>", () => {
      const xml =
        "<note><pitch><step>G</step><octave>4</octave></pitch><duration>3</duration><type>eighth</type><dot/></note>";
      const element = createElement(xml);
      const note = mapNoteElement(element);
      expect(note.dots).toBeDefined();
      expect(note.dots).toHaveLength(1);
    });

    it('should parse a <note> with <grace slash="yes">', () => {
      const xml =
        '<note><grace slash="yes"/><pitch><step>A</step><octave>4</octave></pitch><type>eighth</type></note>';
      const element = createElement(xml);
      const note = mapNoteElement(element);
      expect(note.grace).toBeDefined();
      expect(note.grace?.slash).toBe("yes");
      expect(note.duration).toBeUndefined(); // Duration is often omitted for grace notes
    });

    it("should parse a <note> with <unpitched>", () => {
      const xml =
        "<note><unpitched><display-step>E</display-step><display-octave>4</display-octave></unpitched><duration>2</duration><type>eighth</type></note>";
      const element = createElement(xml);
      const note = mapNoteElement(element);
      expect(note.unpitched).toBeDefined();
      expect(note.unpitched?.displayStep).toBe("E");
      expect(note.unpitched?.displayOctave).toBe(4);
      expect(note.pitch).toBeUndefined();
    });

    it("should parse print-leger attribute on note", () => {
      const xml =
        '<note print-leger="no"><pitch><step>C</step><octave>6</octave></pitch><duration>1</duration></note>';
      const element = createElement(xml);
      const note = mapNoteElement(element);
      expect(note.printLeger).toBe("no");
    });

    it("maps articulations like tenuto and spiccato", () => {
      const xml =
        '<note><pitch><step>C</step><octave>4</octave></pitch><duration>1</duration><notations><articulations placement="above"><tenuto/><spiccato/></articulations></notations></note>';
      const element = createElement(xml);
      const note = mapNoteElement(element);
      expect(note.notations?.articulations).toBeDefined();
      const arts = note.notations?.articulations?.[0];
      expect(arts?.tenuto).toBeDefined();
      expect(arts?.spiccato).toBeDefined();
      expect(arts?.placement).toBe("above");
    });

    it("maps tied, tuplet, ornaments and technical elements", () => {
      const xml =
        '<note><pitch><step>D</step><octave>4</octave></pitch><duration>2</duration><notations><tied type="start"/><tuplet type="start" number="3"/><ornaments/><technical/></notations></note>';
      const element = createElement(xml);
      const note = mapNoteElement(element);
      expect(note.notations?.tied).toHaveLength(1);
      expect(note.notations?.tuplets).toHaveLength(1);
      expect(note.notations?.ornaments).toHaveLength(1);
      expect(note.notations?.technical).toHaveLength(1);
      expect(note.notations?.tuplets?.[0].number).toBe(3);
    });

    it("parses tuplets via <time-modification>", () => {
      const xml =
        '<note><pitch><step>C</step><octave>4</octave></pitch><duration>1</duration><time-modification><actual-notes>3</actual-notes><normal-notes>2</normal-notes><normal-type>eighth</normal-type><normal-dot/></time-modification></note>';
      const element = createElement(xml);
      const note = mapNoteElement(element);
      expect(note.timeModification).toBeDefined();
      expect(note.timeModification?.actualNotes).toBe(3);
      expect(note.timeModification?.normalNotes).toBe(2);
      expect(note.timeModification?.normalType).toBe("eighth");
      expect(note.timeModification?.normalDots).toHaveLength(1);
    });

    // TODO: Add tests for tie, time-modification, notations (articulations, ornaments, technical), etc.
  });
});
