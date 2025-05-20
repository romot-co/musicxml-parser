import { describe, it, expect } from "vitest";
import { mapNoteElement } from "../src/parser/mappers";
import type {
  Note,
  Pitch,
  Rest,
  Lyric,
  Beam,
  Slur,
  Tie,
  TimeModification,
} from "../src/types";
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

    it("parses a <beam> with color attribute", () => {
      const xml =
        '<note><pitch><step>A</step><octave>4</octave></pitch><duration>1</duration><type>16th</type><beam number="1" color="red">begin</beam></note>';
      const element = createElement(xml);
      const note = mapNoteElement(element);
      expect(note.beams).toBeDefined();
      expect(note.beams).toHaveLength(1);
      const beam = note.beams?.[0] as Beam;
      expect(beam.number).toBe(1);
      expect(beam.value).toBe("begin");
      expect(beam.color).toBe("red");
    });

    it("parses beam repeater and fan attributes", () => {
      const xml =
        '<note><pitch><step>A</step><octave>4</octave></pitch><duration>1</duration><type>16th</type><beam number="1" repeater="yes" fan="accel">begin</beam></note>';
      const element = createElement(xml);
      const note = mapNoteElement(element);
      const beam = note.beams?.[0] as Beam;
      expect(beam.repeater).toBe("yes");
      expect(beam.fan).toBe("accel");
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

    it("parses slur with orientation, color, line-type, and bezier attributes", () => {
      const xml =
        '<note><pitch><step>E</step><octave>4</octave></pitch><duration>4</duration><notations><slur type="start" orientation="over" color="red" line-type="dashed" bezier-x="1" bezier-y="2" bezier-x2="3" bezier-y2="4" bezier-offset="5" bezier-offset2="6"/></notations></note>';
      const el = createElement(xml);
      const note = mapNoteElement(el);
      const slur = note.notations?.slurs?.[0] as Slur;
      expect(slur.orientation).toBe("over");
      expect(slur.color).toBe("red");
      expect(slur.lineType).toBe("dashed");
      expect(slur.bezierX).toBe(1);
      expect(slur.bezierY).toBe(2);
      expect(slur.bezierX2).toBe(3);
      expect(slur.bezierY2).toBe(4);
      expect(slur.bezierOffset).toBe(5);
      expect(slur.bezierOffset2).toBe(6);
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

    it("parses accidental attributes parentheses, bracket and size", () => {
      const xml =
        '<note><pitch><step>C</step><octave>4</octave></pitch><duration>1</duration><accidental parentheses="yes" bracket="no" size="cue">natural</accidental></note>';
      const element = createElement(xml);
      const note = mapNoteElement(element);
      expect(note.accidental).toBeDefined();
      const acc = note.accidental!;
      expect(acc.value).toBe("natural");
      expect(acc.parentheses).toBe("yes");
      expect(acc.bracket).toBe("no");
      expect(acc.size).toBe("cue");
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

    it("parses <soft-accent> articulation", () => {
      const xml =
        '<note><pitch><step>C</step><octave>4</octave></pitch><duration>1</duration><notations><articulations><soft-accent placement="below"/></articulations></notations></note>';
      const el = createElement(xml);
      const note = mapNoteElement(el);
      const art = note.notations?.articulations?.[0];
      expect(art?.softAccent).toHaveLength(1);
      expect(art?.softAccent?.[0].placement).toBe("below");
    });

    it("parses <other-articulation> with smufl attribute", () => {
      const xml =
        '<note><pitch><step>C</step><octave>4</octave></pitch><duration>1</duration><notations><articulations><other-articulation smufl="accDoitAbove">doit</other-articulation></articulations></notations></note>';
      const el = createElement(xml);
      const note = mapNoteElement(el);
      const art = note.notations?.articulations?.[0];
      expect(art?.otherArticulations).toHaveLength(1);
      expect(art?.otherArticulations?.[0].smufl).toBe("accDoitAbove");
      expect(art?.otherArticulations?.[0].value).toBe("doit");
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

    it("parses glissando, slide, tremolo and other-notation", () => {
      const xml =
        '<note><pitch><step>E</step><octave>5</octave></pitch><duration>1</duration><notations><glissando type="start">gliss</glissando><slide type="stop"/><tremolo type="single">3</tremolo><other-notation type="single">x</other-notation></notations></note>';
      const element = createElement(xml);
      const note = mapNoteElement(element);
      expect(note.notations?.glissandos).toHaveLength(1);
      expect(note.notations?.slides).toHaveLength(1);
      expect(note.notations?.tremolos).toHaveLength(1);
      expect(note.notations?.otherNotations).toHaveLength(1);
      expect(note.notations?.glissandos?.[0].type).toBe("start");
      expect(note.notations?.slides?.[0].type).toBe("stop");
      expect(note.notations?.tremolos?.[0].value).toBe(3);
      expect(note.notations?.otherNotations?.[0].type).toBe("single");
    });

    it("parses glissando with attributes", () => {
      const xml =
        '<note><pitch><step>C</step><octave>4</octave></pitch><duration>1</duration><notations><glissando type="start" orientation="over" line-type="dashed" dash-length="1" space-length="2" default-x="3" default-y="4" relative-x="0.5" relative-y="-0.5" color="blue" accelerate="yes" beats="6" first-beat="20" last-beat="80">gliss</glissando></notations></note>';
      const el = createElement(xml);
      const note = mapNoteElement(el);
      const gl = note.notations?.glissandos?.[0]!;
      expect(gl.orientation).toBe("over");
      expect(gl.lineType).toBe("dashed");
      expect(gl.dashLength).toBe(1);
      expect(gl.spaceLength).toBe(2);
      expect(gl.defaultX).toBe(3);
      expect(gl.defaultY).toBe(4);
      expect(gl.relativeX).toBe(0.5);
      expect(gl.relativeY).toBe(-0.5);
      expect(gl.color).toBe("blue");
      expect(gl.accelerate).toBe("yes");
      expect(gl.beats).toBe(6);
      expect(gl.firstBeat).toBe(20);
      expect(gl.lastBeat).toBe(80);
    });

    it("parses slide with bend-sound attributes", () => {
      const xml =
        '<note><pitch><step>C</step><octave>4</octave></pitch><duration>1</duration><notations><slide type="stop" line-type="wavy" dash-length="1.2" space-length="0.8" accelerate="no" beats="5" first-beat="10" last-beat="90" default-x="1" default-y="-1" relative-x="0" relative-y="0.2" color="red" orientation="under"/></notations></note>';
      const el = createElement(xml);
      const note = mapNoteElement(el);
      const slide = note.notations?.slides?.[0]!;
      expect(slide.type).toBe("stop");
      expect(slide.lineType).toBe("wavy");
      expect(slide.dashLength).toBe(1.2);
      expect(slide.spaceLength).toBe(0.8);
      expect(slide.accelerate).toBe("no");
      expect(slide.beats).toBe(5);
      expect(slide.firstBeat).toBe(10);
      expect(slide.lastBeat).toBe(90);
      expect(slide.defaultX).toBe(1);
      expect(slide.defaultY).toBe(-1);
      expect(slide.relativeX).toBe(0);
      expect(slide.relativeY).toBe(0.2);
      expect(slide.color).toBe("red");
      expect(slide.orientation).toBe("under");
    });

    it("parses tuplets via <time-modification>", () => {
      const xml =
        "<note><pitch><step>C</step><octave>4</octave></pitch><duration>1</duration><time-modification><actual-notes>3</actual-notes><normal-notes>2</normal-notes><normal-type>eighth</normal-type><normal-dot/></time-modification></note>";
      const element = createElement(xml);
      const note = mapNoteElement(element);
      expect(note.timeModification).toBeDefined();
      expect(note.timeModification?.actualNotes).toBe(3);
      expect(note.timeModification?.normalNotes).toBe(2);
      expect(note.timeModification?.normalType).toBe("eighth");
      expect(note.timeModification?.normalDots).toHaveLength(1);
    });

    it("parses tie elements at the note level", () => {
      const xml =
        '<note><pitch><step>C</step><octave>4</octave></pitch><duration>4</duration><tie type="start"/><tie type="stop"/></note>';
      const element = createElement(xml);
      const note = mapNoteElement(element);
      expect(note.ties).toBeDefined();
      expect(note.ties).toHaveLength(2);
      const [t1, t2] = note.ties as Tie[];
      expect(t1.type).toBe("start");
      expect(t2.type).toBe("stop");
    });

    it("throws on tie without type attribute", () => {
      const xml =
        "<note><pitch><step>C</step><octave>4</octave></pitch><duration>4</duration><tie/></note>";
      const element = createElement(xml);
      expect(() => mapNoteElement(element)).toThrow();
    });

    it("parses minimal <time-modification>", () => {
      const xml =
        "<note><pitch><step>A</step><octave>4</octave></pitch><duration>2</duration><time-modification><actual-notes>5</actual-notes><normal-notes>4</normal-notes></time-modification></note>";
      const element = createElement(xml);
      const note = mapNoteElement(element);
      const tm = note.timeModification as TimeModification;
      expect(tm.actualNotes).toBe(5);
      expect(tm.normalNotes).toBe(4);
      expect(tm.normalType).toBeUndefined();
      expect(tm.normalDots).toBeUndefined();
    });

    it("parses multiple normal-dot elements in <time-modification>", () => {
      const xml =
        "<note><pitch><step>B</step><octave>4</octave></pitch><duration>1</duration><time-modification><actual-notes>3</actual-notes><normal-notes>2</normal-notes><normal-dot/><normal-dot/></time-modification></note>";
      const element = createElement(xml);
      const note = mapNoteElement(element);
      expect(note.timeModification?.normalDots).toHaveLength(2);
    });

    it("parses complex notations with articulations, ornaments and technical", () => {
      const xml =
        '<note><pitch><step>E</step><octave>4</octave></pitch><duration>1</duration><notations><articulations placement="below"><accent/><staccato/></articulations><articulations><tenuto/></articulations><ornaments/><technical/></notations></note>';
      const element = createElement(xml);
      const note = mapNoteElement(element);
      expect(note.notations?.articulations).toHaveLength(2);
      const art1 = note.notations?.articulations?.[0];
      const art2 = note.notations?.articulations?.[1];
      expect(art1?.accent).toBeDefined();
      expect(art1?.staccato).toBeDefined();
      expect(art1?.placement).toBe("below");
      expect(art2?.tenuto).toBeDefined();
      expect(note.notations?.ornaments).toHaveLength(1);
      expect(note.notations?.technical).toHaveLength(1);
    });

    it("parses ornament details", () => {
      const xml =
        '<note><pitch><step>C</step><octave>4</octave></pitch><duration>1</duration><notations><ornaments><trill-mark accelerate="yes" beats="2"/><mordent long="yes"/><wavy-line type="start"/><other-ornament smufl="ornamentHaydn">h</other-ornament><accidental-mark>sharp</accidental-mark></ornaments></notations></note>';
      const element = createElement(xml);
      const note = mapNoteElement(element);
      const orn = note.notations?.ornaments?.[0];
      expect(orn).toBeDefined();
      expect(orn?.trillMarks?.[0].accelerate).toBe("yes");
      expect(orn?.trillMarks?.[0].beats).toBe(2);
      expect(orn?.mordents?.[0].long).toBe("yes");
      expect(orn?.wavyLines?.[0].type).toBe("start");
      expect(orn?.otherOrnaments?.[0].smufl).toBe("ornamentHaydn");
      expect(orn?.accidentalMarks?.[0].value).toBe("sharp");
    });

    it("parses wavy-line attributes", () => {
      const xml =
        '<note><pitch><step>C</step><octave>4</octave></pitch><duration>1</duration><notations><ornaments><wavy-line type="start" accelerate="yes" beats="3" second-beats="1" last-beat="2" smufl="wiggleSawtooth"/></ornaments></notations></note>';
      const element = createElement(xml);
      const note = mapNoteElement(element);
      const wavy = note.notations?.ornaments?.[0]?.wavyLines?.[0];
      expect(wavy?.accelerate).toBe("yes");
      expect(wavy?.beats).toBe(3);
      expect(wavy?.secondBeats).toBe(1);
      expect(wavy?.lastBeat).toBe(2);
      expect(wavy?.smufl).toBe("wiggleSawtooth");
    });

    it("parses technical notation details", () => {
      const xml =
        '<note><pitch><step>D</step><octave>4</octave></pitch><duration>1</duration><notations><technical><up-bow/><fingering substitution="yes">1</fingering><string>2</string><hammer-on type="start" number="1"/><bend><bend-alter>1</bend-alter><release/></bend></technical></notations></note>';
      const element = createElement(xml);
      const note = mapNoteElement(element);
      const tech = note.notations?.technical?.[0];
      expect(tech).toBeDefined();
      expect(tech?.upBows?.length).toBe(1);
      expect(tech?.fingerings?.[0].substitution).toBe("yes");
      expect(tech?.strings?.[0].value).toBe(2);
      expect(tech?.hammerOns?.[0].type).toBe("start");
      expect(tech?.bends?.[0].release).toBe(true);
    });

    it("parses tremolo placement and smufl", () => {
      const xml =
        '<note><pitch><step>E</step><octave>5</octave></pitch><duration>1</duration><notations><tremolo type="single" placement="above" smufl="tremoloUnmeasured">3</tremolo></notations></note>';
      const element = createElement(xml);
      const note = mapNoteElement(element);
      const trem = note.notations?.tremolos?.[0];
      expect(trem?.placement).toBe("above");
      expect(trem?.smufl).toBe("tremoloUnmeasured");
    });

    it("parses bend sound attributes", () => {
      const xml =
        '<note><pitch><step>A</step><octave>4</octave></pitch><duration>1</duration><notations><technical><bend accelerate="yes" beats="6" first-beat="30" last-beat="70"><bend-alter>1</bend-alter></bend></technical></notations></note>';
      const element = createElement(xml);
      const note = mapNoteElement(element);
      const bend = note.notations?.technical?.[0]?.bends?.[0];
      expect(bend?.accelerate).toBe("yes");
      expect(bend?.beats).toBe(6);
      expect(bend?.firstBeat).toBe(30);
      expect(bend?.lastBeat).toBe(70);
    });

    it("maps instrument and print-object on note", () => {
      const xml =
        '<note print-object="no"><instrument id="P1-I1"/>\n<pitch><step>C</step><octave>4</octave></pitch><duration>1</duration></note>';
      const element = createElement(xml);
      const note = mapNoteElement(element);
      expect(note.instrument).toBe("P1-I1");
      expect(note.printObject).toBe("no");
    });
  });
});
