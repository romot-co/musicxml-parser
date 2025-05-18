import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { mapDirectionElement } from '../src/parser/mappers';
import type { DirectionType } from '../src/types';

function createElement(xmlString: string): Element {
  const dom = new JSDOM(xmlString, { contentType: 'application/xml' });
  const err = dom.window.document.querySelector('parsererror');
  if (err) throw new Error('Invalid XML');
  return dom.window.document.documentElement;
}

describe('Direction parsing', () => {
  it('parses words with color attribute', () => {
    const xml = `<direction><direction-type><words font-family="Times" color="#ff0000">Allegro</words></direction-type></direction>`;
    const el = createElement(xml);
    const direction = mapDirectionElement(el);
    expect(direction.direction_type[0].words?.text).toBe('Allegro');
    expect(direction.direction_type[0].words?.formatting?.fontFamily).toBe('Times');
    expect(direction.direction_type[0].words?.formatting?.color).toBe('#ff0000');
  });

  it('parses metronome per-minute formatting', () => {
    const xml = `<direction><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute font-size="12" color="blue">120</per-minute></metronome></direction-type></direction>`;
    const el = createElement(xml);
    const direction = mapDirectionElement(el);
    const met = direction.direction_type[0].metronome;
    expect(met?.['per-minute']?.['per-minute']).toBe('120');
    expect(met?.['per-minute']?.formatting?.fontSize).toBe('12');
    expect(met?.['per-minute']?.formatting?.color).toBe('blue');
  });

  it('parses dynamics and other direction-type elements', () => {
    const xml = `<direction><direction-type><dynamics color="red"><f/></dynamics><pedal type="start"/><wedge type="crescendo" spread="15"/><segno/><coda/></direction-type></direction>`;
    const el = createElement(xml);
    const direction = mapDirectionElement(el);
    const dt: DirectionType = direction.direction_type[0];
    expect(dt.dynamics?.value).toBe('f');
    expect(dt.dynamics?.formatting?.color).toBe('red');
    expect(dt.pedal?.type).toBe('start');
    expect(dt.wedge?.type).toBe('crescendo');
    expect(dt.wedge?.spread).toBe(15);
    expect(dt.segno).toBeDefined();
    expect(dt.coda).toBeDefined();
  });
});
