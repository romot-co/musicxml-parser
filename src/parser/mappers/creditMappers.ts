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
  const valignAttr = getAttribute(element, "valign");
  const halignAttr = getAttribute(element, "halign"); // Read halign

  if (fontFamily) formatting.fontFamily = fontFamily;
  if (fontSize) formatting.fontSize = fontSize;
  if (defaultX !== undefined) formatting.defaultX = defaultX;
  if (defaultY !== undefined) formatting.defaultY = defaultY;

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
  const haAttr = getAttribute(element, "halign");
  if (haAttr && ["left", "center", "right"].includes(haAttr)) {
    formatting.halign = haAttr as "left" | "center" | "right";
  }
  const vaAttr = getAttribute(element, "valign");
  if (vaAttr && ["top", "middle", "bottom"].includes(vaAttr)) {
    formatting.valign = vaAttr as "top" | "middle" | "bottom";
  }

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
  const creditTypes = Array.from(element.querySelectorAll("credit-type"))
    .map((el) => el.textContent?.trim())
    .filter(Boolean) as string[];
  const creditWordsElements = Array.from(
    element.querySelectorAll("credit-words"),
  );
  const creditSymbolElements = Array.from(
    element.querySelectorAll("credit-symbol"),
  );
  const creditImageEl = element.querySelector("credit-image");

  const creditWords = creditWordsElements
    .map(mapCreditWordsElement)
    .filter(Boolean) as CreditWords[];
  const creditSymbols = creditSymbolElements
    .map(mapCreditSymbolElement)
    .filter(Boolean) as CreditSymbol[];
  const creditImage = creditImageEl
    ? mapCreditImageElement(creditImageEl)
    : undefined;

  const data: Partial<Credit> = {};
  if (page) data.page = page;
  if (creditTypes.length > 0) data.creditTypes = creditTypes;

  if (creditWords.length > 0) data.creditWords = creditWords;
  // MusicXML DTD implies credit-words, credit-symbol, credit-image are choices,
  // but common usage might mix them. For stricter parsing, you might need a refine on CreditSchema.
  // For now, we allow them to coexist if mapped.
  if (creditSymbols.length > 0) data.creditSymbols = creditSymbols;
  if (creditImage) data.creditImage = creditImage;

  // If nothing was mapped besides potentially a page number, it might not be a valid credit element.
  if (
    Object.keys(data).length === 0 ||
    (Object.keys(data).length === 1 && data.page)
  ) {
    if (
      creditWords.length === 0 &&
      creditSymbols.length === 0 &&
      !creditImage &&
      creditTypes.length === 0
    ) {
      // console.warn("Credit element is empty or only has page number, returning undefined.", element.outerHTML);
      return undefined;
    }
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
