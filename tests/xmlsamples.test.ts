import { describe, it, expect, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { parseMusicXmlString } from '../src/parser/xmlParser';
import { mapDocumentToScorePartwise } from '../src/parser/mappers';
import type { Measure, Note, Attributes } from '../src/types';
import { NoteSchema, AttributesSchema } from '../src/schemas';

const samplesDir = path.resolve(__dirname, '../reference/xmlsamples');
const sampleFiles = fs
  .readdirSync(samplesDir)
  .filter(
    f =>
      f.endsWith('.musicxml') &&
      !['MozaChloSample.musicxml', 'MozaVeilSample.musicxml'].includes(f),
  );

function getNotesFromContent(content: Measure['content'] | undefined): Note[] {
  if (!content) return [];
  return content.filter((item): item is Note => (item as any)._type === 'note' && NoteSchema.safeParse(item).success);
}

function getAttributesFromContent(content: Measure['content'] | undefined): Attributes[] {
  if (!content) return [];
  return content.filter((item): item is Attributes => (item as any)._type === 'attributes' && AttributesSchema.safeParse(item).success);
}

describe('Reference MusicXML sample parsing', () => {
  for (const file of sampleFiles) {
    it(`parses ${file} without mapping errors`, () => {
      const xmlString = fs.readFileSync(path.join(samplesDir, file), 'utf-8');
      const xmlDoc = parseMusicXmlString(xmlString);
      expect(xmlDoc).not.toBeNull();
      if (!xmlDoc) return;
      const spy = vi.spyOn(console, 'error');
      const score = mapDocumentToScorePartwise(xmlDoc);
      expect(score).toBeDefined();
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });
  }
});

describe('Specific feature checks from samples', () => {
  it('Saltarello.musicxml contains slur notation', () => {
    const xmlString = fs.readFileSync(path.join(samplesDir, 'Saltarello.musicxml'), 'utf-8');
    const xmlDoc = parseMusicXmlString(xmlString);
    if (!xmlDoc) throw new Error('Saltarello.musicxml failed to parse');
    const score = mapDocumentToScorePartwise(xmlDoc);
    const part = score.parts[0];
    const noteWithSlur = part.measures.flatMap(m => getNotesFromContent(m.content)).find(n => n.notations?.slurs?.some(s => s.type === 'start'));
    expect(noteWithSlur).toBeDefined();
  });

  it('MozartTrio.musicxml contains transpose information', () => {
    const xmlString = fs.readFileSync(path.join(samplesDir, 'MozartTrio.musicxml'), 'utf-8');
    const xmlDoc = parseMusicXmlString(xmlString);
    if (!xmlDoc) throw new Error('MozartTrio.musicxml failed to parse');
    const score = mapDocumentToScorePartwise(xmlDoc);
    const measureWithTranspose = score.parts[0].measures.find(m => getAttributesFromContent(m.content).some(a => a.transpose));
    expect(measureWithTranspose).toBeDefined();
    const transpose = getAttributesFromContent(measureWithTranspose!.content).find(a => a.transpose)?.transpose;
    expect(transpose?.chromatic).toBe(-3);
  });

  it('DebuMandSample.musicxml maps staccato articulations', () => {
    const xmlString = fs.readFileSync(path.join(samplesDir, 'DebuMandSample.musicxml'), 'utf-8');
    const xmlDoc = parseMusicXmlString(xmlString);
    if (!xmlDoc) throw new Error('DebuMandSample.musicxml failed to parse');
    const score = mapDocumentToScorePartwise(xmlDoc);
    const noteWithStaccato = score.parts[0].measures.flatMap(m => getNotesFromContent(m.content)).find(n => n.notations?.articulations?.some(a => a.staccato));
    expect(noteWithStaccato).toBeDefined();
  });
});
