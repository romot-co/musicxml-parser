import { z } from 'zod';
import type {
  Pitch,
  Rest,
  Note,
  Measure,
  Part,
  ScorePart,
  PartList,
  ScorePartwise,
  Key,
  Time,
  Clef,
  Attributes,
} from '../types';
import {
  PitchSchema,
  NoteSchema,
  MeasureSchema,
  PartSchema,
  ScorePartSchema,
  PartListSchema,
  ScorePartwiseSchema,
  KeySchema,
  TimeSchema,
  ClefSchema,
  AttributesSchema,
} from '../schemas';

// Helper function to get text content of a child element
export const getTextContent = (
  element: Element,
  tagName: string,
): string | undefined => {
  const child = element.querySelector(tagName);
  return child?.textContent?.trim() || undefined;
};

// Helper function to parse numeric content of a child element
export const parseNumberContent = (
  element: Element,
  tagName: string,
): number | undefined => {
  const textContent = getTextContent(element, tagName);
  if (textContent === undefined) {
    return undefined;
  }
  const num = parseInt(textContent, 10);
  return isNaN(num) ? undefined : num;
};

// Helper function to get an attribute value
export const getAttribute = (
  element: Element,
  attributeName: string,
): string | undefined => {
  return element.getAttribute(attributeName) || undefined;
};

// Helper function to get a numeric attribute value, or undefined if not present or not a number
const parseOptionalNumberAttribute = (element: Element, attributeName: string): number | undefined => {
  const value = element.getAttribute(attributeName);
  if (value === null) {
    return undefined;
  }
  const num = parseInt(value, 10);
  return isNaN(num) ? undefined : num;
};

// Mapper for <pitch> element
export const mapPitchElement = (element: Element): Pitch => {
  const pitchData = {
    step: getTextContent(element, 'step') ?? 'C',
    octave: parseNumberContent(element, 'octave') ?? 4,
    alter: parseNumberContent(element, 'alter'),
  };
  return PitchSchema.parse(pitchData);
};

// Mapper for <rest> element (within a <note>)
// Note: Rest is identified by the absence of <pitch> and presence of <rest> inside <note>
// This function is more of a conceptual placeholder if we were to map a standalone <rest> tag
// which is not typical in note-based contexts. The logic is handled in mapNoteElement.

// Mapper for <note> element
export const mapNoteElement = (element: Element): Note => {
  const duration = parseNumberContent(element, 'duration');
  const type = getTextContent(element, 'type');
  const pitchElement = element.querySelector('pitch');
  const restElement = element.querySelector('rest');
  const lyricElement = element.querySelector('lyric');

  let noteData: Partial<Note> = {
    duration: duration ?? 1, // Default duration if not specified
    type: type,
  };

  if (pitchElement) {
    noteData.pitch = mapPitchElement(pitchElement);
  } else if (restElement) {
    noteData.rest = {
      // MusicXML <rest> elements don't have complex children like <display-step> by default in simple cases
      // but Zod schema allows for it if needed. For now, an empty object or specific rest attributes.
      // measure: getAttribute(restElement, 'measure') === 'yes' ? true : undefined, // Example attribute
    };
  } else {
    // Neither pitch nor rest, could be an error or an unhandled note type
    // For now, we'll rely on Zod validation to catch this if schema requires one.
  }

  if (lyricElement) {
    noteData.lyric = {
      text: getTextContent(lyricElement, 'text') ?? '',
      syllabic: getTextContent(lyricElement, 'syllabic'),
    };
  }

  try {
    return NoteSchema.parse(noteData);
  } catch (e) {
    console.error('Failed to parse note:', JSON.stringify(noteData, null, 2));
    console.error('Validation errors:', (e as z.ZodError).errors);
    throw e;
  }
};

// Helper function to map a <key> element
const mapKeyElement = (element: Element): Key => {
  const keyData = {
    fifths: parseNumberContent(element, 'fifths') ?? 0,
    mode: getTextContent(element, 'mode'),
  };
  return KeySchema.parse(keyData);
};

// Helper function to map a <time> element
const mapTimeElement = (element: Element): Time => {
  const timeData = {
    beats: getTextContent(element, 'beats') ?? '4',
    'beat-type': getTextContent(element, 'beat-type') ?? '4',
    symbol: getAttribute(element, 'symbol'),
  };
  return TimeSchema.parse(timeData);
};

// Helper function to map a <clef> element
const mapClefElement = (element: Element): Clef => {
  const clefData = {
    sign: getTextContent(element, 'sign') ?? 'G',
    line: parseNumberContent(element, 'line'),
    'clef-octave-change': parseNumberContent(element, 'clef-octave-change'),
    number: parseOptionalNumberAttribute(element, 'number'), // For multi-staff parts
  };
  return ClefSchema.parse(clefData);
};

