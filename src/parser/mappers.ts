import { Pitch, PitchSchema, Rest, RestSchema, Note, NoteSchema, Measure, MeasureSchema, Part, PartSchema, ScorePart, ScorePartSchema, PartList, PartListSchema, ScorePartwise, ScorePartwiseSchema } from '../schemas';
import { z } from 'zod';

// Helper functions for extracting data from XML elements

/**
 * Gets the text content of a child element by tag name.
 * @param parentElement The parent XML element.
 * @param tagName The tag name of the child element.
 * @returns The text content of the first matching child, or null if not found.
 */
function getTextContent(parentElement: Element, tagName: string): string | null {
  const element = parentElement.getElementsByTagName(tagName)[0];
  return element?.textContent ?? null;
}

/**
 * Gets the text content of a child element by query selector.
 * This is more flexible than getElementsByTagName for complex selectors.
 * @param parentElement The parent XML element.
 * @param selector The CSS selector for the child element.
 * @returns The text content of the first matching child, or null if not found.
 */
function queryTextContent(parentElement: Element, selector: string): string | null {
  const element = parentElement.querySelector(selector);
  return element?.textContent ?? null;
}

/**
 * Parses a number from the text content of a child element.
 * @param parentElement The parent XML element.
 * @param tagName The tag name of the child element.
 * @returns The parsed number, or null if not found or not a valid number.
 */
function parseNumberContent(parentElement: Element, tagName: string): number | null {
  const text = getTextContent(parentElement, tagName);
  if (text === null) return null;
  const num = parseFloat(text);
  return isNaN(num) ? null : num;
}

/**
 * Parses an integer from the text content of a child element.
 * @param parentElement The parent XML element.
 * @param tagName The tag name of the child element.
 * @returns The parsed integer, or null if not found or not a valid integer.
 */
function parseIntContent(parentElement: Element, tagName: string): number | null {
  const text = getTextContent(parentElement, tagName);
  if (text === null) return null;
  const num = parseInt(text, 10);
  return isNaN(num) ? null : num;
}

// Mapper for <pitch> element

/**
 * Maps a <pitch> XML element to a Pitch object.
 * @param pitchElement The <pitch> XML element.
 * @returns A Pitch object, or null if parsing fails or data is invalid.
 */
export function mapPitchElement(pitchElement: Element): Pitch | null {
  const step = getTextContent(pitchElement, 'step') as Pitch['step'] | null;
  const octave = parseIntContent(pitchElement, 'octave');
  
  if (!step || octave === null) {
    console.warn("Skipping pitch element due to missing step or octave:", pitchElement);
    return null; // Step and Octave are mandatory for a valid pitch
  }

  const alter = parseNumberContent(pitchElement, 'alter');

  const pitchData: Partial<Pitch> = {
    step,
    octave,
  };

  if (alter !== null) {
    pitchData.alter = alter;
  }

  // Validate with Zod schema
  const result = PitchSchema.safeParse(pitchData);
  if (!result.success) {
    console.warn("Invalid pitch data after mapping:", result.error.format(), pitchData, pitchElement);
    return null;
  }

  return result.data;
}

// Mapper for <note> element

/**
 * Checks if an element exists as a direct child of the parent element.
 * @param parentElement The parent XML element.
 * @param tagName The tag name of the child element to check for.
 * @returns True if the child element exists, false otherwise.
 */
function hasChildElement(parentElement: Element, tagName: string): boolean {
  return parentElement.getElementsByTagName(tagName).length > 0;
}

/**
 * Maps a <note> XML element to a Note object.
 * @param noteElement The <note> XML element.
 * @returns A Note object, or null if parsing fails or data is invalid.
 */
export function mapNoteElement(noteElement: Element): Note | null {
  const noteData: Partial<Note> = {};

  // Map <pitch>
  const pitchElement = noteElement.getElementsByTagName('pitch')[0];
  if (pitchElement) {
    const pitch = mapPitchElement(pitchElement);
    if (pitch) {
      noteData.pitch = pitch;
    }
  }

  // Map <rest>
  // RestSchema is currently an empty object, so its presence is what matters.
  if (hasChildElement(noteElement, 'rest')) {
    // Attempt to parse even if it's an empty object to satisfy the schema type
    const restResult = RestSchema.safeParse({}); 
    if (restResult.success) {
        noteData.rest = restResult.data;
    } else {
        // This should ideally not happen for an empty schema, but good to be cautious
        console.warn("Error parsing RestSchema for note:", restResult.error.format(), noteElement);
    }
  }

  // Map other <note> properties
  const duration = parseNumberContent(noteElement, 'duration');
  if (duration !== null) {
    noteData.duration = duration;
  }

  const voice = getTextContent(noteElement, 'voice');
  if (voice !== null) {
    noteData.voice = voice;
  }

  const type = getTextContent(noteElement, 'type');
  if (type !== null) {
    noteData.type = type;
  }
  
  // Add other note sub-elements mapping here (e.g., stem, notations, lyric)

  // Validate with Zod schema
  const result = NoteSchema.safeParse(noteData);
  if (!result.success) {
    console.warn("Invalid note data after mapping:", result.error.format(), noteData, noteElement);
    return null;
  }

  return result.data;
}

