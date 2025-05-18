import { z } from "zod";
import type {
  Pitch,
  Note,
  Measure,
  Part,
  ScorePart,
  PartList,
  PartGroup,
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
  MetronomeNote,
  MetronomeRelation,
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
  TrillMark, // Add
  Turn, // Add
  Mordent, // Add
  Schleifer, // Add
  OtherOrnament, // Add
  Technical,
  Glissando,
  Slide,
  Tremolo,
  Arpeggiate,
  NonArpeggiate,
  OtherNotation,
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
  Opus,
  Identification,
  Creator,
  Rights,
  Encoding,
  Beam,
  BeamValue,
  PartSymbol,
  GroupSymbolValue,
  Lyric,
  Grace,
  Cue,
  Unpitched,
  TimeModification,
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
  LyricFormatting,
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
  FermataShape,
  ScoreInstrument,
  MidiInstrument,
  MidiDevice, // Added MidiDevice to imports
  FiguredBass,
  Figure,
  Grouping,
  Feature,
  Link,
  Bookmark,
  Rehearsal,
  OctaveShift,
  Dashes,
  Bracket,
  Image,
} from "../../types";
import {
  PitchSchema,
  NoteSchema,
  MeasureSchema,
  PartSchema,
  ScorePartSchema,
  PartListSchema,
  PartGroupSchema,
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
  MetronomeNoteSchema,
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
  TrillMarkSchema,
  TurnSchema,
  MordentSchema,
  SchleiferSchema,
  OtherOrnamentSchema,
  FingeringSchema,
  StringSchema,
  FretSchema,
  HammerOnPullOffSchema,
  BendSchema,
  TapSchema,
  OtherTechnicalSchema,
  ValuePlacementSchema,
  OrnamentsSchema,
  TechnicalSchema,
  GlissandoSchema,
  SlideSchema,
  TremoloSchema,
  ArpeggiateSchema,
  NonArpeggiateSchema,
  OtherNotationSchema,
  TieSchema,
  BarlineSchema,
  WavyLineSchema,
  FootnoteSchema,
  LevelSchema,
  RepeatSchema,
  EndingSchema,
  FermataSchema,
  WorkSchema,
  OpusSchema,
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
  TimeModificationSchema,
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
  RehearsalSchema,
  OctaveShiftSchema,
  DashesSchema,
  BracketSchema,
  ImageSchema,
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
  ScoreInstrumentSchema,
  FiguredBassSchema,
  FigureSchema,
  GroupingSchema,
  FeatureSchema,
  LinkSchema,
  BookmarkSchema,
  FrameSchema,
  FrameNoteSchema,
  FirstFretSchema,
  MidiDeviceSchema,
  MidiInstrumentSchema,
} from "../../schemas";

// Re-exported mappers from other modules
import {
  mapDefaultsElement,
  mapPageLayoutElement,
  mapSystemLayoutElement,
  mapStaffLayoutElement,
} from "./defaultsMappers";
import {
  mapCreditElement,
  mapBookmarkElement,
  mapLinkElement,
} from "./creditMappers";
import {
  getTextContent,
  parseNumberContent,
  parseFloatContent,
  getAttribute,
  parseOptionalNumberAttribute,
  parseOptionalInt,
  parseOptionalFloat,
} from "./utils";
import { mapNotationsElement, mapBeamElement } from "./measureMappers";

// Helper function to get text content of a child element

// Mapper for <pitch> element
export const mapPitchElement = (element: Element): Pitch => {
  const pitchData = {
    step: getTextContent(element, "step") ?? "C",
    octave: parseNumberContent(element, "octave") ?? 4,
    alter: parseNumberContent(element, "alter"),
  };
  return PitchSchema.parse(pitchData);
};

// Mapper for <rest> element (within a <note>)
// Note: Rest is identified by the absence of <pitch> and presence of <rest> inside <note>
// This function is more of a conceptual placeholder if we were to map a standalone <rest> tag
// which is not typical in note-based contexts. The logic is handled in mapNoteElement.

// Mapper for <accidental> element
export const mapAccidentalElement = (element: Element): Accidental => {
  const value = element.textContent?.trim() as AccidentalValue | undefined;
  const cautionary = getAttribute(element, "cautionary") as
    | "yes"
    | "no"
    | undefined;
  const editorial = getAttribute(element, "editorial") as
    | "yes"
    | "no"
    | undefined;
  const parentheses = getAttribute(element, "parentheses") as
    | "yes"
    | "no"
    | undefined;
  const bracket = getAttribute(element, "bracket") as "yes" | "no" | undefined;
  const size = getAttribute(element, "size") || undefined;

  if (!value) {
    throw new Error(
      "<accidental> element must have text content specifying the accidental type.",
    );
  }

  const accidentalData: Partial<Accidental> = {
    value: value,
    cautionary: cautionary,
    editorial: editorial,
    parentheses: parentheses,
    bracket: bracket,
    size: size,
  };
  return AccidentalSchema.parse(accidentalData);
};

// Helper function to map a <grace> element
export const mapGraceElement = (element: Element): Grace => {
  const graceData: Partial<Grace> = {
    stealTimePrevious: parseFloatContent(element, "steal-time-previous"),
    stealTimeFollowing: parseFloatContent(element, "steal-time-following"),
    makeTime: parseFloatContent(element, "make-time"),
    slash: getAttribute(element, "slash") as "yes" | "no" | undefined,
  };
  return GraceSchema.parse(graceData);
};

// Helper function to map a <cue> element
export const mapCueElement = (_element: Element): Cue => {
  return CueSchema.parse({}); // Cue is an empty element
};

// Helper function to map an <unpitched> element
export const mapUnpitchedElement = (element: Element): Unpitched => {
  const unpitchedData: Partial<Unpitched> = {
    displayStep: getTextContent(element, "display-step"),
    displayOctave: parseNumberContent(element, "display-octave"),
  };
  return UnpitchedSchema.parse(unpitchedData);
};

