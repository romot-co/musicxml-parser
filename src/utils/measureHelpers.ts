// Helpers to extract specific content types from Measure

import type {
  Measure,
  Note,
  Attributes,
  Direction,
  Barline,
  Harmony,
  Print,
  Sound,
  FiguredBass,
  Grouping,
  Link,
  Bookmark,
  Backup,
  Forward,
} from "../types";
import { LinkSchema } from "../schemas";

function filterByType<T>(measure: Measure, type: string): T[] {
  const content = measure.content ?? [];
  return content.filter(
    (item) => (item as { _type?: string })._type === type,
  ) as T[];
}

function filterLinks(measure: Measure): Link[] {
  const content = measure.content ?? [];
  return content.filter(
    (item): item is Link => LinkSchema.safeParse(item).success,
  );
}

export function getNotes(measure: Measure): Note[] {
  return filterByType(measure, "note") as Note[];
}

export function getAttributes(measure: Measure): Attributes[] {
  return filterByType(measure, "attributes") as Attributes[];
}

export function getDirections(measure: Measure): Direction[] {
  return filterByType(measure, "direction") as Direction[];
}

export function getBarlines(measure: Measure): Barline[] {
  return filterByType(measure, "barline") as Barline[];
}

export function getHarmonies(measure: Measure): Harmony[] {
  return filterByType(measure, "harmony") as Harmony[];
}

export function getPrints(measure: Measure): Print[] {
  return filterByType(measure, "print") as Print[];
}

export function getSounds(measure: Measure): Sound[] {
  return filterByType(measure, "sound") as Sound[];
}

export function getFiguredBasses(measure: Measure): FiguredBass[] {
  return filterByType(measure, "figured-bass") as FiguredBass[];
}

export function getGroupings(measure: Measure): Grouping[] {
  return filterByType(measure, "grouping") as Grouping[];
}

export function getLinks(measure: Measure): Link[] {
  return filterLinks(measure);
}

export function getBookmarks(measure: Measure): Bookmark[] {
  return filterByType(measure, "bookmark") as Bookmark[];
}

export function getBackups(measure: Measure): Backup[] {
  return filterByType(measure, "backup") as Backup[];
}

export function getForwards(measure: Measure): Forward[] {
  return filterByType(measure, "forward") as Forward[];
}
