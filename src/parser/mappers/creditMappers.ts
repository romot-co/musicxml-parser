import { z } from "zod";
import type {
  Pitch,
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
  Direction,
  DirectionType,
  Words,
  Metronome,
  MetronomeBeatUnit,
  MetronomePerMinute,
  // Dynamics,
  Wedge,
  // Segno,
  //Coda,
  Transpose,
  // Diatonic,
  // Chromatic,
  // OctaveChange,
  // Double,
  StaffDetails,
  StaffTuning,
  LineDetail,
  MeasureStyle,
  MultipleRest,
  MeasureRepeat,
  BeatRepeat,
  Slash,
  Accidental,
  AccidentalValue,
  Notations,
  Slur,
  Articulations,
  // Staccato,
  //Accent,
  //Tenuto,
  //Spiccato,
  //Staccatissimo,
  //StrongAccent,
  Tuplet,
  Ornaments,
  Technical,
  Tie,
  Barline,
  BarStyle,
  Repeat,
  Ending,
  Fermata,
  WavyLine,
  Footnote,
  Level,
  Work,
  Identification,
  Creator,
  Rights,
  Encoding,
  Beam,
  BeamValue,
  PartSymbol,
  Lyric,
  Grace,
  Cue,
  Unpitched,
  Font,
  Scaling,
  LyricFont,
  LyricLanguage,
  Defaults,
  CreditWords,
  CreditSymbol,
  CreditImage,
  Link,
  Bookmark,
  Credit,
  TextFormatting,
  SymbolFormatting, // Added
  Harmony,
  Backup,
  Forward,
  Print,
  Sound,
  MeasureContent,
  PageLayout,
  SystemLayout,
  StaffLayout,
  Margins,
  LineWidth,
  Appearance,
  TimewisePart,
  TimewiseMeasure,
  ScoreTimewise,
  Supports,
  Relation,
  Miscellaneous,
  MiscellaneousField,
  FermataShape, // FermataShape を追加
} from "../../types";
import {
  PitchSchema,
  NoteSchema,
  MeasureSchema,
  PartSchema,
  ScorePartSchema,
  PartListSchema,
  ScorePartwiseSchema,
  ScoreTimewiseSchema,
  TimewisePartSchema,
  TimewiseMeasureSchema,
  KeySchema,
  TimeSchema,
  ClefSchema,
  AttributesSchema,
  DirectionSchema,
  DirectionTypeSchema,
  WordsSchema,
  MetronomeSchema,
  MetronomeBeatUnitSchema,
  MetronomePerMinuteSchema,
  TransposeSchema,
  // DiatonicSchema,
  // ChromaticSchema,
  // OctaveChangeSchema,
  // DoubleSchema,
  StaffDetailsSchema,
  StaffTuningSchema,
  LineDetailSchema,
  MeasureStyleSchema,
  MultipleRestSchema,
  MeasureRepeatSchema,
  BeatRepeatSchema,
  SlashSchema,
  AccidentalSchema,
  NotationsSchema,
  SlurSchema,
  ArticulationsSchema,
  // StaccatoSchema,
  // AccentSchema,
  // TenutoSchema,
  // SpiccatoSchema,
  // StaccatissimoSchema,
  // StrongAccentSchema,
  TupletSchema,
  OrnamentsSchema,
  TechnicalSchema,
  TieSchema,
  BarlineSchema,
  WavyLineSchema,
  FootnoteSchema,
  LevelSchema,
  RepeatSchema,
  EndingSchema,
  FermataSchema,
  WorkSchema,
  IdentificationSchema,
  CreatorSchema,
  RightsSchema,
  EncodingSchema,
  BeamSchema,
  PartSymbolSchema,
  LyricSchema,
  GraceSchema,
  CueSchema,
  UnpitchedSchema,
  FontSchema,
  ScalingSchema,
  LyricFontSchema,
  LyricLanguageSchema,
  DefaultsSchema,
  CreditWordsSchema,
  CreditSymbolSchema, // Added
  CreditImageSchema,
  LinkSchema,
  BookmarkSchema,
  CreditSchema,
  // TextFormattingSchema,
  // SymbolFormattingSchema,
  HarmonySchema,
  DynamicsSchema,
  WedgeSchema,
  SegnoSchema,
  CodaSchema,
  GroupSymbolValueEnum,
  RootSchema,
  KindSchema,
  BassSchema,
  DegreeSchema,
  RootStepSchema,
  KindValueEnum,
  BassStepSchema,
  DegreeTypeEnum,
  PageLayoutSchema,
  MarginsSchema,
  LineWidthSchema,
  AppearanceSchema,
  SystemLayoutSchema,
  StaffLayoutSchema,
  BackupSchema,
  ForwardSchema,
  PrintSchema,
  SoundSchema,
  SupportsSchema,
  RelationSchema,
  MiscellaneousSchema,
  MiscellaneousFieldSchema,
  FermataShapeEnum,
  PedalSchema,
} from "../../schemas";