// Helper function to map a <lyric> element
export const mapLyricElement = (element: Element): Lyric => {
  const textElement = element.querySelector("text");
  const getAttr = (name: string): string | undefined => {
    return (
      getAttribute(textElement ?? element, name) || getAttribute(element, name)
    );
  };

  const lyricData: Partial<Lyric> = {
    text: textElement?.textContent?.trim() ?? "",
    syllabic: getTextContent(element, "syllabic") as
      | "single"
      | "begin"
      | "end"
      | "middle"
      | undefined,
  };

  const numberAttr = getAttribute(element, "number");
  const nameAttr = getAttribute(element, "name");
  if (numberAttr) lyricData.number = numberAttr;
  if (nameAttr) lyricData.name = nameAttr;

  const extendElement = element.querySelector("extend");
  if (extendElement) {
    lyricData.extend = {
      type: getAttribute(extendElement, "type") as
        | "start"
        | "stop"
        | "continue"
        | undefined,
    };
  }

  const elisionElement = element.querySelector("elision");
  if (elisionElement) {
    lyricData.elision = {
      text: elisionElement.textContent?.trim() || undefined,
    };
  }

  const xmlLang = getAttr("xml:lang");
  if (xmlLang) lyricData.xmlLang = xmlLang;

  const formatting: Partial<Lyric["formatting"]> = {};
  const justify = getAttr("justify");
  if (justify === "left" || justify === "center" || justify === "right") {
    formatting.justify = justify;
  }
  const fontStyle = getAttr("font-style");
  if (fontStyle === "normal" || fontStyle === "italic") {
    formatting.fontStyle = fontStyle;
  }
  const fontFamily = getAttr("font-family");
  if (fontFamily) formatting.fontFamily = fontFamily;
  const fontSize = getAttr("font-size");
  if (fontSize) formatting.fontSize = fontSize;
  const fontWeight = getAttr("font-weight");
  if (fontWeight === "normal" || fontWeight === "bold") {
    formatting.fontWeight = fontWeight;
  }
  const underlineAttr = getAttr("underline");
  const overlineAttr = getAttr("overline");
  const lineThroughAttr = getAttr("line-through");
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
  const color = getAttr("color");
  if (color) formatting.color = color;

  if (Object.keys(formatting).length > 0) {
    lyricData.formatting = formatting as Lyric["formatting"];
  }

  return LyricSchema.parse(lyricData);
};

// Helper function to map a <time-modification> element
export const mapTimeModificationElement = (
  element: Element,
): TimeModification => {
  const actualNotes = parseNumberContent(element, "actual-notes");
  const normalNotes = parseNumberContent(element, "normal-notes");
  if (actualNotes === undefined || normalNotes === undefined) {
    throw new Error(
      "<time-modification> requires actual-notes and normal-notes",
    );
  }
  const normalType = getTextContent(element, "normal-type");
  const normalDotElements = Array.from(element.querySelectorAll("normal-dot"));

  const tmData: Partial<TimeModification> = {
    actualNotes,
    normalNotes,
  };
  if (normalType) tmData.normalType = normalType;
  if (normalDotElements.length > 0) {
    tmData.normalDots = normalDotElements.map(() => ({}));
  }
  return TimeModificationSchema.parse(tmData);
};

// Mapper for <note> element
export const mapNoteElement = (element: Element): Note => {
  const graceElement = element.querySelector("grace");
  const cueElement = element.querySelector("cue");
  const chordElement = element.querySelector("chord");
  const pitchElement = element.querySelector("pitch");
  const unpitchedElement = element.querySelector("unpitched");
  const restElement = element.querySelector("rest");
  const type = getTextContent(element, "type");
  const dotElements = Array.from(element.querySelectorAll("dot"));
  const accidentalElement = element.querySelector("accidental");
  const stemContent = getTextContent(element, "stem");
  const beamElements = Array.from(element.querySelectorAll("beam"));
  const notationsElement = element.querySelector("notations");
  const lyricElements = Array.from(element.querySelectorAll("lyric"));
  const tieElements = Array.from(element.querySelectorAll("tie"));
  const timeModElement = element.querySelector("time-modification");
  const voiceContent = getTextContent(element, "voice");

  const noteData: Partial<Note> = {
    _type: "note",
    type: type,
  };

  // Parse attributes of the <note> element itself
  noteData.printLeger = getAttribute(element, "print-leger") as
    | "yes"
    | "no"
    | undefined;
  const dynamicsAttr = getAttribute(element, "dynamics");
  if (dynamicsAttr) noteData.dynamics = parseFloat(dynamicsAttr);
  const endDynamicsAttr = getAttribute(element, "end-dynamics");
  if (endDynamicsAttr) noteData.endDynamics = parseFloat(endDynamicsAttr);
  const attackAttr = getAttribute(element, "attack");
  if (attackAttr) noteData.attack = parseFloat(attackAttr);
  const releaseAttr = getAttribute(element, "release");
  if (releaseAttr) noteData.release = parseFloat(releaseAttr);
  noteData.pizzicato = getAttribute(element, "pizzicato") as
    | "yes"
    | "no"
    | undefined;

  if (graceElement) {
    noteData.grace = mapGraceElement(graceElement);
  }
  if (cueElement) {
    noteData.cue = mapCueElement(cueElement);
  }
  if (chordElement) {
    noteData.isChord = true;
  }

  if (pitchElement) {
    noteData.pitch = mapPitchElement(pitchElement);
  } else if (unpitchedElement) {
    noteData.unpitched = mapUnpitchedElement(unpitchedElement);
  } else if (restElement) {
    noteData.rest = {
      // measure: getAttribute(restElement, 'measure') === 'yes' ? true : undefined,
    };
  }

  // Duration is handled based on grace/cue presence by NoteSchema.refine
  // Only parse duration if not a grace note. If cue but not grace, it's required.
  // If neither grace nor cue, it's required.
  const duration = parseNumberContent(element, "duration");
  if (duration !== undefined) {
    noteData.duration = duration;
  }
  if (timeModElement) {
    noteData.timeModification = mapTimeModificationElement(timeModElement);
  }

  if (tieElements.length > 0) {
    noteData.ties = tieElements.map(mapTieElement);
  }

  if (dotElements.length > 0) {
    noteData.dots = dotElements.map(() => ({}));
  }
  if (accidentalElement) {
    noteData.accidental = mapAccidentalElement(accidentalElement);
  }
  if (stemContent) {
    noteData.stem = stemContent as "up" | "down" | "none" | "double";
  }
  if (beamElements.length > 0) {
    noteData.beams = beamElements.map(mapBeamElement).filter(Boolean) as Beam[];
  }
  if (notationsElement) {
    noteData.notations = mapNotationsElement(notationsElement);
  }
  if (lyricElements.length > 0) {
    noteData.lyrics = lyricElements.map(mapLyricElement);
  }
  if (voiceContent) {
    noteData.voice = voiceContent;
  }

  try {
    return NoteSchema.parse(noteData);
  } catch (e) {
    console.error("Failed to parse note:", JSON.stringify(noteData, null, 2));
    console.error("Validation errors:", (e as z.ZodError).errors);
    throw e;
  }
};

// Helper function to map a <key> element
export const mapKeyElement = (element: Element): Key => {
  const keyData = {
    fifths: parseNumberContent(element, "fifths") ?? 0,
    mode: getTextContent(element, "mode"),
  };
  return KeySchema.parse(keyData);
};

