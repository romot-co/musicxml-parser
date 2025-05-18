import { parseMusicXmlString, mapDocumentToScorePartwise } from '../src/parser';
import { ScorePartwise } from '../src/types';

const sampleMusicXml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="4.0">
  <part-list>
    <score-part id="P1">
      <part-name>Test Part</part-name>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key><fifths>0</fifths></key>
        <time><beats>4</beats><beat-type>4</beat-type></time>
        <clef><sign>G</sign><line>2</line></clef>
      </attributes>
      <note>
        <pitch>
          <step>C</step>
          <octave>4</octave>
        </pitch>
        <duration>4</duration>
        <type>whole</type>
      </note>
    </measure>
  </part>
</score-partwise>
`;

describe('MusicXML Parser - Core Functionality', () => {
  it('should parse a simple MusicXML string and map it to ScorePartwise object', () => {
    // 1. Parse XML string to Document
    // With testEnvironment: 'jsdom', DOMParser should be available globally.
    const doc = parseMusicXmlString(sampleMusicXml);
    
    expect(doc).not.toBeNull();
    if (!doc) return; // Type guard

    // 2. Map Document to ScorePartwise object
    const scorePartwise = mapDocumentToScorePartwise(doc);

    // 3. Assertions
    expect(scorePartwise).not.toBeNull();
    if (!scorePartwise) return; // Type guard

    expect(scorePartwise.version).toBe("4.0");

    // Check part-list
    expect(scorePartwise.partList).toBeDefined();
    expect(scorePartwise.partList.scoreParts).toHaveLength(1);
    const firstScorePart = scorePartwise.partList.scoreParts[0];
    expect(firstScorePart.id).toBe("P1");
    expect(firstScorePart.partName).toBe("Test Part");

    // Check parts
    expect(scorePartwise.parts).toHaveLength(1);
    const firstPart = scorePartwise.parts[0];
    expect(firstPart.id).toBe("P1");

    // Check measures in the first part
    expect(firstPart.measures).toHaveLength(1);
    const firstMeasure = firstPart.measures[0];
    expect(firstMeasure.number).toBe("1");

    // Check attributes (currently a placeholder, so expect an empty object or passthrough)
    expect(firstMeasure.attributes).toBeDefined();
    // If AttributesSchemaPlaceholder is z.object({}).passthrough(), it might be an empty object if no known fields were mapped.
    // If it had specific fields that were mapped, test for those.
    // expect(Object.keys(firstMeasure.attributes!).length).toBeGreaterThan(0); // Example if some attributes were mapped

    // Check notes in the first measure
    expect(firstMeasure.notes).toHaveLength(1);
    const firstNote = firstMeasure.notes[0];
    expect(firstNote.pitch).toBeDefined();
    expect(firstNote.pitch?.step).toBe("C");
    expect(firstNote.pitch?.octave).toBe(4);
    expect(firstNote.duration).toBe(4);
    expect(firstNote.type).toBe("whole");
    expect(firstNote.rest).toBeUndefined();
  });
}); 