import {
  getTextContent,
  parseNumberContent,
  parseFloatContent,
  getAttribute,
  parseOptionalNumberAttribute,
} from "./utils";

export const mapLinkElement = (element: Element): Link | undefined => {
  const href =
    getAttribute(element, "xlink:href") || getAttribute(element, "href");
  if (!href) return undefined;

  const data: Partial<Link> = { href };
  const typeAttr =
    getAttribute(element, "xlink:type") || getAttribute(element, "type");
  if (typeAttr) data.type = typeAttr;
  const role =
    getAttribute(element, "xlink:role") || getAttribute(element, "role");
  if (role) data.role = role;
  const title =
    getAttribute(element, "xlink:title") || getAttribute(element, "title");
  if (title) data.title = title;
  const show =
    getAttribute(element, "xlink:show") || getAttribute(element, "show");
  if (show) data.show = show;
  const actuate =
    getAttribute(element, "xlink:actuate") || getAttribute(element, "actuate");
  if (actuate) data.actuate = actuate;
  const name = getAttribute(element, "name");
  if (name) data.name = name;
  const elementAttr = getAttribute(element, "element");
  if (elementAttr) data.element = elementAttr;
  const position = parseOptionalNumberAttribute(element, "position");
  if (position !== undefined) data.position = position;

  try {
    return LinkSchema.parse(data);
  } catch {
    return undefined;
  }
};

export const mapBookmarkElement = (element: Element): Bookmark | undefined => {
  const id = getAttribute(element, "id");
  if (!id) {
    // console.warn("Bookmark element is missing an 'id' attribute.", element.outerHTML);
    return undefined;
  }

  const data: Partial<Bookmark> = {
    _type: "bookmark",
    id,
  };
  const name = getAttribute(element, "name");
  if (name) data.name = name;
  const elementAttr = getAttribute(element, "element");
  if (elementAttr) data.element = elementAttr;
  const position = parseOptionalNumberAttribute(element, "position");
  if (position !== undefined) data.position = position;

  try {
    return BookmarkSchema.parse(data);
  } catch (e) {
    console.error(
      "BookmarkSchema.parse error in mapBookmarkElement. Data:",
      JSON.stringify(data, null, 2),
      "Error:",
      e instanceof z.ZodError ? e.errors : e,
      "Element:",
      element.outerHTML,
    );
    return undefined;
  }
};