// Helper function to map a <time> element
export const mapTimeElement = (element: Element): Time => {
  const senzaMisuraElement = element.querySelector("senza-misura");
  const timeData: Partial<Time> = {
    symbol: getAttribute(element, "symbol"),
  };

  if (senzaMisuraElement) {
    timeData.senzaMisura = true;
  } else {
    timeData.beats = getTextContent(element, "beats") ?? "4";
    timeData["beat-type"] = getTextContent(element, "beat-type") ?? "4";
  }

  return TimeSchema.parse(timeData);
};

// Helper function to map a <clef> element
export const mapClefElement = (element: Element): Clef => {
  const clefData = {
    sign: getTextContent(element, "sign") ?? "G",
    line: parseNumberContent(element, "line"),
    "clef-octave-change": parseNumberContent(element, "clef-octave-change"),
    number: parseOptionalNumberAttribute(element, "number"), // For multi-staff parts
  };
  return ClefSchema.parse(clefData);
};

// Helper function to map a <slur> element
export const mapSlurElement = (element: Element): Slur => {
  const slurData: Partial<Slur> = {
    type: getAttribute(element, "type") as "start" | "stop" | "continue",
    number: parseOptionalNumberAttribute(element, "number"),
    placement: getAttribute(element, "placement") as
      | "above"
      | "below"
      | undefined,
  };

  const orientation = getAttribute(element, "orientation");
  if (orientation === "over" || orientation === "under")
    slurData.orientation = orientation;

  const colorAttr = getAttribute(element, "color");
  if (colorAttr) slurData.color = colorAttr;

  const lineTypeAttr = getAttribute(element, "line-type");
  if (lineTypeAttr) slurData.lineType = lineTypeAttr;

  const bezierXAttr = getAttribute(element, "bezier-x");
  if (bezierXAttr) slurData.bezierX = parseOptionalFloat(bezierXAttr);

  const bezierYAttr = getAttribute(element, "bezier-y");
  if (bezierYAttr) slurData.bezierY = parseOptionalFloat(bezierYAttr);

  const bezierX2Attr = getAttribute(element, "bezier-x2");
  if (bezierX2Attr) slurData.bezierX2 = parseOptionalFloat(bezierX2Attr);

  const bezierY2Attr = getAttribute(element, "bezier-y2");
  if (bezierY2Attr) slurData.bezierY2 = parseOptionalFloat(bezierY2Attr);

  const bezierOffsetAttr = getAttribute(element, "bezier-offset");
  if (bezierOffsetAttr)
    slurData.bezierOffset = parseOptionalFloat(bezierOffsetAttr);

  const bezierOffset2Attr = getAttribute(element, "bezier-offset2");
  if (bezierOffset2Attr)
    slurData.bezierOffset2 = parseOptionalFloat(bezierOffset2Attr);
  // Validate that type is one of the expected values before parsing
  if (slurData.type && !["start", "stop", "continue"].includes(slurData.type)) {
    throw new Error(`Invalid slur type: ${slurData.type}`);
  }
  return SlurSchema.parse(slurData);
};

export const mapFermataElement = (element: Element): Fermata => {
  const fermataData: Partial<Fermata> = {};
  const textContent = element.textContent?.trim();

  if (textContent !== undefined) {
    if (
      FermataShapeEnum.options.includes(textContent as FermataShape) ||
      textContent === ""
    ) {
      fermataData.value = textContent as FermataShape;
    } else {
      console.warn(`Invalid fermata value: ${textContent}`);
    }
  }

  const typeAttr = getAttribute(element, "type");
  if (typeAttr === "upright" || typeAttr === "inverted") {
    fermataData.type = typeAttr;
  }
  return FermataSchema.parse(fermataData);
};

export const mapWavyLineElement = (element: Element): WavyLine => {
  const wavyLineData: Partial<WavyLine> = {
    type: getAttribute(element, "type") as
      | "start"
      | "stop"
      | "continue"
      | undefined,
    number: parseOptionalNumberAttribute(element, "number"),
    smufl: getAttribute(element, "smufl") || undefined,
    placement: getAttribute(element, "placement") as
      | "above"
      | "below"
      | undefined,
    color: getAttribute(element, "color") || undefined,
    accelerate: getAttribute(element, "accelerate") as "yes" | "no" | undefined,
    beats: parseOptionalNumberAttribute(element, "beats"),
    secondBeats: parseOptionalNumberAttribute(element, "second-beats"),
    lastBeat: parseOptionalNumberAttribute(element, "last-beat"),
  };
  return WavyLineSchema.parse(wavyLineData);
};

export const mapFootnoteElement = (element: Element): Footnote => {
  const data = { value: element.textContent?.trim() || "" };
  return FootnoteSchema.parse(data);
};

export const mapLevelElement = (element: Element): Level => {
  const levelData: Partial<Level> = {
    value: element.textContent?.trim() || undefined,
    reference: getAttribute(element, "reference") as "yes" | "no" | undefined,
    type: getAttribute(element, "type") as
      | "start"
      | "stop"
      | "single"
      | undefined,
    parentheses: getAttribute(element, "parentheses") as
      | "yes"
      | "no"
      | undefined,
    bracket: getAttribute(element, "bracket") as "yes" | "no" | undefined,
    size: getAttribute(element, "size") || undefined,
  };
  return LevelSchema.parse(levelData);
};

// Helper function to map an <articulations> element
export const mapArticulationsElement = (element: Element): Articulations => {
  const staccatoElement = element.querySelector("staccato");
  const accentElement = element.querySelector("accent");
  const tenutoElement = element.querySelector("tenuto");
  const spiccatoElement = element.querySelector("spiccato");
  const staccatissimoElement = element.querySelector("staccatissimo");
  const strongAccentElement = element.querySelector("strong-accent");

  const articulationsData: Partial<Articulations> = {
    placement: getAttribute(element, "placement") as
      | "above"
      | "below"
      | undefined,
  };

  if (staccatoElement) {
    articulationsData.staccato = {}; // StaccatoSchema is an empty object
  }
  if (accentElement) {
    articulationsData.accent = {}; // AccentSchema is an empty object
  }
  if (tenutoElement) {
    articulationsData.tenuto = {};
  }
  if (spiccatoElement) {
    articulationsData.spiccato = {};
  }
  if (staccatissimoElement) {
    articulationsData.staccatissimo = {};
  }
  if (strongAccentElement) {
    articulationsData.strongAccent = {};
  }

  return ArticulationsSchema.parse(articulationsData);
};

// Helper to map a <tied> element
export const mapTiedElement = (element: Element): Tie => {
  const type = getAttribute(element, "type") as "start" | "stop" | undefined;
  if (!type) {
    throw new Error('<tied> element requires a "type" attribute.');
  }
  return TieSchema.parse({ type });
};

// Helper to map a <tie> element
export const mapTieElement = (element: Element): Tie => {
  const type = getAttribute(element, "type") as "start" | "stop" | undefined;
  if (!type) {
    throw new Error('<tie> element requires a "type" attribute.');
  }
  return TieSchema.parse({ type });
};