// Function to map an <attributes> element
export const mapAttributesElement = (element: Element): Attributes => {
  const divisions = element.querySelector('divisions');
  const keyElements = Array.from(element.querySelectorAll('key'));
  const timeElements = Array.from(element.querySelectorAll('time'));
  const clefElements = Array.from(element.querySelectorAll('clef'));

  const attributesData: Partial<Attributes> = { // Use Partial<Attributes> for building
    divisions: divisions ? parseInt(divisions.textContent ?? '1', 10) : undefined,
  };

  if (keyElements.length > 0) {
    attributesData.key = keyElements.map(mapKeyElement);
  }
  if (timeElements.length > 0) {
    attributesData.time = timeElements.map(mapTimeElement);
  }
  if (clefElements.length > 0) {
    attributesData.clef = clefElements.map(mapClefElement);
  }

  return AttributesSchema.parse(attributesData);
};

// Mapper for <measure> element
export const mapMeasureElement = (element: Element): Measure => {
  const noteElements = Array.from(element.querySelectorAll('note'));
  const attributesElements = Array.from(element.querySelectorAll('attributes')); // Select all attributes

  const measureData = {
    number: getAttribute(element, 'number') ?? '0',
    notes: noteElements.map(mapNoteElement),
    attributes: attributesElements.length > 0 ? attributesElements.map(mapAttributesElement) : undefined,
  };
  try {
    return MeasureSchema.parse(measureData);
  } catch (e) {
    console.error('Failed to parse measure:', JSON.stringify(measureData, null, 2));
    if (e instanceof z.ZodError) {
      console.error('Validation errors:', e.errors);
    }
    throw e;
  }
};

// Mapper for <part> element
export const mapPartElement = (element: Element): Part => {
  const measureElements = Array.from(element.querySelectorAll('measure'));
  const partData = {
    id: getAttribute(element, 'id') ?? '',
    measures: measureElements.map(mapMeasureElement),
  };
  return PartSchema.parse(partData);
};

// Mapper for <score-part> element (from <part-list>)
export const mapScorePartElement = (element: Element): ScorePart => {
  const scorePartData = {
    id: getAttribute(element, 'id') ?? '',
    partName: getTextContent(element, 'part-name') ?? '',
    // Add other <score-part> children like <part-abbreviation>, <score-instrument>, <midi-device>, etc.
  };
  return ScorePartSchema.parse(scorePartData);
};

// Mapper for <part-list> element
export const mapPartListElement = (element: Element): PartList => {
  const scorePartElements = Array.from(
    element.querySelectorAll('score-part'),
  );
  // console.log('Mapping PartList, found scorePartElements:', scorePartElements.length);
  const partListData = {
    scoreParts: scorePartElements.map(mapScorePartElement),
    // Potentially handle <part-group> elements here as well
  };
  // console.log('Parsed partListData:', JSON.stringify(partListData, null, 2));

  const result = PartListSchema.safeParse(partListData);
  if (!result.success) {
    console.error(
      'Error parsing PartList:',
      JSON.stringify(partListData, null, 2),
    );
    console.error('Validation Errors:', result.error.flatten());
    throw new Error('PartList parsing failed.');
  }
  return result.data;
};

// Main mapper for the document
export const mapDocumentToScorePartwise = (
  doc: XMLDocument,
): ScorePartwise => {
  const rootElement = doc.documentElement; // Should be <score-partwise>
  if (rootElement.nodeName !== 'score-partwise') {
    throw new Error(
      `Expected root element <score-partwise>, but got <${rootElement.nodeName}>`,
    );
  }

  const partListElement = rootElement.querySelector('part-list');
  const partElements = Array.from(rootElement.querySelectorAll('part'));

  if (!partListElement) {
    throw new Error('<part-list> element not found in <score-partwise>');
  }

  const scorePartwiseData = {
    partList: mapPartListElement(partListElement),
    parts: partElements.map(mapPartElement),
    version: getAttribute(rootElement, 'version') || '1.0', // Default or parse
  };

  const result = ScorePartwiseSchema.safeParse(scorePartwiseData);
  if (!result.success) {
    console.error(
      'Error parsing ScorePartwise:',
      JSON.stringify(scorePartwiseData, null, 2),
    );
    console.error('Validation Errors:', result.error.flatten());
    throw new Error('ScorePartwise parsing failed.');
  }
  return result.data;
}; 