import type { Part, ScorePart, ScorePartwise } from "../types";

export interface PartLookup {
  part: Part;
  scorePart: ScorePart;
}

/**
 * Find a part within a {@link ScorePartwise} score along with its metadata.
 *
 * @param score The parsed score object.
 * @param id    The identifier of the part to retrieve.
 * @returns The matching part and its metadata, or `undefined` if not found.
 */
export function getPart(
  score: ScorePartwise,
  id: string,
): PartLookup | undefined {
  const part = (score.parts as Part[]).find((p: Part) => p.id === id);
  const scorePart = (score.partList.scoreParts as ScorePart[]).find(
    (sp: ScorePart) => sp.id === id,
  );
  if (!part || !scorePart) return undefined;
  return { part, scorePart };
}