// Helper to map a <tuplet> element
export const mapTupletElement = (element: Element): Tuplet => {
  const type = getAttribute(element, "type") as "start" | "stop" | undefined;
  if (!type) {
    throw new Error('<tuplet> element requires a "type" attribute.');
  }
  const tupletData: Partial<Tuplet> = {
    type,
    number: parseOptionalNumberAttribute(element, "number"),
  };
  return TupletSchema.parse(tupletData);
};

// Helper to map a <ornaments> element and its children
export const mapTrillLikeElement = (el: Element): TrillMark => {
  const data: Partial<TrillMark> = {
    placement: getAttribute(el, "placement") as "above" | "below" | undefined,
    accelerate: getAttribute(el, "accelerate") as "yes" | "no" | undefined,
    beats: parseOptionalNumberAttribute(el, "beats"),
    secondBeats: parseOptionalNumberAttribute(el, "second-beats"),
    lastBeat: parseOptionalNumberAttribute(el, "last-beat"),
  };
  return TrillMarkSchema.parse(data);
};

export const mapTurnElement = (el: Element): Turn => {
  const data: Partial<Turn> = {
    placement: getAttribute(el, "placement") as "above" | "below" | undefined,
    accelerate: getAttribute(el, "accelerate") as "yes" | "no" | undefined,
    beats: parseOptionalNumberAttribute(el, "beats"),
    secondBeats: parseOptionalNumberAttribute(el, "second-beats"),
    lastBeat: parseOptionalNumberAttribute(el, "last-beat"),
    slash: getAttribute(el, "slash") as "yes" | "no" | undefined,
  };
  return TurnSchema.parse(data);
};

export const mapMordentElement = (el: Element): Mordent => {
  const data: Partial<Mordent> = {
    placement: getAttribute(el, "placement") as "above" | "below" | undefined,
    accelerate: getAttribute(el, "accelerate") as "yes" | "no" | undefined,
    beats: parseOptionalNumberAttribute(el, "beats"),
    secondBeats: parseOptionalNumberAttribute(el, "second-beats"),
    lastBeat: parseOptionalNumberAttribute(el, "last-beat"),
    long: getAttribute(el, "long") as "yes" | "no" | undefined,
    approach: getAttribute(el, "approach") as "above" | "below" | undefined,
    departure: getAttribute(el, "departure") as "above" | "below" | undefined,
  };
  return MordentSchema.parse(data);
};

export const mapSchleiferElement = (el: Element): Schleifer => {
  const data: Partial<Schleifer> = {
    placement: getAttribute(el, "placement") as "above" | "below" | undefined,
  };
  return SchleiferSchema.parse(data);
};

export const mapOtherOrnamentElement = (el: Element): OtherOrnament => {
  const data: Partial<OtherOrnament> = {
    value: el.textContent?.trim() || undefined,
    placement: getAttribute(el, "placement") as "above" | "below" | undefined,
    smufl: getAttribute(el, "smufl") || undefined,
  };
  return OtherOrnamentSchema.parse(data);
};

export const mapAccidentalMarkElement = (el: Element): Accidental => {
  const value = el.textContent?.trim() || "";
  return AccidentalSchema.parse({ value: value as AccidentalValue });
};

export const mapOrnamentsElement = (element: Element): Ornaments => {
  const data: Partial<Ornaments> = {};
  const trillMarks = Array.from(element.querySelectorAll("trill-mark"));
  if (trillMarks.length) data.trillMarks = trillMarks.map(mapTrillLikeElement);
  const turns = Array.from(element.querySelectorAll("turn"));
  if (turns.length) data.turns = turns.map(mapTurnElement);
  const delayedTurns = Array.from(element.querySelectorAll("delayed-turn"));
  if (delayedTurns.length) data.delayedTurns = delayedTurns.map(mapTurnElement);
  const invertedTurns = Array.from(element.querySelectorAll("inverted-turn"));
  if (invertedTurns.length)
    data.invertedTurns = invertedTurns.map(mapTurnElement);
  const delayedInvertedTurns = Array.from(
    element.querySelectorAll("delayed-inverted-turn"),
  );
  if (delayedInvertedTurns.length)
    data.delayedInvertedTurns = delayedInvertedTurns.map(mapTurnElement);
  const verticalTurns = Array.from(element.querySelectorAll("vertical-turn"));
  if (verticalTurns.length)
    data.verticalTurns = verticalTurns.map(mapTrillLikeElement);
  const invertedVerticalTurns = Array.from(
    element.querySelectorAll("inverted-vertical-turn"),
  );
  if (invertedVerticalTurns.length)
    data.invertedVerticalTurns = invertedVerticalTurns.map(mapTrillLikeElement);
  const shakes = Array.from(element.querySelectorAll("shake"));
  if (shakes.length) data.shakes = shakes.map(mapTrillLikeElement);
  const wavyLines = Array.from(element.querySelectorAll("wavy-line"));
  if (wavyLines.length) data.wavyLines = wavyLines.map(mapWavyLineElement);
  const mordents = Array.from(element.querySelectorAll("mordent"));
  if (mordents.length) data.mordents = mordents.map(mapMordentElement);
  const invertedMordents = Array.from(
    element.querySelectorAll("inverted-mordent"),
  );
  if (invertedMordents.length)
    data.invertedMordents = invertedMordents.map(mapMordentElement);
  const schleifers = Array.from(element.querySelectorAll("schleifer"));
  if (schleifers.length) data.schleifers = schleifers.map(mapSchleiferElement);
  const tremolos = Array.from(element.querySelectorAll("tremolo"));
  if (tremolos.length) data.tremolos = tremolos.map(mapTremoloElement);
  const haydns = Array.from(element.querySelectorAll("haydn"));
  if (haydns.length) data.haydns = haydns.map(mapTrillLikeElement);
  const otherOrnaments = Array.from(element.querySelectorAll("other-ornament"));
  if (otherOrnaments.length)
    data.otherOrnaments = otherOrnaments.map(mapOtherOrnamentElement);
  const accidentalMarks = Array.from(
    element.querySelectorAll("accidental-mark"),
  );
  if (accidentalMarks.length)
    data.accidentalMarks = accidentalMarks.map(mapAccidentalMarkElement);
  return OrnamentsSchema.parse(data);
};

