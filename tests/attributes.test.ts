import { describe, it, expect } from 'vitest';
import { mapAttributesElement } from '../src/parser/mappers';
import type { Attributes, Key, Time, Clef } from '../src/types';
import { JSDOM } from 'jsdom';

// Helper to create an Element from an XML string snippet
function createElement(xmlString: string): Element {
  const dom = new JSDOM(xmlString, { contentType: 'application/xml' });
  const parsererror = dom.window.document.querySelector('parsererror');
  if (parsererror) {
    throw new Error(`Failed to parse XML string snippet: ${parsererror.textContent}`);
  }
  if (!dom.window.document.documentElement) {
    throw new Error('No document element found in XML string snippet.');
  }
  return dom.window.document.documentElement;
}


describe('Attributes Schema Tests', () => {
  describe('mapAttributesElement', () => {
    it('should parse a basic <attributes> element with <key>', () => {
      const xml = `<attributes><key><fifths>2</fifths><mode>major</mode></key></attributes>`;
      const element = createElement(xml);
      const attributes = mapAttributesElement(element);
      expect(attributes).toBeDefined();
      expect(attributes._type).toBe('attributes');
      expect(attributes.key).toBeDefined();
      expect(attributes.key).toHaveLength(1);
      const key = attributes.key?.[0] as Key;
      expect(key.fifths).toBe(2);
      expect(key.mode).toBe('major');
    });

    it('should parse <attributes> with <time> (beats and beat-type)', () => {
      const xml = `<attributes><time><beats>3</beats><beat-type>4</beat-type></time></attributes>`;
      const element = createElement(xml);
      const attributes = mapAttributesElement(element);
      expect(attributes.time).toBeDefined();
      expect(attributes.time).toHaveLength(1);
      const time = attributes.time?.[0] as Time;
      expect(time.beats).toBe('3');
      expect(time['beat-type']).toBe('4');
      expect(time.senzaMisura).toBeUndefined();
    });

    it('should parse <attributes> with <time> (senza-misura)', () => {
      const xml = `<attributes><time><senza-misura/></time></attributes>`;
      const element = createElement(xml);
      const attributes = mapAttributesElement(element);
      expect(attributes.time).toBeDefined();
      expect(attributes.time).toHaveLength(1);
      const time = attributes.time?.[0] as Time;
      expect(time.senzaMisura).toBe(true);
      expect(time.beats).toBeUndefined();
      expect(time['beat-type']).toBeUndefined();
    });

    it('should parse <attributes> with <clef>', () => {
      const xml = `<attributes><clef number="1"><sign>G</sign><line>2</line></clef></attributes>`;
      const element = createElement(xml);
      const attributes = mapAttributesElement(element);
      expect(attributes.clef).toBeDefined();
      expect(attributes.clef).toHaveLength(1);
      const clef = attributes.clef?.[0] as Clef;
      expect(clef.sign).toBe('G');
      expect(clef.line).toBe(2);
      expect(clef.number).toBe(1);
    });

    it('should parse <attributes> with <divisions>', () => {
      const xml = `<attributes><divisions>8</divisions></attributes>`;
      const element = createElement(xml);
      const attributes = mapAttributesElement(element);
      expect(attributes.divisions).toBe(8);
    });

    it('should parse <attributes> with <staves>', () => {
      const xml = `<attributes><staves>2</staves></attributes>`;
      const element = createElement(xml);
      const attributes = mapAttributesElement(element);
      expect(attributes.staves).toBe(2);
    });

    // TODO: Add tests for part-symbol, instruments, staff-details, transpose, measure-style
  });
}); 