export const mapCreditWordsElement = (
  element: Element,
): CreditWords | undefined => {
  const text = element.textContent?.trim();

  const formatting: Partial<TextFormatting> = {};
  const fontFamily = getAttribute(element, "font-family");
  const fontStyleAttr = getAttribute(element, "font-style");
  const fontSize = getAttribute(element, "font-size");
  const fontWeightAttr = getAttribute(element, "font-weight");
  const justifyAttr = getAttribute(element, "justify");
  const defaultX = parseOptionalNumberAttribute(element, "default-x");
  const defaultY = parseOptionalNumberAttribute(element, "default-y");
  const relativeX = parseOptionalNumberAttribute(element, "relative-x");
  const relativeY = parseOptionalNumberAttribute(element, "relative-y");
  const valignAttr = getAttribute(element, "valign");
  const halignAttr = getAttribute(element, "halign"); // Read halign
  const underlineAttr = getAttribute(element, "underline");
  const overlineAttr = getAttribute(element, "overline");
  const lineThroughAttr = getAttribute(element, "line-through");
  const rotationAttr = getAttribute(element, "rotation");
  const letterSpacing = getAttribute(element, "letter-spacing");
  const lineHeight = getAttribute(element, "line-height");
  const dirAttr = getAttribute(element, "dir");
  const enclosure = getAttribute(element, "enclosure");
  const xmlLang = getAttribute(element, "xml:lang");
  const xmlSpaceAttr = getAttribute(element, "xml:space");
  
  if (fontFamily) formatting.fontFamily = fontFamily;
  if (fontSize) formatting.fontSize = fontSize;
  if (defaultX !== undefined) formatting.defaultX = defaultX;
  if (defaultY !== undefined) formatting.defaultY = defaultY;
  if (relativeX !== undefined) formatting.relativeX = relativeX;
  if (relativeY !== undefined) formatting.relativeY = relativeY;

  if (fontStyleAttr === "normal" || fontStyleAttr === "italic") {
    formatting.fontStyle = fontStyleAttr;
  }
  if (fontWeightAttr === "normal" || fontWeightAttr === "bold") {
    formatting.fontWeight = fontWeightAttr;
  }
  if (
    justifyAttr === "left" ||
    justifyAttr === "center" ||
    justifyAttr === "right"
  ) {
    formatting.justify = justifyAttr;
  }
  if (
    valignAttr === "top" ||
    valignAttr === "middle" ||
    valignAttr === "bottom" ||
    valignAttr === "baseline"
  ) {
    formatting.valign = valignAttr;
  }

  let finalJustify = justifyAttr;
  if (!finalJustify && halignAttr) {
    finalJustify = halignAttr;
  }

  if (
    finalJustify === "left" ||
    finalJustify === "center" ||
    finalJustify === "right"
  ) {
    formatting.justify = finalJustify;
  }

  const parseLines = (v: string | undefined): number | undefined => {
    if (!v) return undefined;
    const n = parseInt(v, 10);
    return isNaN(n) ? undefined : n;
  };
  const underline = parseLines(underlineAttr);
  if (underline !== undefined) formatting.underline = underline;
  const overline = parseLines(overlineAttr);
  if (overline !== undefined) formatting.overline = overline;
  const lineThrough = parseLines(lineThroughAttr);
  if (lineThrough !== undefined) formatting.lineThrough = lineThrough;
  const rotation = rotationAttr ? parseFloat(rotationAttr) : undefined;
  if (rotation !== undefined && !isNaN(rotation)) formatting.rotation = rotation;
  if (letterSpacing) formatting.letterSpacing = letterSpacing;
  if (lineHeight) formatting.lineHeight = lineHeight;
  if (dirAttr && ["ltr", "rtl", "lro", "rlo"].includes(dirAttr))
    formatting.dir = dirAttr as "ltr" | "rtl" | "lro" | "rlo";
  if (enclosure) formatting.enclosure = enclosure;
  if (xmlLang) formatting.xmlLang = xmlLang;
  if (xmlSpaceAttr && ["default", "preserve"].includes(xmlSpaceAttr))
    formatting.xmlSpace = xmlSpaceAttr as "default" | "preserve";

  const data: Partial<CreditWords> = { text: text || "" }; // Ensure text is always a string
  if (Object.keys(formatting).length > 0) {
    data.formatting = formatting as TextFormatting;
  }

  // Only return undefined if there's no text AND no formatting attributes at all,
  // unless the element itself has other attributes (which implies it's meaningful).
  // An empty text string with formatting is valid.
  if (
    data.text === "" &&
    Object.keys(formatting).length === 0 &&
    !element.hasAttributes()
  ) {
    return undefined;
  }

  try {
    return CreditWordsSchema.parse(data);
  } catch {
    // console.warn("CreditWords parse error. Data:", JSON.stringify(data, null, 2), "Error:", (e as z.ZodError).errors);
    return undefined;
  }
};