export const mapTechnicalElement = (element: Element): Technical => {
  const data: Partial<Technical> = {};
  const upBows = Array.from(element.querySelectorAll("up-bow"));
  if (upBows.length) data.upBows = upBows.map(mapSchleiferElement);
  const downBows = Array.from(element.querySelectorAll("down-bow"));
  if (downBows.length) data.downBows = downBows.map(mapSchleiferElement);
  const harmonics = Array.from(element.querySelectorAll("harmonic"));
  if (harmonics.length) data.harmonics = harmonics.map(mapSchleiferElement);
  const openStrings = Array.from(element.querySelectorAll("open-string"));
  if (openStrings.length)
    data.openStrings = openStrings.map(mapSchleiferElement);
  const thumbPositions = Array.from(element.querySelectorAll("thumb-position"));
  if (thumbPositions.length)
    data.thumbPositions = thumbPositions.map(mapSchleiferElement);
  const fingerings = Array.from(element.querySelectorAll("fingering"));
  if (fingerings.length)
    data.fingerings = fingerings.map((el) =>
      FingeringSchema.parse({
        value: el.textContent?.trim() || undefined,
        substitution: getAttribute(el, "substitution") as
          | "yes"
          | "no"
          | undefined,
        alternate: getAttribute(el, "alternate") as "yes" | "no" | undefined,
        placement: getAttribute(el, "placement") as
          | "above"
          | "below"
          | undefined,
      }),
    );
  const plucks = Array.from(element.querySelectorAll("pluck"));
  if (plucks.length)
    data.plucks = plucks.map((el) =>
      ValuePlacementSchema.parse({
        value: el.textContent?.trim() || undefined,
        placement: getAttribute(el, "placement") as
          | "above"
          | "below"
          | undefined,
      }),
    );
  const frets = Array.from(element.querySelectorAll("fret"));
  if (frets.length)
    data.frets = frets.map((el) =>
      FretSchema.parse({
        value:
          parseOptionalNumberAttribute(el, "") ??
          (el.textContent ? parseInt(el.textContent, 10) : undefined),
        placement: getAttribute(el, "placement") as
          | "above"
          | "below"
          | undefined,
      }),
    );
  const strings = Array.from(element.querySelectorAll("string"));
  if (strings.length)
    data.strings = strings.map((el) =>
      StringSchema.parse({
        value:
          parseOptionalNumberAttribute(el, "") ??
          (el.textContent ? parseInt(el.textContent, 10) : undefined),
        placement: getAttribute(el, "placement") as
          | "above"
          | "below"
          | undefined,
      }),
    );
  const hammerOns = Array.from(element.querySelectorAll("hammer-on"));
  if (hammerOns.length)
    data.hammerOns = hammerOns.map((el) =>
      HammerOnPullOffSchema.parse({
        value: el.textContent?.trim() || undefined,
        type: getAttribute(el, "type") as "start" | "stop",
        number: parseOptionalNumberAttribute(el, "number"),
        placement: getAttribute(el, "placement") as
          | "above"
          | "below"
          | undefined,
      }),
    );
  const pullOffs = Array.from(element.querySelectorAll("pull-off"));
  if (pullOffs.length)
    data.pullOffs = pullOffs.map((el) =>
      HammerOnPullOffSchema.parse({
        value: el.textContent?.trim() || undefined,
        type: getAttribute(el, "type") as "start" | "stop",
        number: parseOptionalNumberAttribute(el, "number"),
        placement: getAttribute(el, "placement") as
          | "above"
          | "below"
          | undefined,
      }),
    );
  const bends = Array.from(element.querySelectorAll("bend"));
  if (bends.length)
    data.bends = bends.map((el) =>
      BendSchema.parse({
        shape: getAttribute(el, "shape") as "angled" | "curved" | undefined,
        bendAlter:
          parseOptionalNumberAttribute(
            el.querySelector("bend-alter") || el,
            "",
          ) || undefined,
        release: el.querySelector("release") ? true : undefined,
        withBar: el.querySelector("with-bar")?.textContent?.trim() || undefined,
        placement: getAttribute(el, "placement") as
          | "above"
          | "below"
          | undefined,
      }),
    );
  const taps = Array.from(element.querySelectorAll("tap"));
  if (taps.length)
    data.taps = taps.map((el) =>
      TapSchema.parse({
        value: el.textContent?.trim() || undefined,
        hand: getAttribute(el, "hand") as "left" | "right" | undefined,
        placement: getAttribute(el, "placement") as
          | "above"
          | "below"
          | undefined,
      }),
    );
  const others = Array.from(element.querySelectorAll("other-technical"));
  if (others.length)
    data.otherTechnical = others.map((el) =>
      OtherTechnicalSchema.parse({
        value: el.textContent?.trim() || undefined,
        smufl: getAttribute(el, "smufl") || undefined,
        placement: getAttribute(el, "placement") as
          | "above"
          | "below"
          | undefined,
      }),
    );
  return TechnicalSchema.parse(data);
};

export const mapGlissandoElement = (element: Element): Glissando => {
  const glissandoData: Partial<Glissando> = {
    value: element.textContent?.trim() || undefined,
    type: getAttribute(element, "type") as "start" | "stop" | undefined,
    number: parseOptionalNumberAttribute(element, "number"),
  };
  if (!glissandoData.type) {
    throw new Error('<glissando> element requires a "type" attribute.');
  }
  return GlissandoSchema.parse(glissandoData);
};

export const mapSlideElement = (element: Element): Slide => {
  const slideData: Partial<Slide> = {
    value: element.textContent?.trim() || undefined,
    type: getAttribute(element, "type") as "start" | "stop" | undefined,
    number: parseOptionalNumberAttribute(element, "number"),
  };
  if (!slideData.type) {
    throw new Error('<slide> element requires a "type" attribute.');
  }
  return SlideSchema.parse(slideData);
};

export const mapTremoloElement = (element: Element): Tremolo => {
  const valueText = element.textContent?.trim();
  const marks = valueText ? parseInt(valueText, 10) : undefined;
  const tremoloData: Partial<Tremolo> = {
    value: marks ?? 0,
  };
  const typeAttr = getAttribute(element, "type") as
    | "single"
    | "start"
    | "stop"
    | "unmeasured"
    | undefined;
  if (typeAttr) tremoloData.type = typeAttr;
  return TremoloSchema.parse(tremoloData);
};

export const mapOtherNotationElement = (element: Element): OtherNotation => {
  const data: Partial<OtherNotation> = {
    value: element.textContent?.trim() || undefined,
    type: getAttribute(element, "type") as
      | "start"
      | "stop"
      | "single"
      | undefined,
    number: parseOptionalNumberAttribute(element, "number"),
  };
  if (!data.type) {
    throw new Error('<other-notation> element requires a "type" attribute.');
  }
  return OtherNotationSchema.parse(data);
};

export const mapArpeggiateElement = (element: Element): Arpeggiate => {
  const data: Partial<Arpeggiate> = {
    number: parseOptionalNumberAttribute(element, "number"),
    direction: getAttribute(element, "direction") as "up" | "down" | undefined,
    unbroken: getAttribute(element, "unbroken") as "yes" | "no" | undefined,
  };
  return ArpeggiateSchema.parse(data);
};