// Mapper for <measure> element

/**
 * Gets an attribute value from an XML element.
 * @param element The XML element.
 * @param attributeName The name of the attribute.
 * @returns The attribute value, or null if not found.
 */
function getAttribute(element: Element, attributeName: string): string | null {
  return element.getAttribute(attributeName);
}

/**
 * Maps a <measure> XML element to a Measure object.
 * @param measureElement The <measure> XML element.
 * @returns A Measure object, or null if parsing fails or data is invalid.
 */
export function mapMeasureElement(measureElement: Element): Measure | null {
  const measureData: Partial<Measure> = {};

  const numberAttr = getAttribute(measureElement, 'number');
  if (numberAttr !== null) {
    measureData.number = numberAttr;
  } else {
    // Measure number is typically essential
    console.warn("Skipping measure element due to missing 'number' attribute:", measureElement);
    return null;
  }

  // Map <attributes> (placeholder for now)
  const attributesElement = measureElement.getElementsByTagName('attributes')[0];
  if (attributesElement) {
    // For AttributesSchemaPlaceholder (an empty object by default, with passthrough)
    // We can just assign an empty object, or try to map known fields if any were defined.
    // As it's a passthrough, it will accept any fields we might add during direct DOM to object mapping later.
    measureData.attributes = {}; // Or map specific known attributes if any
  }

  // Map <note> elements
  const noteElements = Array.from(measureElement.getElementsByTagName('note'));
  const notes: Note[] = [];
  for (const noteElem of noteElements) {
    const note = mapNoteElement(noteElem);
    if (note) {
      notes.push(note);
    }
  }
  measureData.notes = notes; // Assign even if empty, schema has default([])

  // Add other measure sub-elements mapping here (e.g., barline, direction, harmony)

  // Validate with Zod schema
  const result = MeasureSchema.safeParse(measureData);
  if (!result.success) {
    console.warn("Invalid measure data after mapping:", result.error.format(), measureData, measureElement);
    return null;
  }

  return result.data;
}

// Mapper for <part> element

/**
 * Maps a <part> XML element to a Part object.
 * @param partElement The <part> XML element.
 * @returns A Part object, or null if parsing fails or data is invalid.
 */
export function mapPartElement(partElement: Element): Part | null {
  const partData: Partial<Part> = {};

  const idAttr = getAttribute(partElement, 'id');
  if (idAttr !== null) {
    partData.id = idAttr;
  } else {
    // Part ID is typically essential
    console.warn("Skipping part element due to missing 'id' attribute:", partElement);
    return null;
  }

  // Map <measure> elements
  const measureElements = Array.from(partElement.getElementsByTagName('measure'));
  const measures: Measure[] = [];
  for (const measureElem of measureElements) {
    const measure = mapMeasureElement(measureElem);
    if (measure) {
      measures.push(measure);
    }
  }
  // PartSchema requires at least one measure. This will be caught by Zod validation if measures array is empty.
  partData.measures = measures;

  // Validate with Zod schema
  const result = PartSchema.safeParse(partData);
  if (!result.success) {
    // This will catch cases like no measures, or if other required fields were added to PartSchema
    console.warn("Invalid part data after mapping:", result.error.format(), partData, partElement);
    return null;
  }

  return result.data;
}

// We will add more mappers here for <note>, <measure>, <part>, <score-partwise>, etc.

// Mapper for <score-part> element (from <part-list>)

/**
 * Maps a <score-part> XML element to a ScorePart object.
 * @param scorePartElement The <score-part> XML element.
 * @returns A ScorePart object, or null if parsing fails or data is invalid.
 */
