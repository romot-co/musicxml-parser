import { describe, it, expect } from 'vitest';
import { parseMusicXmlString } from '../src/parser/xmlParser';
import { mapDocumentToScorePartwise } from '../src/parser/mappers';
import type { ScorePartwise } from '../src/types';

// Updated Sample MusicXML with <attributes> and <lyric>
const sampleMusicXml = `
<score-partwise version="3.1">
  <part-list>
    <score-part id="P1">
      <part-name>Music</part-name>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
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
        <pitch>
          <step>C</step>
          <octave>4</octave>
        </pitch>
        <duration>1</duration>
        <type>quarter</type>
        <lyric>
          <syllabic>single</syllabic>
          <text>Hel-</text>
        </lyric>
      </note>
      <note>
        <pitch>
          <step>D</step>
          <octave>4</octave>
        </pitch>
        <duration>1</duration>
        <type>quarter</type>
        <lyric>
          <syllabic>begin</syllabic>
          <text>lo</text>
        </lyric>
      </note>
      <note>
        <pitch>
          <step>E</step>
          <octave>4</octave>
        </pitch>
        <duration>1</duration>
        <type>quarter</type>
        <lyric>
          <syllabic>end</syllabic>
          <text>World!</text>
        </lyric>
      </note>
      <note>
        <rest/>
        <duration>1</duration>
        <type>quarter</type>
      </note>
    </measure>
  </part>
</score-partwise>
`;

describe('MusicXML Parser', () => {
  it('should parse a MusicXML string into a ScorePartwise object with attributes and lyrics', () => {
    const xmlDoc = parseMusicXmlString(sampleMusicXml);
    expect(xmlDoc).not.toBeNull();

    if (!xmlDoc) return; // Guard for type checking

    const scorePartwise = mapDocumentToScorePartwise(xmlDoc);
    expect(scorePartwise).toBeDefined();
    expect(scorePartwise.version).toBe('3.1');

    // Check part-list
    expect(scorePartwise.partList?.scoreParts).toHaveLength(1);
    expect(scorePartwise.partList?.scoreParts[0].id).toBe('P1');
    expect(scorePartwise.partList?.scoreParts[0].partName).toBe('Music');

    // Check part
    expect(scorePartwise.parts).toHaveLength(1);
    const part = scorePartwise.parts[0];
    expect(part.id).toBe('P1');
    expect(part.measures).toHaveLength(1);

    // Check measure
    const measure = part.measures[0];
    expect(measure.number).toBe('1');

    // Check attributes
    expect(measure.attributes).toBeDefined();
    expect(measure.attributes).toHaveLength(1);
    const attributes = measure.attributes?.[0];
    expect(attributes).toBeDefined();
    if (!attributes) return;

    expect(attributes.divisions).toBe(1);
    expect(attributes.key).toBeDefined();
    expect(attributes.key).toHaveLength(1);
    expect(attributes.key?.[0].fifths).toBe(0);
    expect(attributes.key?.[0].mode).toBe('major');

    expect(attributes.time).toBeDefined();
    expect(attributes.time).toHaveLength(1);
    expect(attributes.time?.[0].beats).toBe('4');
    expect(attributes.time?.[0]['beat-type']).toBe('4');

    expect(attributes.clef).toBeDefined();
    expect(attributes.clef).toHaveLength(1);
    expect(attributes.clef?.[0].sign).toBe('G');
    expect(attributes.clef?.[0].line).toBe(2);

    // Check notes
    expect(measure.notes).toHaveLength(4);

    // Note 1 (C4 with lyric "Hel-")
    const note1 = measure.notes[0];
    expect(note1.pitch?.step).toBe('C');
    expect(note1.pitch?.octave).toBe(4);
    expect(note1.duration).toBe(1);
    expect(note1.type).toBe('quarter');
    expect(note1.lyric).toBeDefined();
    expect(note1.lyric?.text).toBe('Hel-');
    expect(note1.lyric?.syllabic).toBe('single');

    // Note 2 (D4 with lyric "lo")
    const note2 = measure.notes[1];
    expect(note2.pitch?.step).toBe('D');
    expect(note2.pitch?.octave).toBe(4);
    expect(note2.duration).toBe(1);
    expect(note2.type).toBe('quarter');
    expect(note2.lyric).toBeDefined();
    expect(note2.lyric?.text).toBe('lo');
    expect(note2.lyric?.syllabic).toBe('begin');

    // Note 3 (E4 with lyric "World!")
    const note3 = measure.notes[2];
    expect(note3.pitch?.step).toBe('E');
    expect(note3.pitch?.octave).toBe(4);
    expect(note3.duration).toBe(1);
    expect(note3.type).toBe('quarter');
    expect(note3.lyric).toBeDefined();
    expect(note3.lyric?.text).toBe('World!');
    expect(note3.lyric?.syllabic).toBe('end');

    // Note 4 (Rest)
    const note4 = measure.notes[3];
    expect(note4.rest).toBeDefined();
    expect(note4.pitch).toBeUndefined();
    expect(note4.duration).toBe(1);
    expect(note4.type).toBe('quarter');
    expect(note4.lyric).toBeUndefined(); // No lyric for rest
  });
});