export const mapNonArpeggiateElement = (element: Element): NonArpeggiate => {
  const typeAttr = getAttribute(element, "type") as
    | "top"
    | "bottom"
    | undefined;
  if (!typeAttr) {
    throw new Error('<non-arpeggiate> element requires a "type" attribute.');
  }
  const data: Partial<NonArpeggiate> = {
    type: typeAttr,
    number: parseOptionalNumberAttribute(element, "number"),
  };
  return NonArpeggiateSchema.parse(data);
};

// Helper function to map a <words> element (within <direction-type>)
export const mapWordsElement = (element: Element): Words => {
  const text = element.textContent?.trim() ?? "";
  const formatting: Partial<TextFormatting> = {};
  const fontFamily = getAttribute(element, "font-family");
  const fontStyleAttr = getAttribute(element, "font-style");
  const fontSize = getAttribute(element, "font-size");
  const fontWeightAttr = getAttribute(element, "font-weight");
  const justifyAttr = getAttribute(element, "justify");
  const defaultX = parseOptionalNumberAttribute(element, "default-x");
  const defaultY = parseOptionalNumberAttribute(element, "default-y");
  const valignAttr = getAttribute(element, "valign");
  const colorAttr = getAttribute(element, "color");

  if (fontFamily) formatting.fontFamily = fontFamily;
  if (fontSize) formatting.fontSize = fontSize;
  if (defaultX !== undefined) formatting.defaultX = defaultX;
  if (defaultY !== undefined) formatting.defaultY = defaultY;
  if (colorAttr) formatting.color = colorAttr;

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

  const wordsData: Partial<Words> = { text };
  if (Object.keys(formatting).length > 0) {
    wordsData.formatting = formatting as TextFormatting;
  }

  try {
    return WordsSchema.parse(wordsData);
  } catch {
    // console.warn("Words parse error. Data:", JSON.stringify(wordsData, null, 2), "Error:", (e as z.ZodError).errors, element.outerHTML);
    // Fallback or rethrow if critical
    // For now, if parsing fails, return object without formatting or throw
    // To match CreditWords, return as is and let tests catch if this is wrong.
    // However, WordsSchema requires text, and formatting is optional.
    // If formatting parse fails, we should probably still return the text.
    // A more robust approach would be to parse formatting separately and only add if successful.
    return WordsSchema.parse({ text }); // Return with only text if formatting parse fails (or was empty initially)
  }
};

export const mapRehearsalElement = (element: Element): Rehearsal => {
  const text = element.textContent?.trim() ?? "";
  const formatting: Partial<TextFormatting> = {};
  const fontFamily = getAttribute(element, "font-family");
  const fontStyleAttr = getAttribute(element, "font-style");
  const fontSize = getAttribute(element, "font-size");
  const fontWeightAttr = getAttribute(element, "font-weight");
  const justifyAttr = getAttribute(element, "justify");
  const defaultX = parseOptionalNumberAttribute(element, "default-x");
  const defaultY = parseOptionalNumberAttribute(element, "default-y");
  const valignAttr = getAttribute(element, "valign");
  const colorAttr = getAttribute(element, "color");

  if (fontFamily) formatting.fontFamily = fontFamily;
  if (fontSize) formatting.fontSize = fontSize;
  if (defaultX !== undefined) formatting.defaultX = defaultX;
  if (defaultY !== undefined) formatting.defaultY = defaultY;
  if (colorAttr) formatting.color = colorAttr;
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

  const data: Partial<Rehearsal> = { text };
  if (Object.keys(formatting).length > 0)
    data.formatting = formatting as TextFormatting;
  return RehearsalSchema.parse(data);
};

export const mapOctaveShiftElement = (element: Element): OctaveShift => {
  const data: Partial<OctaveShift> = {
    type: getAttribute(element, "type") as
      | "up"
      | "down"
      | "stop"
      | "continue"
      | undefined,
  };
  const numAttr = getAttribute(element, "number");
  if (numAttr) {
    const n = parseOptionalInt(numAttr);
    if (n !== undefined) data.number = n;
  }
  const sizeAttr = getAttribute(element, "size");
  if (sizeAttr) {
    const s = parseOptionalInt(sizeAttr);
    if (s !== undefined) data.size = s;
  }
  const dashLenAttr = getAttribute(element, "dash-length");
  if (dashLenAttr) {
    const dl = parseOptionalFloat(dashLenAttr);
    if (dl !== undefined) data.dashLength = dl;
  }
  const spaceLenAttr = getAttribute(element, "space-length");
  if (spaceLenAttr) {
    const sl = parseOptionalFloat(spaceLenAttr);
    if (sl !== undefined) data.spaceLength = sl;
  }
  const defaultXAttr = getAttribute(element, "default-x");
  if (defaultXAttr) {
    const dx = parseOptionalFloat(defaultXAttr);
    if (dx !== undefined) data.defaultX = dx;
  }
  const defaultYAttr = getAttribute(element, "default-y");
  if (defaultYAttr) {
    const dy = parseOptionalFloat(defaultYAttr);
    if (dy !== undefined) data.defaultY = dy;
  }
  const relativeXAttr = getAttribute(element, "relative-x");
  if (relativeXAttr) {
    const rx = parseOptionalFloat(relativeXAttr);
    if (rx !== undefined) data.relativeX = rx;
  }
  const relativeYAttr = getAttribute(element, "relative-y");
  if (relativeYAttr) {
    const ry = parseOptionalFloat(relativeYAttr);
    if (ry !== undefined) data.relativeY = ry;
  }
  const colorAttr = getAttribute(element, "color");
  if (colorAttr) data.color = colorAttr;
  const idAttr = getAttribute(element, "id");
  if (idAttr) data.id = idAttr;
  return OctaveShiftSchema.parse(data);
};