export function mapScorePartElement(scorePartElement: Element): ScorePart | null {
  const scorePartData: Partial<ScorePart> = {};

  const idAttr = getAttribute(scorePartElement, 'id');
  if (idAttr !== null) {
    scorePartData.id = idAttr;
  } else {
    console.warn("Skipping <score-part> element due to missing 'id' attribute:", scorePartElement);
    return null; // ID is mandatory for <score-part>
  }

  const partName = getTextContent(scorePartElement, 'part-name');
  if (partName !== null) {
    scorePartData.partName = partName;
  }

  const partAbbreviation = getTextContent(scorePartElement, 'part-abbreviation');
  if (partAbbreviation !== null) {
    scorePartData.partAbbreviation = partAbbreviation;
  }
  
  // Map other <score-part> sub-elements here (e.g., <score-instrument>, <midi-instrument>)

  const result = ScorePartSchema.safeParse(scorePartData);
  if (!result.success) {
    console.warn("Invalid <score-part> data after mapping:", result.error.format(), scorePartData, scorePartElement);
    return null;
  }
  return result.data;
}

// Mapper for <part-list> element

/**
 * Maps a <part-list> XML element to a PartList object.
 * @param partListElement The <part-list> XML element.
 * @returns A PartList object, or null if parsing fails or data is invalid.
 */
export function mapPartListElement(partListElement: Element): PartList | null {
  const partListData: Partial<PartList> = {};
  const scorePartElements = Array.from(partListElement.getElementsByTagName('score-part'));
  const scoreParts: ScorePart[] = [];

  for (const spElem of scorePartElements) {
    const scorePart = mapScorePartElement(spElem);
    if (scorePart) {
      scoreParts.push(scorePart);
    }
  }
  // PartListSchema requires at least one score-part. This will be caught by Zod.
  partListData.scoreParts = scoreParts;
  
  // Map <part-group> elements here if needed in the future

  const result = PartListSchema.safeParse(partListData);
  if (!result.success) {
    console.warn("Invalid <part-list> data after mapping:", result.error.format(), partListData, partListElement);
    return null;
  }
  return result.data;
}

// Mapper for the root <score-partwise> element

/**
 * Maps the root <score-partwise> XML element from a Document to a ScorePartwise object.
 * @param doc The parsed XML Document.
 * @returns A ScorePartwise object, or null if parsing fails or data is invalid.
 */
export function mapDocumentToScorePartwise(doc: Document): ScorePartwise | null {
  const rootElement = doc.documentElement; // Should be <score-partwise>

  if (rootElement.tagName.toLowerCase() !== 'score-partwise') {
    console.error("Root element is not <score-partwise>:", rootElement.tagName);
    return null;
  }

  const scoreData: Partial<ScorePartwise> = {};

  // Map version attribute
  const versionAttr = getAttribute(rootElement, 'version');
  if (versionAttr !== null) {
    scoreData.version = versionAttr;
  }

  // Map <part-list>
  const partListElement = rootElement.getElementsByTagName('part-list')[0];
  if (partListElement) {
    const partList = mapPartListElement(partListElement);
    if (partList) {
      scoreData.partList = partList;
    } else {
      console.warn("Failed to map <part-list>.", rootElement);
      return null; // part-list is mandatory as per our schema
    }
  } else {
    console.warn("Missing <part-list> element in <score-partwise>.");
    return null; // part-list is mandatory
  }

  // Map <part> elements
  const partElements = Array.from(rootElement.getElementsByTagName('part'));
  const parts: Part[] = [];
  for (const partElem of partElements) {
    const part = mapPartElement(partElem);
    if (part) {
      parts.push(part);
    }
  }
  // ScorePartwiseSchema requires at least one part. This will be caught by Zod.
  scoreData.parts = parts;
  
  // Map other top-level elements like <work>, <movement-title>, <identification>, <defaults>, <credit>
  // For now, these are placeholders in the schema, so direct mapping is minimal or skipped.
  // Example for <work> and <movement-title> (if they are simple text content or have simple known children)
  const workElement = rootElement.getElementsByTagName('work')[0];
  if (workElement) {
    const workTitle = getTextContent(workElement, 'work-title'); // Assuming <work-title> inside <work>
    // This is a simplification. WorkSchemaPlaceholder is an object. 
    // We might need a dedicated mapWorkElement if it's complex.
    scoreData.work = { title: workTitle ?? undefined }; 
  }

  const movementTitle = getTextContent(rootElement, 'movement-title');
  if (movementTitle !== null) {
    scoreData.movementTitle = movementTitle;
  }
  
  // Identification, Defaults, Credit would be mapped similarly if their schemas were detailed.
  // For placeholder schemas (like z.object({}).passthrough()), we might not map anything explicitly here,
  // or map known simple children.

  const result = ScorePartwiseSchema.safeParse(scoreData);
  if (!result.success) {
    console.warn("Invalid <score-partwise> data after mapping:", result.error.format(), scoreData, rootElement);
    return null;
  }
  return result.data;
} 