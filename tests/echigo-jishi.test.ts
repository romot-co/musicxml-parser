import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { parseMusicXmlString } from '../src/parser/xmlParser';
import { mapDocumentToScorePartwise } from '../src/parser/mappers';
import type { ScorePartwise, CreditWords, Measure, Note, Attributes, Direction } from '../src/types';
import { NoteSchema, AttributesSchema, DirectionSchema } from '../src/schemas';

const filePath = path.resolve(__dirname, '../reference/xmlsamples/Echigo-Jishi.musicxml');

// Helper functions to extract elements from Measure content
function getNotesFromContent(content: Measure['content'] | undefined): Note[] {
  if (!content) return [];
  return content.filter((item): item is Note => (item as any)._type === 'note' && NoteSchema.safeParse(item).success);
}

function getAttributesFromContent(content: Measure['content'] | undefined): Attributes[] {
  if (!content) return [];
  return content.filter((item): item is Attributes => (item as any)._type === 'attributes' && AttributesSchema.safeParse(item).success);
}

function getDirectionsFromContent(content: Measure['content'] | undefined): Direction[] {
  if (!content) return [];
  return content.filter((item): item is Direction => (item as any)._type === 'direction' && DirectionSchema.safeParse(item).success);
}

describe('Echigo-Jishi.musicxml Parser Test', () => {
  let scorePartwise: ScorePartwise | null = null;

  // Read and parse the file once before running the tests
  try {
    const xmlString = fs.readFileSync(filePath, 'utf-8');
    const xmlDoc = parseMusicXmlString(xmlString);
    if (xmlDoc) {
      scorePartwise = mapDocumentToScorePartwise(xmlDoc);
    }
  } catch (e) {
    console.error(`Failed to read or parse Echigo-Jishi.musicxml: ${(e as Error).message}`);
    scorePartwise = null; // Ensure it's null if parsing fails
  }

  it('should parse the file without errors', () => {
    expect(scorePartwise).not.toBeNull();
    if (!scorePartwise) return; // Guard for type checking
    expect(scorePartwise.version).toBe('4.0'); // As per the file content
  });

  it('should parse movement-title correctly', () => {
    if (!scorePartwise) throw new Error('scorePartwise is null');
    expect(scorePartwise.movementTitle).toBe('越後獅子');
  });

  it('should parse identification creators and rights', () => {
    if (!scorePartwise) throw new Error('scorePartwise is null');
    expect(scorePartwise.identification).toBeDefined();
    const id = scorePartwise.identification;
    expect(id?.creators).toBeDefined();
    expect(id?.creators).toHaveLength(2);
    expect(id?.creators?.find(c => c.type === 'arranger' && c.name === 'Y. Nagai')).toBeDefined();
    expect(id?.creators?.find(c => c.type === 'arranger' && c.name === 'K. Kobatake')).toBeDefined();
    expect(id?.rights).toBeDefined();
    expect(id?.rights).toHaveLength(1); // Assuming single rights entry based on current schema for multiple rights
    expect(id?.rights?.[0].text).toBe('Transcription donated to the public domain, 2005 by Tom Potter');
  });
  
  it('should parse encoding information', () => {
    if (!scorePartwise) throw new Error('scorePartwise is null');
    expect(scorePartwise.identification?.encoding).toBeDefined();
    const encoding = scorePartwise.identification?.encoding;
    expect(encoding?.software).toBeDefined();
    expect(encoding?.software).toContain('Finale v27.0 for Mac');
    expect(encoding?.['encoding-date']).toBeDefined();
    expect(encoding?.['encoding-date']).toContain('2021-06-04');
    // Note: <supports> elements are not currently in EncodingSchema, so not tested here.
  });

  it('should parse defaults scaling', () => {
    if (!scorePartwise) throw new Error('scorePartwise is null');
    expect(scorePartwise.defaults).toBeDefined();
    expect(scorePartwise.defaults?.scaling).toBeDefined();
    expect(scorePartwise.defaults?.scaling?.millimeters).toBe(7.2319);
    expect(scorePartwise.defaults?.scaling?.tenths).toBe(40);
  });

  it('should parse defaults page-layout (basic check)', () => {
    if (!scorePartwise) throw new Error('scorePartwise is null');
    expect(scorePartwise.defaults?.pageLayout).toBeDefined();
    // Current PageLayoutSchema is {}, so not much to test yet.
    // Add more specific tests when PageLayoutSchema is detailed.
    // Example: expect(scorePartwise.defaults?.pageLayout?.pageHeight).toBe(1545);
  });
  
  it('should parse defaults system-layout (basic check)', () => {
    if (!scorePartwise) throw new Error('scorePartwise is null');
    expect(scorePartwise.defaults?.systemLayout).toBeDefined();
    // Current SystemLayoutSchema is {}, so not much to test yet.
    // Example: expect(scorePartwise.defaults?.systemLayout?.systemDistance).toBe(93);
  });
  
  it('should parse defaults appearance (basic check)', () => {
    if (!scorePartwise) throw new Error('scorePartwise is null');
    expect(scorePartwise.defaults?.appearance).toBeDefined();
    // Current AppearanceSchema is {}, so not much to test yet.
    // Example: const stemLineWidth = scorePartwise.defaults?.appearance?.lineWidths?.find(lw => lw.type === 'stem');
    // expect(stemLineWidth?.value).toBe(1.4583); 
  });

  it('should parse defaults fonts and language', () => {
    if (!scorePartwise) throw new Error('scorePartwise is null');
    expect(scorePartwise.defaults?.musicFont).toBeDefined();
    expect(scorePartwise.defaults?.musicFont?.fontFamily).toBe('Maestro,engraved');
    expect(scorePartwise.defaults?.musicFont?.fontSize).toBe('20.5');

    expect(scorePartwise.defaults?.wordFont).toBeDefined();
    expect(scorePartwise.defaults?.wordFont?.fontFamily).toBe('Times New Roman');
    expect(scorePartwise.defaults?.wordFont?.fontSize).toBe('10.25');
    
    expect(scorePartwise.defaults?.lyricFonts).toBeDefined();
    expect(scorePartwise.defaults?.lyricFonts).toHaveLength(1);
    expect(scorePartwise.defaults?.lyricFonts?.[0].fontFamily).toBe('ＭＳ ゴシック');
    expect(scorePartwise.defaults?.lyricFonts?.[0].fontSize).toBe('10.25');

    expect(scorePartwise.defaults?.lyricLanguages).toBeDefined();
    expect(scorePartwise.defaults?.lyricLanguages).toHaveLength(1);
    expect(scorePartwise.defaults?.lyricLanguages?.[0].xmlLang).toBe('ja');
  });

  it('should parse credit elements', () => {
    if (!scorePartwise) throw new Error('scorePartwise is null');
    expect(scorePartwise.credit).toBeDefined();
    expect(scorePartwise.credit?.length).toBeGreaterThanOrEqual(5); // There are 5 credit elements in the sample

    const titleCredit = scorePartwise.credit?.find(c => c.creditTypes?.includes('title') && (c.creditWords?.[0]?.text === '越後獅子'));
    expect(titleCredit).toBeDefined();
    expect(titleCredit?.page).toBe('1');
    expect(titleCredit?.creditWords?.[0].formatting?.defaultX).toBe(607);
    expect(titleCredit?.creditWords?.[0].formatting?.defaultY).toBe(1443);
    expect(titleCredit?.creditWords?.[0].formatting?.fontFamily).toBe('ＭＳ ゴシック');
    expect(titleCredit?.creditWords?.[0].formatting?.fontSize).toBe('24');
    expect(titleCredit?.creditWords?.[0].formatting?.fontWeight).toBe('bold');
    expect(titleCredit?.creditWords?.[0].formatting?.justify).toBe('center');
    expect(titleCredit?.creditWords?.[0].formatting?.valign).toBe('top');
    // xml:lang is not directly in CreditWordsSchema.textFormatting, but on credit-words element itself.
    // Our current schema/mapper for credit-words doesn't capture xml:lang on credit-words directly.

    const arrangerCredit = scorePartwise.credit?.find(c => c.creditTypes?.includes('arranger'));
    expect(arrangerCredit).toBeDefined();
    expect(arrangerCredit?.creditWords?.[0].text).toBe('Arr. Y. Nagai , K. Kobatake');
    expect(arrangerCredit?.creditWords?.[0].formatting?.defaultX).toBe(1124);
    expect(arrangerCredit?.creditWords?.[0].formatting?.justify).toBe('right');

    const rightsCredit = scorePartwise.credit?.find(c => c.creditTypes?.includes('rights'));
    expect(rightsCredit).toBeDefined();
    expect(rightsCredit?.creditWords?.[0].text).toBe('Transcription donated to the public domain, 2005 by Tom Potter');
    expect(rightsCredit?.creditWords?.[0].formatting?.justify).toBe('center');
  });
  
  it('should parse part-list and score-part (basic check)', () => {
    if (!scorePartwise) throw new Error('scorePartwise is null');
    expect(scorePartwise.partList).toBeDefined();
    expect(scorePartwise.partList.scoreParts).toHaveLength(1);
    const scorePart = scorePartwise.partList.scoreParts[0];
    expect(scorePart.id).toBe('P1');
    // expect(scorePart.partName).toBe('MusicXML Part'); // print-object="no"
    // TODO: Add checks for score-instrument, midi-instrument when their schemas are more complete
  });
  
  it('should parse a specific measure and its contents (Measure 1)', () => {
    if (!scorePartwise) throw new Error('scorePartwise is null');
    expect(scorePartwise.parts).toHaveLength(1);
    const part = scorePartwise.parts[0];
    expect(part.measures).toBeDefined();
    const measure1 = part.measures.find(m => m.number === '1');
    expect(measure1).toBeDefined();
    if (!measure1) return;

    expect(measure1.width).toBe(225); // Check measure attribute

    // Check <print> element - Not fully implemented in schema/mappers yet
    // expect(measure1.print).toBeDefined(); 
    
    const attributesArray = getAttributesFromContent(measure1.content);
    expect(attributesArray).toBeDefined();
    expect(attributesArray).toHaveLength(1);
    const attrs = attributesArray[0];
    expect(attrs?.divisions).toBe(8);
    expect(attrs?.key?.[0].fifths).toBe(0);
    expect(attrs?.time?.[0].beats).toBe('2');
    expect(attrs?.time?.[0]['beat-type']).toBe('4');
    expect(attrs?.clef?.[0].sign).toBe('G');

    // Check <direction> elements - Partially implemented
    const directionsArray = getDirectionsFromContent(measure1.content);
    expect(directionsArray).toBeDefined();
    expect(directionsArray.length).toBeGreaterThanOrEqual(2);
    
    const allegroDirection = directionsArray.find(d => d.direction_type?.[0]?.words?.text === 'Allegro');
    expect(allegroDirection).toBeDefined();
    expect(allegroDirection?.placement).toBe('above');
    expect(allegroDirection?.direction_type?.[0].words?.formatting?.fontWeight).toBe('bold'); // Assuming words has formatting in your schema
    // expect(allegroDirection?.sound?.tempo).toBe(92); // <sound> not fully mapped yet

    // const dynamicsDirection = directionsArray.find(d => d.direction_type?.[0]?.dynamics?.value === 'f');
    // expect(dynamicsDirection).toBeDefined(); // Depends on DynamicsSchema

    const notesArray = getNotesFromContent(measure1.content);
    expect(notesArray).toBeDefined();
    expect(notesArray).toHaveLength(4);
    const note1 = notesArray[0];
    expect(note1?.pitch?.step).toBe('A');
    expect(note1?.pitch?.octave).toBe(4);
    expect(note1?.duration).toBe(4);
    expect(note1?.type).toBe('eighth');
    expect(note1?.stem).toBe('up');
    expect(note1?.beams?.[0]?.value).toBe('begin');
  });

  // Add more tests for other measures, lyrics, slurs, accidentals, etc.
  // For example, testing measure 11 for lyrics:
  it('should parse lyrics in Measure 11', () => {
    if (!scorePartwise) throw new Error('scorePartwise is null');
    const measure11 = scorePartwise.parts[0].measures.find(m => m.number === '11');
    expect(measure11).toBeDefined();
    if (!measure11) return;
    const notesInMeasure11 = getNotesFromContent(measure11.content);
    const noteWithLyric = notesInMeasure11.find(n => n.lyrics && n.lyrics.length > 0);
    expect(noteWithLyric).toBeDefined();
    expect(noteWithLyric?.lyrics?.[0].text).toBe('オノ');
  });

}); 