export const mapDashesElement = (element: Element): Dashes => {
  const data: Partial<Dashes> = {
    type: getAttribute(element, "type") as
      | "start"
      | "stop"
      | "continue"
      | undefined,
  };
  const numAttr = getAttribute(element, "number");
  if (numAttr) {
    const n = parseOptionalInt(numAttr);
    if (n !== undefined) data.number = n;
  }
  const dashLenAttr = getAttribute(element, "dash-length");
  if (dashLenAttr) {
    const dl = parseOptionalFloat(dashLenAttr);
    if (dl !== undefined) data.dashLength = dl;
  }
  const spaceLenAttr = getAttribute(element, "space-length");
  if (spaceLenAttr) {
    const sl = parseOptionalFloat(spaceLenAttr);
    if (sl !== undefined) data.spaceLength = sl;
  }
  const defaultXAttr = getAttribute(element, "default-x");
  if (defaultXAttr) {
    const dx = parseOptionalFloat(defaultXAttr);
    if (dx !== undefined) data.defaultX = dx;
  }
  const defaultYAttr = getAttribute(element, "default-y");
  if (defaultYAttr) {
    const dy = parseOptionalFloat(defaultYAttr);
    if (dy !== undefined) data.defaultY = dy;
  }
  const relativeXAttr = getAttribute(element, "relative-x");
  if (relativeXAttr) {
    const rx = parseOptionalFloat(relativeXAttr);
    if (rx !== undefined) data.relativeX = rx;
  }
  const relativeYAttr = getAttribute(element, "relative-y");
  if (relativeYAttr) {
    const ry = parseOptionalFloat(relativeYAttr);
    if (ry !== undefined) data.relativeY = ry;
  }
  const colorAttr = getAttribute(element, "color");
  if (colorAttr) data.color = colorAttr;
  const idAttr = getAttribute(element, "id");
  if (idAttr) data.id = idAttr;
  return DashesSchema.parse(data);
};

export const mapBracketElement = (element: Element): Bracket => {
  const data: Partial<Bracket> = {
    type: getAttribute(element, "type") as
      | "start"
      | "stop"
      | "continue"
      | undefined,
  };
  const numAttr = getAttribute(element, "number");
  if (numAttr) {
    const n = parseOptionalInt(numAttr);
    if (n !== undefined) data.number = n;
  }
  const lineEndAttr = getAttribute(element, "line-end");
  if (lineEndAttr)
    data.lineEnd = lineEndAttr as "up" | "down" | "both" | "arrow" | "none";
  const endLenAttr = getAttribute(element, "end-length");
  if (endLenAttr) {
    const el = parseOptionalFloat(endLenAttr);
    if (el !== undefined) data.endLength = el;
  }
  const lineTypeAttr = getAttribute(element, "line-type");
  if (lineTypeAttr) data.lineType = lineTypeAttr;
  const dashLenAttr = getAttribute(element, "dash-length");
  if (dashLenAttr) {
    const dl = parseOptionalFloat(dashLenAttr);
    if (dl !== undefined) data.dashLength = dl;
  }
  const spaceLenAttr = getAttribute(element, "space-length");
  if (spaceLenAttr) {
    const sl = parseOptionalFloat(spaceLenAttr);
    if (sl !== undefined) data.spaceLength = sl;
  }
  const defaultXAttr = getAttribute(element, "default-x");
  if (defaultXAttr) {
    const dx = parseOptionalFloat(defaultXAttr);
    if (dx !== undefined) data.defaultX = dx;
  }
  const defaultYAttr = getAttribute(element, "default-y");
  if (defaultYAttr) {
    const dy = parseOptionalFloat(defaultYAttr);
    if (dy !== undefined) data.defaultY = dy;
  }
  const relativeXAttr = getAttribute(element, "relative-x");
  if (relativeXAttr) {
    const rx = parseOptionalFloat(relativeXAttr);
    if (rx !== undefined) data.relativeX = rx;
  }
  const relativeYAttr = getAttribute(element, "relative-y");
  if (relativeYAttr) {
    const ry = parseOptionalFloat(relativeYAttr);
    if (ry !== undefined) data.relativeY = ry;
  }
  const colorAttr = getAttribute(element, "color");
  if (colorAttr) data.color = colorAttr;
  const idAttr = getAttribute(element, "id");
  if (idAttr) data.id = idAttr;
  return BracketSchema.parse(data);
};

export const mapImageElement = (element: Element): Image | undefined => {
  const source = getAttribute(element, "source");
  const typeAttr = getAttribute(element, "type");
  if (!source || !typeAttr) return undefined;
  const data: Partial<Image> = { source, type: typeAttr };
  const h = parseOptionalFloat(getAttribute(element, "height"));
  if (h !== undefined) data.height = h;
  const w = parseOptionalFloat(getAttribute(element, "width"));
  if (w !== undefined) data.width = w;
  const dx = parseOptionalFloat(getAttribute(element, "default-x"));
  if (dx !== undefined) data.defaultX = dx;
  const dy = parseOptionalFloat(getAttribute(element, "default-y"));
  if (dy !== undefined) data.defaultY = dy;
  const ha = getAttribute(element, "halign");
  if (ha && ["left", "center", "right"].includes(ha))
    data.halign = ha as "left" | "center" | "right";
  const va = getAttribute(element, "valign");
  if (va && ["top", "middle", "bottom"].includes(va))
    data.valign = va as "top" | "middle" | "bottom";
  return ImageSchema.parse(data);
};

// Helper function to map a <beat-unit> element (within <metronome>)
export const mapMetronomeBeatUnitElement = (
  element: Element,
): MetronomeBeatUnit => {
  const beatUnitDotElements = Array.from(
    element.querySelectorAll("beat-unit-dot"),
  );
  const beatUnitData = {
    "beat-unit": element.textContent?.trim() ?? "",
    "beat-unit-dot":
      beatUnitDotElements.length > 0
        ? beatUnitDotElements.map(() => ({}))
        : undefined,
  };
  return MetronomeBeatUnitSchema.parse(beatUnitData);
};

// Helper function to map a <per-minute> element (within <metronome>)
export const mapMetronomePerMinuteElement = (
  element: Element,
): MetronomePerMinute => {
  const formatting: Partial<TextFormatting> = {};
  const fontFamily = getAttribute(element, "font-family");
  const fontStyleAttr = getAttribute(element, "font-style");
  const fontSize = getAttribute(element, "font-size");
  const fontWeightAttr = getAttribute(element, "font-weight");
  const colorAttr = getAttribute(element, "color");

  if (fontFamily) formatting.fontFamily = fontFamily;
  if (fontSize) formatting.fontSize = fontSize;
  if (colorAttr) formatting.color = colorAttr;
  if (fontStyleAttr === "normal" || fontStyleAttr === "italic") {
    formatting.fontStyle = fontStyleAttr;
  }
  if (fontWeightAttr === "normal" || fontWeightAttr === "bold") {
    formatting.fontWeight = fontWeightAttr;
  }

  const perMinuteData: Partial<MetronomePerMinute> = {
    "per-minute": element.textContent?.trim() ?? "",
  };
  if (Object.keys(formatting).length > 0) {
    perMinuteData.formatting = formatting as TextFormatting;
  }
  return MetronomePerMinuteSchema.parse(perMinuteData);
};

// Helper to map <metronome-note>
export const mapMetronomeNoteElement = (element: Element): MetronomeNote => {
  const typeElement = element.querySelector("metronome-type");
  const dotElements = Array.from(element.querySelectorAll("metronome-dot"));
  const noteData: Partial<MetronomeNote> = {};
  if (typeElement)
    noteData["metronome-type"] = typeElement.textContent?.trim() ?? "";
  if (dotElements.length > 0)
    noteData["metronome-dot"] = dotElements.map(() => ({}));
  return MetronomeNoteSchema.parse(noteData);
};