export const mapCreditSymbolElement = (
  element: Element,
): CreditSymbol | undefined => {
  const smuflGlyphName = element.textContent?.trim() ?? "";

  const formatting: Partial<SymbolFormatting> = {};
  const dx = parseOptionalNumberAttribute(element, "default-x");
  if (dx !== undefined) formatting.defaultX = dx;
  const dy = parseOptionalNumberAttribute(element, "default-y");
  if (dy !== undefined) formatting.defaultY = dy;
  const rx = parseOptionalNumberAttribute(element, "relative-x");
  if (rx !== undefined) formatting.relativeX = rx;
  const ry = parseOptionalNumberAttribute(element, "relative-y");
  if (ry !== undefined) formatting.relativeY = ry;
  const haAttr = getAttribute(element, "halign");
  if (haAttr && ["left", "center", "right"].includes(haAttr)) {
    formatting.halign = haAttr as "left" | "center" | "right";
  }
  const vaAttr = getAttribute(element, "valign");
  if (vaAttr && ["top", "middle", "bottom"].includes(vaAttr)) {
    formatting.valign = vaAttr as "top" | "middle" | "bottom";
  }
  const underlineAttr = getAttribute(element, "underline");
  const overlineAttr = getAttribute(element, "overline");
  const lineThroughAttr = getAttribute(element, "line-through");
  const rotationAttr = getAttribute(element, "rotation");
  const letterSpacing = getAttribute(element, "letter-spacing");
  const lineHeight = getAttribute(element, "line-height");
  const dirAttr = getAttribute(element, "dir");
  const enclosure = getAttribute(element, "enclosure");
  const colorAttr = getAttribute(element, "color");

  const parseLines = (v: string | undefined): number | undefined => {
    if (!v) return undefined;
    const n = parseInt(v, 10);
    return isNaN(n) ? undefined : n;
  };
  const underline = parseLines(underlineAttr);
  if (underline !== undefined) formatting.underline = underline;
  const overline = parseLines(overlineAttr);
  if (overline !== undefined) formatting.overline = overline;
  const lineThrough = parseLines(lineThroughAttr);
  if (lineThrough !== undefined) formatting.lineThrough = lineThrough;
  const rotation = rotationAttr ? parseFloat(rotationAttr) : undefined;
  if (rotation !== undefined && !isNaN(rotation)) formatting.rotation = rotation;
  if (letterSpacing) formatting.letterSpacing = letterSpacing;
  if (lineHeight) formatting.lineHeight = lineHeight;
  if (dirAttr && ["ltr", "rtl", "lro", "rlo"].includes(dirAttr))
    formatting.dir = dirAttr as "ltr" | "rtl" | "lro" | "rlo";
  if (enclosure) formatting.enclosure = enclosure;
  if (colorAttr) formatting.color = colorAttr;

  const data: Partial<CreditSymbol> = { smuflGlyphName };
  if (Object.keys(formatting).length > 0) {
    data.formatting = formatting as SymbolFormatting;
  }

  if (
    data.smuflGlyphName === "" &&
    Object.keys(formatting).length === 0 &&
    !element.hasAttributes()
  ) {
    return undefined;
  }

  try {
    return CreditSymbolSchema.parse(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_e) {
    // console.warn('CreditSymbol parse error', data, (_e as z.ZodError).errors);
    return undefined;
  }
};

export const mapCreditImageElement = (
  element: Element,
): CreditImage | undefined => {
  const source = getAttribute(element, "source");
  const type = getAttribute(element, "type");
  if (!source || !type) {
    // console.warn("<credit-image> is missing required 'source' or 'type' attribute.");
    return undefined;
  }

  const data: Partial<CreditImage> = { source, type };
  const h = parseOptionalNumberAttribute(element, "height");
  if (h !== undefined) data.height = h;
  const w = parseOptionalNumberAttribute(element, "width");
  if (w !== undefined) data.width = w;
  const dx = parseOptionalNumberAttribute(element, "default-x");
  if (dx !== undefined) data.defaultX = dx;
  const dy = parseOptionalNumberAttribute(element, "default-y");
  if (dy !== undefined) data.defaultY = dy;
  const haAttr = getAttribute(element, "halign");
  const vaAttr = getAttribute(element, "valign");

  if (
    haAttr &&
    (haAttr === "left" || haAttr === "center" || haAttr === "right")
  ) {
    data.halign = haAttr as "left" | "center" | "right";
  }
  if (
    vaAttr &&
    (vaAttr === "top" || vaAttr === "middle" || vaAttr === "bottom")
  ) {
    data.valign = vaAttr as "top" | "middle" | "bottom";
  }

  try {
    return CreditImageSchema.parse(data);
  } catch {
    // console.warn("CreditImage parse error", data, (e as z.ZodError).errors);
    return undefined;
  }
};

export const mapCreditElement = (element: Element): Credit | undefined => {
  const page = getAttribute(element, "page");
  const creditTypes: string[] = [];
  const links: Link[] = [];
  const bookmarks: Bookmark[] = [];
  const items: (CreditWords | CreditSymbol)[] = [];
  const images: CreditImage[] = [];

  for (const child of Array.from(element.children)) {
    switch (child.tagName) {
      case "credit-type": {
        const t = child.textContent?.trim();
        if (t) creditTypes.push(t);
        break;
      }
      case "link": {
        const l = mapLinkElement(child);
        if (l) links.push(l);
        break;
      }
      case "bookmark": {
        const b = mapBookmarkElement(child);
        if (b) bookmarks.push(b);
        break;
      }
      case "credit-words": {
        const w = mapCreditWordsElement(child);
        if (w) items.push(w);
        break;
      }
      case "credit-symbol": {
        const s = mapCreditSymbolElement(child);
        if (s) items.push(s);
        break;
      }
      case "credit-image": {
        const img = mapCreditImageElement(child);
        if (img) images.push(img);
        break;
      }
    }
  }

  const data: Partial<Credit> = {};
  if (page) data.page = page;
  if (creditTypes.length > 0) data.creditTypes = creditTypes;
  if (links.length > 0) data.links = links;
  if (bookmarks.length > 0) data.bookmarks = bookmarks;
  if (items.length > 0) data.items = items;
  if (images.length > 0) data.creditImages = images;

  // If, after attempting to populate 'data' from all parts of the <credit> element,
  // the 'data' object is still empty, it means the <credit> element
  // had no parsable content (not even a 'page' attribute or any recognized children).
  // In such a truly empty case, return undefined.
  if (Object.keys(data).length === 0) {
    // console.warn("Credit element resulted in an empty data object, returning undefined.", element.outerHTML);
    return undefined;
  }

  try {
    return CreditSchema.parse(data);
  } catch (e) {
    console.error(
      "Credit parse error",
      JSON.stringify(data, null, 2),
      (e as z.ZodError).errors,
    );
    return undefined;
  }
};