// Helper function to map a <metronome> element (within <direction-type>)
export const mapMetronomeElement = (element: Element): Metronome => {
  const beatUnitElement = element.querySelector("beat-unit");
  const perMinuteElement = element.querySelector("per-minute");
  const metronomeNoteElements = Array.from(
    element.querySelectorAll("metronome-note"),
  );
  const relationElement = element.querySelector("metronome-relation");
  const metronomeData: Partial<Metronome> = {};
  if (beatUnitElement) {
    metronomeData["beat-unit"] = mapMetronomeBeatUnitElement(beatUnitElement);
  }
  if (perMinuteElement) {
    metronomeData["per-minute"] =
      mapMetronomePerMinuteElement(perMinuteElement);
  }
  if (metronomeNoteElements.length > 0) {
    metronomeData["metronome-note"] = metronomeNoteElements.map(
      mapMetronomeNoteElement,
    );
  }
  if (relationElement) {
    metronomeData["metronome-relation"] =
      relationElement.textContent?.trim() ?? "";
  }
  return MetronomeSchema.parse(metronomeData);
};

// Helper function to map a <direction-type> element (within <direction>)
export const mapDirectionTypeElement = (element: Element): DirectionType => {
  const wordsElement = element.querySelector("words");
  const metronomeElement = element.querySelector("metronome");
  const dynamicsElement = element.querySelector("dynamics");
  const pedalElement = element.querySelector("pedal");
  const wedgeElement = element.querySelector("wedge");
  const segnoElement = element.querySelector("segno");
  const codaElement = element.querySelector("coda");
  const rehearsalElement = element.querySelector("rehearsal");
  const octaveShiftElement = element.querySelector("octave-shift");
  const dashesElement = element.querySelector("dashes");
  const bracketElement = element.querySelector("bracket");
  const imageElement = element.querySelector("image");
  const directionTypeData: Partial<DirectionType> = {};
  if (wordsElement) {
    directionTypeData.words = mapWordsElement(wordsElement);
  }
  if (metronomeElement) {
    directionTypeData.metronome = mapMetronomeElement(metronomeElement);
  }
  if (dynamicsElement) {
    const dynChild = dynamicsElement.firstElementChild;
    const dynValue = dynChild
      ? dynChild.tagName
      : (dynamicsElement.textContent?.trim() ?? "");
    const formatting: Partial<TextFormatting> = {};
    const colorAttr = getAttribute(dynamicsElement, "color");
    if (colorAttr) formatting.color = colorAttr;
    if (Object.keys(formatting).length > 0) {
      directionTypeData.dynamics = DynamicsSchema.parse({
        value: dynValue,
        formatting: formatting as TextFormatting,
      });
    } else {
      directionTypeData.dynamics = DynamicsSchema.parse({ value: dynValue });
    }
  }
  if (pedalElement) {
    const pedalType = getAttribute(pedalElement, "type") as
      | "start"
      | "stop"
      | "change"
      | "continue"
      | undefined;
    directionTypeData.pedal = PedalSchema.parse({ type: pedalType });
  }
  if (wedgeElement) {
    const wedgeData: Partial<Wedge> = {
      type: getAttribute(wedgeElement, "type") as
        | "crescendo"
        | "diminuendo"
        | "stop"
        | "continue"
        | undefined,
    };
    const spread = getAttribute(wedgeElement, "spread");
    if (spread) {
      const sp = parseFloat(spread);
      if (!isNaN(sp)) wedgeData.spread = sp;
    }
    const numberAttr = getAttribute(wedgeElement, "number");
    if (numberAttr) {
      const num = parseOptionalInt(numberAttr);
      if (num !== undefined) wedgeData.number = num;
    }
    const nienteAttr = getAttribute(wedgeElement, "niente");
    if (nienteAttr === "yes" || nienteAttr === "no")
      wedgeData.niente = nienteAttr;
    const lineTypeAttr = getAttribute(wedgeElement, "line-type");
    if (lineTypeAttr) wedgeData.lineType = lineTypeAttr;
    const dashLenAttr = getAttribute(wedgeElement, "dash-length");
    if (dashLenAttr) {
      const dl = parseOptionalFloat(dashLenAttr);
      if (dl !== undefined) wedgeData.dashLength = dl;
    }
    const spaceLenAttr = getAttribute(wedgeElement, "space-length");
    if (spaceLenAttr) {
      const sl = parseOptionalFloat(spaceLenAttr);
      if (sl !== undefined) wedgeData.spaceLength = sl;
    }
    const defaultXAttr = getAttribute(wedgeElement, "default-x");
    if (defaultXAttr) {
      const dx = parseOptionalFloat(defaultXAttr);
      if (dx !== undefined) wedgeData.defaultX = dx;
    }
    const defaultYAttr = getAttribute(wedgeElement, "default-y");
    if (defaultYAttr) {
      const dy = parseOptionalFloat(defaultYAttr);
      if (dy !== undefined) wedgeData.defaultY = dy;
    }
    const relativeXAttr = getAttribute(wedgeElement, "relative-x");
    if (relativeXAttr) {
      const rx = parseOptionalFloat(relativeXAttr);
      if (rx !== undefined) wedgeData.relativeX = rx;
    }
    const relativeYAttr = getAttribute(wedgeElement, "relative-y");
    if (relativeYAttr) {
      const ry = parseOptionalFloat(relativeYAttr);
      if (ry !== undefined) wedgeData.relativeY = ry;
    }
    const colorAttr = getAttribute(wedgeElement, "color");
    if (colorAttr) wedgeData.color = colorAttr;
    const idAttr = getAttribute(wedgeElement, "id");
    if (idAttr) wedgeData.id = idAttr;
    directionTypeData.wedge = WedgeSchema.parse(wedgeData);
  }
  if (rehearsalElement) {
    directionTypeData.rehearsal = mapRehearsalElement(rehearsalElement);
  }
  if (octaveShiftElement) {
    directionTypeData.octaveShift = mapOctaveShiftElement(octaveShiftElement);
  }
  if (dashesElement) {
    directionTypeData.dashes = mapDashesElement(dashesElement);
  }
  if (bracketElement) {
    directionTypeData.bracket = mapBracketElement(bracketElement);
  }
  if (imageElement) {
    const img = mapImageElement(imageElement);
    if (img) directionTypeData.image = img;
  }
  if (segnoElement) {
    directionTypeData.segno = SegnoSchema.parse({});
  }
  if (codaElement) {
    directionTypeData.coda = CodaSchema.parse({});
  }
  return DirectionTypeSchema.parse(directionTypeData);
};
