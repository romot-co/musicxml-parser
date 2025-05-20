import { z } from "zod";
import type {
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
  Transpose,
  StaffDetails,
  StaffTuning,
  LineDetail,
  MeasureStyle,
  MultipleRest,
  MeasureRepeat,
  BeatRepeat,
  Slash,
  AccidentalValue,
  Notations,
  Barline,
  BarStyle,
  Repeat,
  Ending,
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
  Credit,
  Harmony,
  Backup,
  Forward,
  Print,
  Sound,
  MeasureContent,
  StaffLayout,
  TimewisePart,
  TimewiseMeasure,
  ScoreTimewise,
  Supports,
  Relation,
  Miscellaneous,
  MiscellaneousField,
  ScoreInstrument,
  MidiInstrument,
  MidiDevice,
  FiguredBass,
  Figure,
  InstrumentChange,
  Grouping,
  Feature,
  DisplayText,
  AccidentalText,
  PartNameDisplay,
  PartAbbreviationDisplay,
} from "../../types";
import {
  MeasureSchema,
  PartSchema,
  ScorePartSchema,
  PartListSchema,
  PartGroupSchema,
  ScorePartwiseSchema,
  ScoreTimewiseSchema,
  TimewisePartSchema,
  TimewiseMeasureSchema,
  AttributesSchema,
  DirectionSchema,
  TransposeSchema,
  StaffDetailsSchema,
  StaffTuningSchema,
  LineDetailSchema,
  MeasureStyleSchema,
  MultipleRestSchema,
  MeasureRepeatSchema,
  BeatRepeatSchema,
  SlashSchema,
  NotationsSchema,
  BarlineSchema,
  RepeatSchema,
  EndingSchema,
  WorkSchema,
  OpusSchema,
  IdentificationSchema,
  CreatorSchema,
  RightsSchema,
  EncodingSchema,
  BeamSchema,
  PartSymbolSchema,
  HarmonySchema,
  GroupSymbolValueEnum,
  RootSchema,
  KindSchema,
  BassSchema,
  DegreeSchema,
  RootStepSchema,
  KindValueEnum,
  BassStepSchema,
  DegreeTypeEnum,
  BackupSchema,
  ForwardSchema,
  PrintSchema,
  SoundSchema,
  SupportsSchema,
  RelationSchema,
  MiscellaneousSchema,
  MiscellaneousFieldSchema,
  ScoreInstrumentSchema,
  FiguredBassSchema,
  FigureSchema,
  GroupingSchema,
  FeatureSchema,
  FrameSchema,
  FrameNoteSchema,
  FirstFretSchema,
  MidiDeviceSchema,
  MidiInstrumentSchema,
  InstrumentChangeSchema,
  DisplayTextSchema,
  AccidentalTextSchema,
  PartNameDisplaySchema,
  PartAbbreviationDisplaySchema,
} from "../../schemas";
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
import { mapToStandardInstrumentId } from "../../utils/instrumentMapping";
import {
  mapNoteElement,
  mapKeyElement,
  mapTimeElement,
  mapClefElement,
  mapSlurElement,
  mapFermataElement,
  mapWavyLineElement,
  mapFootnoteElement,
  mapLevelElement,
  mapArticulationsElement,
  mapTiedElement,
  mapTupletElement,
  mapGlissandoElement,
  mapSlideElement,
  mapTremoloElement,
  mapOtherNotationElement,
  mapOrnamentsElement,
  mapNonArpeggiateElement,
  mapArpeggiateElement,
  mapTechnicalElement,
  mapDirectionTypeElement,
} from "./noteMappers";

// Mapper for <direction> element
export const mapDirectionElement = (element: Element): Direction => {
  const directionTypeElements = Array.from(
    element.querySelectorAll("direction-type"),
  );
  const placement = getAttribute(element, "placement") as
    | "above"
    | "below"
    | "between"
    | undefined;
  const staff = parseOptionalNumberAttribute(element, "staff");
  const directiveAttr = getAttribute(element, "directive") as
    | "yes"
    | "no"
    | undefined;
  const offsetVal = parseFloatContent(element, "offset");
  const soundEl = element.querySelector("sound");
  const directionData: Partial<Direction> = {
    _type: "direction",
    direction_type: directionTypeElements.map(mapDirectionTypeElement),
    placement: placement,
    staff: staff,
    directive: directiveAttr,
  };
  if (offsetVal !== undefined) directionData.offset = offsetVal;
  if (soundEl) directionData.sound = mapSoundElement(soundEl);
  return DirectionSchema.parse(directionData);
};

// Helper function to map a <notations> element
export const mapNotationsElement = (element: Element): Notations => {
  const slurElements = Array.from(element.querySelectorAll("slur"));
  const articulationsElements = Array.from(
    element.querySelectorAll("articulations"),
  );
  const tiedElements = Array.from(element.querySelectorAll("tied"));
  const tupletElements = Array.from(element.querySelectorAll("tuplet"));
  const ornamentsElements = Array.from(element.querySelectorAll("ornaments"));
  const technicalElements = Array.from(element.querySelectorAll("technical"));
  const glissandoElements = Array.from(element.querySelectorAll("glissando"));
  const slideElements = Array.from(element.querySelectorAll("slide"));
  const tremoloElements = Array.from(element.querySelectorAll("tremolo"));
  const arpeggiateElements = Array.from(element.querySelectorAll("arpeggiate"));
  const nonArpeggiateElements = Array.from(
    element.querySelectorAll("non-arpeggiate"),
  );
  const otherNotationElements = Array.from(
    element.querySelectorAll("other-notation"),
  );

  const notationsData: Partial<Notations> = {};

  if (slurElements.length > 0) {
    notationsData.slurs = slurElements.map(mapSlurElement);
  }
  if (articulationsElements.length > 0) {
    notationsData.articulations = articulationsElements.map(
      mapArticulationsElement,
    );
  }
  if (tiedElements.length > 0) {
    notationsData.tied = tiedElements.map(mapTiedElement);
  }
  if (tupletElements.length > 0) {
    notationsData.tuplets = tupletElements.map(mapTupletElement);
  }
  if (ornamentsElements.length > 0) {
    notationsData.ornaments = ornamentsElements.map(mapOrnamentsElement);
  }
  if (technicalElements.length > 0) {
    notationsData.technical = technicalElements.map(mapTechnicalElement);
  }
  if (glissandoElements.length > 0) {
    notationsData.glissandos = glissandoElements.map(mapGlissandoElement);
  }
  if (slideElements.length > 0) {
    notationsData.slides = slideElements.map(mapSlideElement);
  }
  if (tremoloElements.length > 0) {
    notationsData.tremolos = tremoloElements.map(mapTremoloElement);
  }
  if (arpeggiateElements.length > 0) {
    notationsData.arpeggiates = arpeggiateElements.map(mapArpeggiateElement);
  }
  if (nonArpeggiateElements.length > 0) {
    notationsData.nonArpeggiates = nonArpeggiateElements.map(
      mapNonArpeggiateElement,
    );
  }
  if (otherNotationElements.length > 0) {
    notationsData.otherNotations = otherNotationElements.map(
      mapOtherNotationElement,
    );
  }

  return NotationsSchema.parse(notationsData);
};

// Helper function to map a <repeat> element (within <barline>)
const mapRepeatElement = (element: Element): Repeat => {
  const direction = getAttribute(element, "direction") as
    | "forward"
    | "backward";
  if (!direction) {
    throw new Error('<repeat> element requires a "direction" attribute.');
  }
  const repeatData = {
    direction: direction,
    times: parseOptionalNumberAttribute(element, "times"),
    winged: getAttribute(element, "winged") as
      | "none"
      | "straight"
      | "curved"
      | "double-straight"
      | "double-curved"
      | undefined,
    afterJump: getAttribute(element, "after-jump") as "yes" | "no" | undefined,
  };
  return RepeatSchema.parse(repeatData);
};

// Helper function to map an <ending> element (within <barline>)
const mapEndingElement = (element: Element): Ending => {
  const number = getAttribute(element, "number");
  const type = getAttribute(element, "type") as
    | "start"
    | "stop"
    | "discontinue";
  if (!number || !type) {
    throw new Error(
      '<ending> element requires "number" and "type" attributes.',
    );
  }
  const endingData: Partial<Ending> = {
    number: number,
    type: type,
    text: element.textContent?.trim() || undefined,
    "print-object": getAttribute(element, "print-object") as
      | "yes"
      | "no"
      | undefined,
  };

  const defaultXAttr = getAttribute(element, "default-x");
  const defaultYAttr = getAttribute(element, "default-y");
  const relativeXAttr = getAttribute(element, "relative-x");
  const relativeYAttr = getAttribute(element, "relative-y");
  const fontFamily = getAttribute(element, "font-family");
  const fontStyleAttr = getAttribute(element, "font-style");
  const fontSize = getAttribute(element, "font-size");
  const fontWeightAttr = getAttribute(element, "font-weight");
  const colorAttr = getAttribute(element, "color");
  const systemAttr = getAttribute(element, "system") as
    | "none"
    | "only-top"
    | "also-top"
    | undefined;
  const endLengthAttr = getAttribute(element, "end-length");
  const textXAttr = getAttribute(element, "text-x");
  const textYAttr = getAttribute(element, "text-y");

  if (defaultXAttr) {
    const val = parseFloat(defaultXAttr);
    if (!isNaN(val)) endingData.defaultX = val;
  }
  if (defaultYAttr) {
    const val = parseFloat(defaultYAttr);
    if (!isNaN(val)) endingData.defaultY = val;
  }
  if (relativeXAttr) {
    const val = parseFloat(relativeXAttr);
    if (!isNaN(val)) endingData.relativeX = val;
  }
  if (relativeYAttr) {
    const val = parseFloat(relativeYAttr);
    if (!isNaN(val)) endingData.relativeY = val;
  }
  if (fontFamily) endingData.fontFamily = fontFamily;
  if (fontSize) endingData.fontSize = fontSize;
  if (colorAttr) endingData.color = colorAttr;
  if (fontStyleAttr === "normal" || fontStyleAttr === "italic") {
    endingData.fontStyle = fontStyleAttr;
  }
  if (fontWeightAttr === "normal" || fontWeightAttr === "bold") {
    endingData.fontWeight = fontWeightAttr;
  }
  if (systemAttr) endingData.system = systemAttr;
  if (endLengthAttr) {
    const val = parseFloat(endLengthAttr);
    if (!isNaN(val)) endingData.endLength = val;
  }
  if (textXAttr) {
    const val = parseFloat(textXAttr);
    if (!isNaN(val)) endingData.textX = val;
  }
  if (textYAttr) {
    const val = parseFloat(textYAttr);
    if (!isNaN(val)) endingData.textY = val;
  }

  return EndingSchema.parse(endingData);
};

// Helper function to map a <barline> element
export const mapBarlineElement = (element: Element): Barline => {
  const barStyleElement = element.querySelector("bar-style");
  const repeatElement = element.querySelector("repeat");
  const endingElement = element.querySelector("ending");
  const codaElement = element.querySelector("coda");
  const segnoElement = element.querySelector("segno");
  const wavyLineElement = element.querySelector("wavy-line");
  const footnoteElement = element.querySelector("footnote");
  const levelElement = element.querySelector("level");
  const fermataElements = Array.from(element.querySelectorAll("fermata"));

  const barlineData: Partial<Barline> = {
    _type: "barline",
    location: getAttribute(element, "location") as
      | "left"
      | "right"
      | "middle"
      | undefined,
  };

  if (barStyleElement) {
    barlineData.barStyle = barStyleElement.textContent?.trim() as
      | BarStyle
      | undefined;
    const color = getAttribute(barStyleElement, "color");
    if (color) barlineData.barStyleColor = color;
  }
  if (repeatElement) {
    barlineData.repeat = mapRepeatElement(repeatElement);
  }
  if (endingElement) {
    barlineData.ending = mapEndingElement(endingElement);
  }
  if (codaElement) {
    barlineData.coda = {};
  }
  if (segnoElement) {
    barlineData.segno = {};
  }
  if (footnoteElement) {
    barlineData.footnote = mapFootnoteElement(footnoteElement);
  }
  if (levelElement) {
    barlineData.level = mapLevelElement(levelElement);
  }
  if (wavyLineElement) {
    barlineData.wavyLine = mapWavyLineElement(wavyLineElement);
  }
  if (fermataElements.length > 0) {
    barlineData.fermata = fermataElements.map(mapFermataElement);
  }
  barlineData.segnoAttr = getAttribute(element, "segno");
  barlineData.codaAttr = getAttribute(element, "coda");
  const divisionsAttr = getAttribute(element, "divisions");
  if (divisionsAttr) {
    const val = parseInt(divisionsAttr, 10);
    if (!isNaN(val)) barlineData.divisions = val;
  }
  const idAttr = getAttribute(element, "id");
  if (idAttr) barlineData.id = idAttr;

  return BarlineSchema.parse(barlineData);
};

// Helper function to map a <work> element
const mapWorkElement = (element: Element): Work => {
  const workData: Partial<Work> = {
    "work-number": getTextContent(element, "work-number"),
    "work-title": getTextContent(element, "work-title"),
  };

  const opusElement = element.querySelector("opus");
  if (opusElement) {
    const opusData: Partial<Opus> = {
      href: getAttribute(opusElement, "xlink:href") ?? "",
    };
    const typeAttr = getAttribute(opusElement, "xlink:type");
    if (typeAttr) opusData.type = typeAttr;
    const roleAttr = getAttribute(opusElement, "xlink:role");
    if (roleAttr) opusData.role = roleAttr;
    const titleAttr = getAttribute(opusElement, "xlink:title");
    if (titleAttr) opusData.title = titleAttr;
    const showAttr = getAttribute(opusElement, "xlink:show");
    if (showAttr) opusData.show = showAttr;
    const actuateAttr = getAttribute(opusElement, "xlink:actuate");
    if (actuateAttr) opusData.actuate = actuateAttr;

    workData.opus = OpusSchema.parse(opusData);
  }

  return WorkSchema.parse(workData);
};

// Helper function to map a <creator> element (within <identification>)
const mapCreatorElement = (element: Element): Creator => {
  const creatorData = {
    type: getAttribute(element, "type"),
    name: element.textContent?.trim() ?? "",
  };
  return CreatorSchema.parse(creatorData);
};

// Helper function to map a <rights> element (within <identification>)
const mapRightsElement = (element: Element): Rights => {
  const rightsData = {
    type: getAttribute(element, "type"),
    text: element.textContent?.trim() ?? "",
  };
  return RightsSchema.parse(rightsData);
};

const mapSupportsElement = (element: Element): Supports | undefined => {
  const typeAttr = getAttribute(element, "type") as "yes" | "no" | undefined;
  const el = getAttribute(element, "element");
  if (!typeAttr || !el) return undefined;
  const data: Partial<Supports> = {
    type: typeAttr,
    element: el,
    attribute: getAttribute(element, "attribute") || undefined,
    value: getAttribute(element, "value") || undefined,
  };
  try {
    return SupportsSchema.parse(data);
  } catch {
    return undefined;
  }
};

const mapRelationElement = (element: Element): Relation | undefined => {
  const text = element.textContent?.trim();
  if (!text) return undefined;
  const data = {
    text,
    type: getAttribute(element, "type") || undefined,
  };
  try {
    return RelationSchema.parse(data);
  } catch {
    return undefined;
  }
};

const mapMiscellaneousFieldElement = (
  element: Element,
): MiscellaneousField | undefined => {
  const name = getAttribute(element, "name");
  const text = element.textContent?.trim();
  if (!name || text === undefined) return undefined;
  try {
    return MiscellaneousFieldSchema.parse({ name, text });
  } catch {
    return undefined;
  }
};

const mapMiscellaneousElement = (
  element: Element,
): Miscellaneous | undefined => {
  const fieldElements = Array.from(
    element.querySelectorAll("miscellaneous-field"),
  );
  const fields = fieldElements
    .map(mapMiscellaneousFieldElement)
    .filter(Boolean) as MiscellaneousField[];
  if (fields.length === 0) return undefined;
  try {
    return MiscellaneousSchema.parse({ fields });
  } catch {
    return undefined;
  }
};

// Helper function to map an <encoding> element (within <identification>)
const mapEncodingElement = (element: Element): Encoding => {
  const softwareElements = Array.from(element.querySelectorAll("software"));
  const encodingDateElements = Array.from(
    element.querySelectorAll("encoding-date"),
  );
  const encoderElements = Array.from(element.querySelectorAll("encoder"));
  const supportsElements = Array.from(element.querySelectorAll("supports"));

  const encodingData: Partial<Encoding> = {};
  if (softwareElements.length > 0) {
    encodingData.software = softwareElements.map(
      (el) => el.textContent?.trim() ?? "",
    );
  }
  if (encodingDateElements.length > 0) {
    encodingData["encoding-date"] = encodingDateElements.map(
      (el) => el.textContent?.trim() ?? "",
    );
  }
  if (encoderElements.length > 0) {
    encodingData.encoder = encoderElements.map(
      (el) => el.textContent?.trim() ?? "",
    );
  }
  if (supportsElements.length > 0) {
    const mappedSupports = supportsElements
      .map(mapSupportsElement)
      .filter(Boolean) as Supports[];
    if (mappedSupports.length > 0) encodingData.supports = mappedSupports;
  }
  return EncodingSchema.parse(encodingData);
};

// Helper function to map an <identification> element
const mapIdentificationElement = (element: Element): Identification => {
  const creatorElements = Array.from(element.querySelectorAll("creator"));
  const rightsElements = Array.from(element.querySelectorAll("rights"));
  const encodingElement = element.querySelector("encoding");
  const relationElements = Array.from(element.querySelectorAll("relation"));
  const miscellaneousElement = element.querySelector("miscellaneous");
  const source = getTextContent(element, "source");

  const identificationData: Partial<Identification> = {
    source: source,
  };

  if (creatorElements.length > 0) {
    identificationData.creators = creatorElements.map(mapCreatorElement);
  }
  if (rightsElements.length > 0) {
    identificationData.rights = rightsElements.map(mapRightsElement);
  }
  if (encodingElement) {
    identificationData.encoding = mapEncodingElement(encodingElement);
  }
  if (relationElements.length > 0) {
    const mappedRelations = relationElements
      .map(mapRelationElement)
      .filter(Boolean) as Relation[];
    if (mappedRelations.length > 0)
      identificationData.relations = mappedRelations;
  }
  if (miscellaneousElement) {
    const mappedMisc = mapMiscellaneousElement(miscellaneousElement);
    if (mappedMisc) identificationData.miscellaneous = mappedMisc;
  }
  return IdentificationSchema.parse(identificationData);
};

// Helper function to map a <beam> element
export const mapBeamElement = (element: Element): Beam | undefined => {
  const value = element.textContent?.trim() as BeamValue | undefined;
  if (!value) {
    throw new Error(
      "<beam> element must have text content specifying the beam type.",
    );
  }
  const beamData = {
    value: value,
    number: parseOptionalNumberAttribute(element, "number") ?? 1,
    repeater: getAttribute(element, "repeater") as "yes" | "no" | undefined,
    fan: getAttribute(element, "fan") as "accel" | "rit" | "none" | undefined,
    color: getAttribute(element, "color") || undefined,
  };
  return BeamSchema.parse(beamData);
};

export const mapBackupElement = (element: Element): Backup => {
  const duration = parseNumberContent(element, "duration");
  if (duration === undefined) {
    throw new Error("<backup> element requires <duration>");
  }
  const data: Backup = {
    _type: "backup",
    duration,
  };
  return BackupSchema.parse(data);
};

export const mapForwardElement = (element: Element): Forward => {
  const duration = parseNumberContent(element, "duration");
  if (duration === undefined) {
    throw new Error("<forward> element requires <duration>");
  }
  const forwardData: Partial<Forward> = {
    _type: "forward",
    duration,
  };
  const voice = getTextContent(element, "voice");
  if (voice) forwardData.voice = voice;
  const staff = parseNumberContent(element, "staff");
  if (staff !== undefined) forwardData.staff = staff;
  return ForwardSchema.parse(forwardData);
};

export const mapMeasureStyleElement = (
  element: Element,
): MeasureStyle | undefined => {
  if (!element) return undefined;

  const measureStyleData: Partial<MeasureStyle> = {
    number: parseOptionalNumberAttribute(element, "number"),
  };

  const multipleRestEl = element.querySelector("multiple-rest");
  const measureRepeatEl = element.querySelector("measure-repeat");
  const beatRepeatEl = element.querySelector("beat-repeat");
  const slashEl = element.querySelector("slash");

  let styleFound = false;
  if (multipleRestEl) {
    const mapped = mapMultipleRestElement(multipleRestEl);
    if (mapped) measureStyleData.multipleRest = mapped;
    styleFound = !!mapped;
  }
  if (!styleFound && measureRepeatEl) {
    const mapped = mapMeasureRepeatElement(measureRepeatEl);
    if (mapped) measureStyleData.measureRepeat = mapped;
    styleFound = !!mapped;
  }
  if (!styleFound && beatRepeatEl) {
    const mapped = mapBeatRepeatElement(beatRepeatEl);
    if (mapped) measureStyleData.beatRepeat = mapped;
    styleFound = !!mapped;
  }
  if (!styleFound && slashEl) {
    const mapped = mapSlashElement(slashEl);
    if (mapped) measureStyleData.slash = mapped;
    styleFound = !!mapped;
  }

  if (!styleFound && measureStyleData.number === undefined) {
    return undefined;
  }

  const cleanedData = Object.fromEntries(
    Object.entries(measureStyleData).filter(([, v]) => v !== undefined),
  );

  // Ensure that if no specific style type was parsed but attributes exist (e.g. 'number'),
  // we don't accidentally fail the .refine check if it expects one style type.
  // The refine in MeasureStyleSchema expects exactly one style if any style data is present.
  // If only 'number' is present, it means no style type, so parse should actually fail refine.
  // This logic is to ensure we pass a valid structure to Zod or nothing if it makes no sense.

  if (Object.keys(cleanedData).length === 0) return undefined;
  // If cleanedData only contains 'number' and no style type, Zod will (and should) fail refine.
  // If a style type IS present, cleanedData is what we want to parse.

  try {
    return MeasureStyleSchema.parse(cleanedData);
  } catch (e) {
    console.error(
      "Failed to parse measure-style element:",
      JSON.stringify(cleanedData, null, 2),
    );
    console.error("Validation errors:", (e as z.ZodError).errors);
    return undefined;
  }
};

// Function to map a <print> element
export const mapPrintElement = (element: Element): Print => {
  const printData: Partial<Print> = { _type: "print" };
  const newSystemAttr = getAttribute(element, "new-system");
  const newPageAttr = getAttribute(element, "new-page");
  const pageNumber = getAttribute(element, "page-number");
  const staffSpacingAttr = getAttribute(element, "staff-spacing");
  const blankPage = getAttribute(element, "blank-page");
  const idAttr = getAttribute(element, "id");

  if (newSystemAttr === "yes" || newSystemAttr === "no") {
    printData.newSystem = newSystemAttr;
  }
  if (newPageAttr === "yes" || newPageAttr === "no") {
    printData.newPage = newPageAttr;
  }
  if (pageNumber) printData.pageNumber = pageNumber;
  if (blankPage) printData.blankPage = blankPage;
  if (idAttr) printData.id = idAttr;
  if (staffSpacingAttr) {
    const ss = parseFloat(staffSpacingAttr);
    if (!isNaN(ss)) printData.staffSpacing = ss;
  }

  const pageLayoutElement = element.querySelector("page-layout");
  if (pageLayoutElement) {
    const mappedPageLayout = mapPageLayoutElement(pageLayoutElement);
    if (mappedPageLayout) printData.pageLayout = mappedPageLayout;
  }
  const systemLayoutElement = element.querySelector("system-layout");
  if (systemLayoutElement) {
    const mappedSystemLayout = mapSystemLayoutElement(systemLayoutElement);
    if (mappedSystemLayout) printData.systemLayout = mappedSystemLayout;
  }
  const staffLayoutElements = Array.from(
    element.querySelectorAll("staff-layout"),
  );
  if (staffLayoutElements.length > 0) {
    const mapped = staffLayoutElements
      .map(mapStaffLayoutElement)
      .filter(Boolean) as StaffLayout[];
    if (mapped.length > 0) printData.staffLayout = mapped;
  }

  Object.keys(printData).forEach(
    (key) =>
      printData[key as keyof Print] === undefined &&
      delete printData[key as keyof Print],
  );

  return PrintSchema.parse(printData);
};

// Function to map a <sound> element
export function mapSoundElement(element: Element): Sound {
  const soundData: Partial<Sound> = { _type: "sound" };
  const tempoAttr = getAttribute(element, "tempo");
  const dynamicsAttr = getAttribute(element, "dynamics");
  const dacapoAttr = getAttribute(element, "dacapo");
  const segnoAttr = getAttribute(element, "segno");
  const dalsegnoAttr = getAttribute(element, "dalsegno");
  const codaAttr = getAttribute(element, "coda");
  const tocodaAttr = getAttribute(element, "tocoda");
  const divisionsAttr = getAttribute(element, "divisions");
  const forwardRepeatAttr = getAttribute(element, "forward-repeat");
  const fineAttr = getAttribute(element, "fine");
  const timeOnlyAttr = getAttribute(element, "time-only");
  const pizzicatoAttr = getAttribute(element, "pizzicato");
  const panAttr = getAttribute(element, "pan");
  const elevationAttr = getAttribute(element, "elevation");
  const damperPedalAttr = getAttribute(element, "damper-pedal");
  const softPedalAttr = getAttribute(element, "soft-pedal");
  const sostenutoPedalAttr = getAttribute(element, "sostenuto-pedal");
  const idAttr = getAttribute(element, "id");

  if (tempoAttr) {
    const tempo = parseFloat(tempoAttr);
    if (!isNaN(tempo)) soundData.tempo = tempo;
  }
  if (dynamicsAttr) {
    const dyn = parseFloat(dynamicsAttr);
    if (!isNaN(dyn)) soundData.dynamics = dyn;
  }
  if (dacapoAttr === "yes" || dacapoAttr === "no") {
    soundData.dacapo = dacapoAttr;
  }
  if (segnoAttr) soundData.segno = segnoAttr;
  if (dalsegnoAttr) soundData.dalsegno = dalsegnoAttr;
  if (codaAttr) soundData.coda = codaAttr;
  if (tocodaAttr) soundData.tocoda = tocodaAttr;
  if (divisionsAttr) {
    const div = parseFloat(divisionsAttr);
    if (!isNaN(div)) soundData.divisions = div;
  }
  if (forwardRepeatAttr === "yes" || forwardRepeatAttr === "no") {
    soundData.forwardRepeat = forwardRepeatAttr;
  }
  if (fineAttr) soundData.fine = fineAttr;
  if (timeOnlyAttr) soundData.timeOnly = timeOnlyAttr;
  if (pizzicatoAttr === "yes" || pizzicatoAttr === "no") {
    soundData.pizzicato = pizzicatoAttr;
  }
  if (panAttr) {
    const pan = parseFloat(panAttr);
    if (!isNaN(pan)) soundData.pan = pan;
  }
  if (elevationAttr) {
    const elevation = parseFloat(elevationAttr);
    if (!isNaN(elevation)) soundData.elevation = elevation;
  }
  if (damperPedalAttr) {
    const val =
      damperPedalAttr === "yes" || damperPedalAttr === "no"
        ? damperPedalAttr
        : parseFloat(damperPedalAttr);
    if (val === "yes" || val === "no") {
      soundData.damperPedal = val;
    } else if (!isNaN(val as number)) {
      soundData.damperPedal = val as number;
    }
  }
  if (softPedalAttr) {
    const val =
      softPedalAttr === "yes" || softPedalAttr === "no"
        ? softPedalAttr
        : parseFloat(softPedalAttr);
    if (val === "yes" || val === "no") {
      soundData.softPedal = val;
    } else if (!isNaN(val as number)) {
      soundData.softPedal = val as number;
    }
  }
  if (sostenutoPedalAttr) {
    const val =
      sostenutoPedalAttr === "yes" || sostenutoPedalAttr === "no"
        ? sostenutoPedalAttr
        : parseFloat(sostenutoPedalAttr);
    if (val === "yes" || val === "no") {
      soundData.sostenutoPedal = val;
    } else if (!isNaN(val as number)) {
      soundData.sostenutoPedal = val as number;
    }
  }
  if (idAttr) soundData.id = idAttr;

  const instChangeElements = Array.from(
    element.querySelectorAll("instrument-change"),
  );
  if (instChangeElements.length > 0) {
    soundData.instrumentChanges = instChangeElements.map(
      mapInstrumentChangeElement,
    );
  }

  return SoundSchema.parse(soundData);
}

const mapFigureElement = (element: Element): Figure => {
  const data: Partial<Figure> = {
    prefix: getTextContent(element, "prefix"),
    figureNumber: getTextContent(element, "figure-number"),
    suffix: getTextContent(element, "suffix"),
  };
  return FigureSchema.parse(data);
};

export const mapFiguredBassElement = (element: Element): FiguredBass => {
  const figures = Array.from(element.querySelectorAll("figure"))
    .map(mapFigureElement)
    .filter(Boolean) as Figure[];
  const data: Partial<FiguredBass> = {
    _type: "figured-bass",
    figures,
    duration: parseNumberContent(element, "duration"),
  };
  const par = getAttribute(element, "parentheses") as "yes" | "no" | undefined;
  if (par) data.parentheses = par;
  return FiguredBassSchema.parse(data);
};

const mapFeatureElement = (element: Element): Feature => {
  const data: Partial<Feature> = {
    type: getAttribute(element, "type") || undefined,
    value: element.textContent?.trim() || "",
  };
  return FeatureSchema.parse(data);
};

export const mapGroupingElement = (element: Element): Grouping => {
  const features = Array.from(element.querySelectorAll("feature"))
    .map(mapFeatureElement)
    .filter(Boolean) as Feature[];
  const data: Partial<Grouping> = {
    _type: "grouping",
    type: getAttribute(element, "type") as
      | "start"
      | "stop"
      | "single"
      | undefined,
    number: getAttribute(element, "number") || undefined,
    memberOf: getAttribute(element, "member-of") || undefined,
    features: features.length > 0 ? features : undefined,
  };
  return GroupingSchema.parse(data);
};

// Function to map an <attributes> element
export const mapAttributesElement = (element: Element): Attributes => {
  const divisions = parseNumberContent(element, "divisions");
  const keyElements = Array.from(element.querySelectorAll("key"));
  const timeElements = Array.from(element.querySelectorAll("time"));
  const clefElements = Array.from(element.querySelectorAll("clef"));
  const stavesContent = getTextContent(element, "staves"); // Read content of <staves>
  const partSymbolElement = element.querySelector("part-symbol");
  const transposeElements = Array.from(element.querySelectorAll("transpose"));
  const instrumentsContent = getTextContent(element, "instruments");
  const staffDetailsElements = Array.from(
    element.querySelectorAll("staff-details"),
  );
  const measureStyleElements = Array.from(
    element.querySelectorAll("measure-style"),
  );

  const attributesData: Partial<Attributes> = {
    _type: "attributes",
  };

  if (divisions !== undefined) {
    attributesData.divisions = divisions;
  }
  if (keyElements.length > 0) {
    attributesData.key = keyElements
      .map(mapKeyElement)
      .filter(Boolean) as Key[];
  }
  if (timeElements.length > 0) {
    attributesData.time = timeElements
      .map(mapTimeElement)
      .filter(Boolean) as Time[];
  }
  if (clefElements.length > 0) {
    attributesData.clef = clefElements
      .map(mapClefElement)
      .filter(Boolean) as Clef[];
  }

  if (stavesContent !== undefined) {
    const stavesNum = parseInt(stavesContent, 10);
    if (!isNaN(stavesNum)) {
      attributesData.staves = stavesNum;
    }
  }

  if (instrumentsContent !== undefined) {
    const instrNum = parseInt(instrumentsContent, 10);
    if (!isNaN(instrNum)) {
      attributesData.instruments = instrNum;
    }
  }

  if (partSymbolElement) {
    const mappedPartSymbol = mapPartSymbolElement(partSymbolElement);
    if (mappedPartSymbol) attributesData.partSymbol = mappedPartSymbol;
  }

  if (transposeElements.length > 0) {
    const mappedTranspose = transposeElements
      .map(mapTransposeElement)
      .filter(Boolean) as Transpose[];
    if (mappedTranspose.length > 0) attributesData.transpose = mappedTranspose;
  }

  if (instrumentsContent !== undefined) {
    const instNum = parseInt(instrumentsContent, 10);
    if (!isNaN(instNum)) {
      attributesData.instruments = instNum;
    }
  }

  if (staffDetailsElements.length > 0) {
    attributesData.staffDetails = staffDetailsElements
      .map(mapStaffDetailsElement)
      .filter(Boolean) as StaffDetails[];
  }

  if (measureStyleElements.length > 0) {
    attributesData.measureStyle = measureStyleElements
      .map(mapMeasureStyleElement)
      .filter(Boolean) as MeasureStyle[];
  }

  try {
    return AttributesSchema.parse(attributesData);
  } catch (e) {
    console.error(
      "Failed to parse attributes element:",
      JSON.stringify(attributesData, null, 2),
    );
    console.error("Validation errors:", (e as z.ZodError).errors);
    throw e; // Or return a default/fallback object if appropriate
  }
};

// Mapper for <measure> element
export function mapMeasureElement(measureElement: Element): Measure {
  const content: MeasureContent[] = [];
  measureElement.childNodes.forEach((node) => {
    if (node.nodeType === 1) {
      // Element node
      const childElement = node as Element;
      let mappedElement: MeasureContent | undefined;

      switch (
        childElement.nodeName.toLowerCase() // Use toLowerCase for robustness
      ) {
        case "note":
          mappedElement = mapNoteElement(childElement);
          break;
        case "attributes":
          mappedElement = mapAttributesElement(childElement);
          break;
        case "direction":
          mappedElement = mapDirectionElement(childElement);
          break;
        case "barline":
          mappedElement = mapBarlineElement(childElement);
          break;
        case "harmony":
          mappedElement = mapHarmonyElement(childElement);
          break;
        case "figured-bass":
          mappedElement = mapFiguredBassElement(childElement);
          break;
        case "grouping":
          mappedElement = mapGroupingElement(childElement);
          break;
        case "bookmark":
          mappedElement = mapBookmarkElement(childElement);
          break;
        case "link":
          mappedElement = mapLinkElement(childElement);
          break;
        case "backup":
          mappedElement = mapBackupElement(childElement);
          break;
        case "forward":
          mappedElement = mapForwardElement(childElement);
          break;
        case "print":
          mappedElement = mapPrintElement(childElement);
          break;
        case "sound":
          mappedElement = mapSoundElement(childElement);
          break;
      }
      if (mappedElement) {
        // Before pushing, validate with the specific schema if possible (optional)
        // This helps catch issues earlier. For example, if mappedElement is Note:
        // if (childElement.nodeName.toLowerCase() === 'note') {
        //   try { NoteSchema.parse(mappedElement); } catch (e) { console.error('Note parse error', e, mappedElement); }
        // }
        content.push(mappedElement);
      }
    }
  });

  const measureNumber = measureElement.getAttribute("number") || "";
  const implicitAttr = measureElement.getAttribute("implicit");
  const nonControllingAttr = measureElement.getAttribute("non-controlling");
  const widthAttr = measureElement.getAttribute("width");

  const measureData: Partial<Measure> = {
    number: measureNumber,
    implicit: implicitAttr === "yes" ? true : undefined,
    nonControlling: nonControllingAttr === "yes" ? true : undefined,
    width: widthAttr ? parseOptionalFloat(widthAttr) : undefined,
    content: content.length > 0 ? content : undefined,
  };

  // Remove undefined properties from measureData before parsing
  const cleanedMeasureData = Object.fromEntries(
    Object.entries(measureData).filter(([_, v]) => v !== undefined),
  ) as Measure;

  // It is crucial that the returned object strictly matches the Measure schema
  try {
    return MeasureSchema.parse(cleanedMeasureData);
  } catch (e) {
    console.error(
      "Failed to parse measure element: ",
      e,
      cleanedMeasureData,
      measureElement.outerHTML,
    );
    // Return a default or throw, depending on desired error handling
    // For now, rethrow to make issues visible during development
    throw new Error(
      `Measure parsing failed for measure number ${measureNumber}: ${e}`,
    );
  }
}

// Mapper for <part> element
export const mapPartElement = (element: Element): Part => {
  const measureElements = Array.from(element.querySelectorAll("measure"));
  const partData = {
    id: getAttribute(element, "id") ?? "",
    measures: measureElements.map(mapMeasureElement),
  };
  return PartSchema.parse(partData);
};

// Mapper for <part> element inside a timewise <measure>
export const mapTimewisePartElement = (element: Element): TimewisePart => {
  const content: MeasureContent[] = [];
  element.childNodes.forEach((node) => {
    if (node.nodeType === 1) {
      const child = node as Element;
      let mapped: MeasureContent | undefined;
      switch (child.nodeName.toLowerCase()) {
        case "note":
          mapped = mapNoteElement(child);
          break;
        case "attributes":
          mapped = mapAttributesElement(child);
          break;
        case "direction":
          mapped = mapDirectionElement(child);
          break;
        case "barline":
          mapped = mapBarlineElement(child);
          break;
        case "harmony":
          mapped = mapHarmonyElement(child);
          break;
        case "figured-bass":
          mapped = mapFiguredBassElement(child);
          break;
        case "grouping":
          mapped = mapGroupingElement(child);
          break;
        case "bookmark":
          mapped = mapBookmarkElement(child);
          break;
        case "link":
          mapped = mapLinkElement(child);
          break;
        case "backup":
          mapped = mapBackupElement(child);
          break;
        case "forward":
          mapped = mapForwardElement(child);
          break;
        case "print":
          mapped = mapPrintElement(child);
          break;
        case "sound":
          mapped = mapSoundElement(child);
          break;
      }
      if (mapped) content.push(mapped);
    }
  });

  const data: Partial<TimewisePart> = {
    id: getAttribute(element, "id") ?? "",
  };
  if (content.length > 0) data.content = content;
  return TimewisePartSchema.parse(data);
};

export const mapTimewiseMeasureElement = (
  measureElement: Element,
): TimewiseMeasure => {
  const partElements = Array.from(measureElement.querySelectorAll("part"));
  const measureData: Partial<TimewiseMeasure> = {
    number: measureElement.getAttribute("number") || "",
    parts: partElements.map(mapTimewisePartElement),
  };
  const implicitAttr = measureElement.getAttribute("implicit");
  if (implicitAttr === "yes") measureData.implicit = true;
  const nonControllingAttr = measureElement.getAttribute("non-controlling");
  if (nonControllingAttr === "yes") measureData.nonControlling = true;
  const widthAttr = measureElement.getAttribute("width");
  if (widthAttr) measureData.width = parseOptionalFloat(widthAttr);
  return TimewiseMeasureSchema.parse(measureData);
};

// Map a <score-instrument> element
export const mapScoreInstrumentElement = (
  element: Element,
): ScoreInstrument => {
  const data: Partial<ScoreInstrument> = {
    id: getAttribute(element, "id") ?? "",
    instrumentName: getTextContent(element, "instrument-name") ?? "",
  };
  const abbr = getTextContent(element, "instrument-abbreviation");
  if (abbr) data.instrumentAbbreviation = abbr;
  const sound = getTextContent(element, "instrument-sound");
  if (sound) data.instrumentSound = sound;
  const standardId = mapToStandardInstrumentId(
    data.instrumentName,
    sound ?? undefined,
  );
  if (standardId) data.standardId = standardId;
  if (element.querySelector("solo")) data.solo = true;
  const ensemble = element.querySelector("ensemble");
  if (ensemble) {
    const size = parseInt(ensemble.textContent ?? "", 10);
    if (!isNaN(size)) data.ensemble = size;
  }
  const midiInstr = element.querySelector("midi-instrument");
  if (midiInstr) data.midiInstrument = mapMidiInstrumentElement(midiInstr);
  return ScoreInstrumentSchema.parse(data);
};

// Map a <midi-device> element
export const mapMidiDeviceElement = (element: Element): MidiDevice => {
  const data: Partial<MidiDevice> = {
    value: element.textContent?.trim() ?? "",
    port: parseOptionalNumberAttribute(element, "port"),
  };
  const id = getAttribute(element, "id");
  if (id) data.id = id;
  return MidiDeviceSchema.parse(data);
};

// Map a <midi-instrument> element
export const mapMidiInstrumentElement = (element: Element): MidiInstrument => {
  const data: Partial<MidiInstrument> = {
    id: getAttribute(element, "id") ?? "",
    midiChannel: parseNumberContent(element, "midi-channel"),
    midiName: getTextContent(element, "midi-name"),
    midiBank: parseNumberContent(element, "midi-bank"),
    midiProgram: parseNumberContent(element, "midi-program"),
    midiUnpitched: parseNumberContent(element, "midi-unpitched"),
    volume: parseFloatContent(element, "volume"),
    pan: parseFloatContent(element, "pan"),
    elevation: parseFloatContent(element, "elevation"),
  };
  return MidiInstrumentSchema.parse(data);
};

export const mapInstrumentChangeElement = (
  element: Element,
): InstrumentChange => {
  const data: Partial<InstrumentChange> = {
    _type: "instrument-change",
    id: getAttribute(element, "id") ?? "",
  };
  const sound = getTextContent(element, "instrument-sound");
  if (sound) data.instrumentSound = sound;
  if (element.querySelector("solo")) data.solo = true;
  const ensembleEl = element.querySelector("ensemble");
  if (ensembleEl) {
    const size = parseInt(ensembleEl.textContent ?? "", 10);
    if (!isNaN(size)) data.ensemble = size;
  }
  const virt = element.querySelector("virtual-instrument");
  if (virt) {
    const lib = getTextContent(virt, "virtual-library");
    if (lib) data.virtualLibrary = lib;
    const name = getTextContent(virt, "virtual-name");
    if (name) data.virtualName = name;
  }
  return InstrumentChangeSchema.parse(data);
};

export const mapDisplayTextElement = (element: Element): DisplayText => {
  const data: Partial<DisplayText> = {
    text: element.textContent?.trim() ?? undefined,
  };
  return DisplayTextSchema.parse(data);
};

export const mapAccidentalTextElement = (element: Element): AccidentalText => {
  const valueFromTextContent = element.textContent?.trim();
  const data: Partial<AccidentalText> = {
    value: (valueFromTextContent === "" ? undefined : valueFromTextContent) as
      | AccidentalValue
      | undefined,
    smufl: getAttribute(element, "smufl"),
  };
  return AccidentalTextSchema.parse(data);
};

export const mapPartNameDisplayElement = (
  element: Element,
): PartNameDisplay => {
  const items: (DisplayText | AccidentalText)[] = [];
  element.childNodes.forEach((n) => {
    if (n.nodeType === 1) {
      const child = n as Element;
      if (child.tagName === "display-text") {
        items.push(mapDisplayTextElement(child));
      } else if (child.tagName === "accidental-text") {
        items.push(mapAccidentalTextElement(child));
      }
    }
  });
  const data: Partial<PartNameDisplay> = {};
  if (items.length > 0) data.items = items;
  const po = getAttribute(element, "print-object");
  if (po === "yes" || po === "no") data.printObject = po;
  return PartNameDisplaySchema.parse(data);
};

export const mapPartAbbreviationDisplayElement = (
  element: Element,
): PartAbbreviationDisplay => {
  const items: (DisplayText | AccidentalText)[] = [];
  element.childNodes.forEach((n) => {
    if (n.nodeType === 1) {
      const child = n as Element;
      if (child.tagName === "display-text") {
        items.push(mapDisplayTextElement(child));
      } else if (child.tagName === "accidental-text") {
        items.push(mapAccidentalTextElement(child));
      }
    }
  });
  const data: Partial<PartAbbreviationDisplay> = {};
  if (items.length > 0) data.items = items;
  const po = getAttribute(element, "print-object");
  if (po === "yes" || po === "no") data.printObject = po;
  return PartAbbreviationDisplaySchema.parse(data);
};

// Mapper for <score-part> element (from <part-list>)
export const mapScorePartElement = (element: Element): ScorePart => {
  const scoreInstrumentElements = Array.from(
    element.querySelectorAll("score-instrument"),
  );
  const midiDeviceElements = Array.from(
    element.querySelectorAll("midi-device"),
  );
  const midiInstrumentElements = Array.from(
    element.querySelectorAll("midi-instrument"),
  );

  const partNameDisplayElement = element.querySelector("part-name-display");
  const partAbbrevDisplayElement = element.querySelector(
    "part-abbreviation-display",
  );

  const scorePartData: Partial<ScorePart> = {
    id: getAttribute(element, "id") ?? "",
    partName: getTextContent(element, "part-name") ?? undefined,
  };

  const partAbbrev = getTextContent(element, "part-abbreviation");
  if (partAbbrev) scorePartData.partAbbreviation = partAbbrev;
  if (partNameDisplayElement) {
    scorePartData.partNameDisplay = mapPartNameDisplayElement(
      partNameDisplayElement,
    );
  }
  if (partAbbrevDisplayElement) {
    scorePartData.partAbbreviationDisplay = mapPartAbbreviationDisplayElement(
      partAbbrevDisplayElement,
    );
  }
  if (scoreInstrumentElements.length > 0) {
    scorePartData.scoreInstruments = scoreInstrumentElements.map(
      mapScoreInstrumentElement,
    );
  }
  if (midiDeviceElements.length > 0) {
    scorePartData.midiDevices = midiDeviceElements.map(mapMidiDeviceElement);
  }
  if (midiInstrumentElements.length > 0) {
    scorePartData.midiInstruments = midiInstrumentElements.map(
      mapMidiInstrumentElement,
    );
  }

  return ScorePartSchema.parse(scorePartData);
};

// Mapper for <part-group> element within <part-list>
export const mapPartGroupElement = (element: Element): PartGroup => {
  const groupData: Partial<PartGroup> = {
    number: getAttribute(element, "number") ?? undefined,
    type: (getAttribute(element, "type") as "start" | "stop") ?? "start",
  };

  const name = getTextContent(element, "group-name");
  if (name) groupData.groupName = name;
  const abbr = getTextContent(element, "group-abbreviation");
  if (abbr) groupData.groupAbbreviation = abbr;
  const symbol = getTextContent(element, "group-symbol");
  if (symbol && GroupSymbolValueEnum.safeParse(symbol).success) {
    groupData.groupSymbol = symbol as GroupSymbolValue;
  }
  const barline = getTextContent(element, "group-barline");
  if (barline === "yes" || barline === "no") groupData.groupBarline = barline;

  return PartGroupSchema.parse(groupData);
};

// Mapper for <part-list> element
export const mapPartListElement = (element: Element): PartList => {
  const scorePartElements = Array.from(element.querySelectorAll("score-part"));
  const partGroupElements = Array.from(element.querySelectorAll("part-group"));
  // console.log('Mapping PartList, found scorePartElements:', scorePartElements.length);
  const partListData = {
    scoreParts: scorePartElements.map(mapScorePartElement),
    partGroups: partGroupElements.map(mapPartGroupElement),
  };
  // console.log('Parsed partListData:', JSON.stringify(partListData, null, 2));

  const result = PartListSchema.safeParse(partListData);
  if (!result.success) {
    console.error(
      "Error parsing PartList:",
      JSON.stringify(partListData, null, 2),
    );
    console.error("Validation Errors:", result.error.flatten());
    throw new Error("PartList parsing failed.");
  }
  return result.data;
};
// Main mapper for the document
export const mapDocumentToScorePartwise = (doc: XMLDocument): ScorePartwise => {
  const rootElement = doc.documentElement;
  if (rootElement.nodeName !== "score-partwise") {
    throw new Error(
      `Expected root element <score-partwise>, but got <${rootElement.nodeName}>`,
    );
  }

  const workElement = rootElement.querySelector("work");
  const movementTitleElement = rootElement.querySelector("movement-title");
  const movementNumberElement = rootElement.querySelector("movement-number");
  const identificationElement = rootElement.querySelector("identification");
  const defaultsElement = rootElement.querySelector("defaults");
  const creditElements = Array.from(rootElement.querySelectorAll("credit"));
  const partListElement = rootElement.querySelector("part-list");
  const partElements = Array.from(rootElement.querySelectorAll("part"));

  if (!partListElement) {
    throw new Error("<part-list> element not found in <score-partwise>");
  }

  const scorePartwiseData: Partial<ScorePartwise> = {
    version: getAttribute(rootElement, "version") || "1.0", // Default to 1.0 if not specified
    partList: mapPartListElement(partListElement),
    parts: partElements.map(mapPartElement),
  };

  if (workElement) {
    scorePartwiseData.work = mapWorkElement(workElement);
  }
  if (movementTitleElement) {
    scorePartwiseData.movementTitle = movementTitleElement.textContent?.trim();
  }
  if (movementNumberElement) {
    scorePartwiseData.movementNumber =
      movementNumberElement.textContent?.trim();
  }
  if (identificationElement) {
    scorePartwiseData.identification = mapIdentificationElement(
      identificationElement,
    );
  }
  if (defaultsElement) {
    const mappedDefaults = mapDefaultsElement(defaultsElement);
    if (mappedDefaults) scorePartwiseData.defaults = mappedDefaults;
  }
  if (creditElements.length > 0) {
    const mappedCredits = creditElements
      .map(mapCreditElement)
      .filter(Boolean) as Credit[];
    if (mappedCredits.length > 0) scorePartwiseData.credit = mappedCredits;
  }

  const result = ScorePartwiseSchema.safeParse(scorePartwiseData);
  if (!result.success) {
    console.error(
      "Error parsing ScorePartwise:",
      JSON.stringify(scorePartwiseData, null, 2),
    );
    console.error("Validation Errors:", result.error.flatten());
    throw new Error("ScorePartwise parsing failed.");
  }
  return result.data;
};

export const mapDocumentToScoreTimewise = (doc: XMLDocument): ScoreTimewise => {
  const rootElement = doc.documentElement;
  if (rootElement.nodeName !== "score-timewise") {
    throw new Error(
      `Expected root element <score-timewise>, but got <${rootElement.nodeName}>`,
    );
  }

  const workElement = rootElement.querySelector("work");
  const movementTitleElement = rootElement.querySelector("movement-title");
  const movementNumberElement = rootElement.querySelector("movement-number");
  const identificationElement = rootElement.querySelector("identification");
  const defaultsElement = rootElement.querySelector("defaults");
  const creditElements = Array.from(rootElement.querySelectorAll("credit"));
  const partListElement = rootElement.querySelector("part-list");
  const measureElements = Array.from(rootElement.querySelectorAll("measure"));

  if (!partListElement) {
    throw new Error("<part-list> element not found in <score-timewise>");
  }

  const scoreTimewiseData: Partial<ScoreTimewise> = {
    version: getAttribute(rootElement, "version") || "1.0",
    partList: mapPartListElement(partListElement),
    measures: measureElements.map(mapTimewiseMeasureElement),
  };

  if (workElement) {
    scoreTimewiseData.work = mapWorkElement(workElement);
  }
  if (movementTitleElement) {
    scoreTimewiseData.movementTitle = movementTitleElement.textContent?.trim();
  }
  if (movementNumberElement) {
    scoreTimewiseData.movementNumber =
      movementNumberElement.textContent?.trim();
  }
  if (identificationElement) {
    scoreTimewiseData.identification = mapIdentificationElement(
      identificationElement,
    );
  }
  if (defaultsElement) {
    const mappedDefaults = mapDefaultsElement(defaultsElement);
    if (mappedDefaults) scoreTimewiseData.defaults = mappedDefaults;
  }
  if (creditElements.length > 0) {
    const mappedCredits = creditElements
      .map(mapCreditElement)
      .filter(Boolean) as Credit[];
    if (mappedCredits.length > 0) scoreTimewiseData.credit = mappedCredits;
  }

  const result = ScoreTimewiseSchema.safeParse(scoreTimewiseData);
  if (!result.success) {
    console.error(
      "Error parsing ScoreTimewise:",
      JSON.stringify(scoreTimewiseData, null, 2),
    );
    console.error("Validation Errors:", result.error.flatten());
    throw new Error("ScoreTimewise parsing failed.");
  }
  return result.data;
};
export function mapRootElement(
  element: Element,
): z.infer<typeof RootSchema> | undefined {
  if (!element) return undefined;
  const stepContent = element.querySelector("root-step")?.textContent?.trim();
  const alterContent = element.querySelector("root-alter")?.textContent?.trim();
  const textContentVal = element.querySelector("text")?.textContent?.trim();

  const rootData: Partial<z.infer<typeof RootSchema>> = {};
  if (stepContent) {
    const stepParseResult = RootStepSchema.safeParse(stepContent);
    if (stepParseResult.success) rootData.step = stepParseResult.data;
  }
  if (alterContent) rootData.alter = parseOptionalInt(alterContent);
  if (textContentVal) rootData.text = textContentVal;

  const result = RootSchema.safeParse(rootData);
  if (result.success) return result.data;
  return undefined;
}

export function mapKindElement(
  element: Element,
): z.infer<typeof KindSchema> | undefined {
  if (!element) return undefined;
  const valueContent = element.querySelector("kind")?.textContent?.trim(); // Assuming 'kind' is the text content element for value
  // If kind value is directly in textContent of <kind> itself and not a child:
  // const valueContent = element.textContent?.trim();

  if (!valueContent) {
    // If there's no direct child/text content for value, or it's empty
    // Check for text attribute as a fallback if your schema/data uses it for kind value
    const textAttrValue = getAttribute(element, "text");
    if (textAttrValue) {
      // This part depends on how your KindSchema expects the 'value' and 'text'
      // If 'text' attribute can define the kind's 'value':
      const valueParseResult = KindValueEnum.safeParse(textAttrValue);
      if (valueParseResult.success) {
        const kindData: Partial<z.infer<typeof KindSchema>> = {
          value: valueParseResult.data,
          text: textAttrValue,
        };
        // Add other attributes like useSymbols, parenthesesDegrees, bracketDegrees
        const useSymbolsAttr = getAttribute(element, "use-symbols");
        if (useSymbolsAttr)
          kindData.useSymbols = useSymbolsAttr as "yes" | "no";
        // ... parse other attributes ...
        const finalResult = KindSchema.safeParse(kindData);
        if (finalResult.success) return finalResult.data;
      }
      return undefined; // Or handle as 'other' if applicable
    }
    return undefined; // No value found
  }

  const kindData: Partial<z.infer<typeof KindSchema>> = {};
  const valueParseResult = KindValueEnum.safeParse(valueContent);

  if (valueParseResult.success) {
    kindData.value = valueParseResult.data;
  } else {
    // If parsing the content fails, check if it's meant to be 'other' with text attribute
    const textAttr = getAttribute(element, "text");
    if (textAttr) {
      // If there's a text attribute, assume 'other'
      kindData.value = "other";
      kindData.text = textAttr; // Use the text attribute
    } else {
      // console.warn(`Kind value "${valueContent}" is not a valid KindValueEnum and no text attribute for 'other'.`);
      return undefined; // Or default to 'other' if that's desired: kindData.value = 'other'; kindData.text = valueContent;
    }
  }

  // If kindData.value was set (either parsed or defaulted to 'other')
  // then proceed to parse other attributes.
  if (kindData.value) {
    // If value was parsed successfully but there's also a text attribute, it might override or supplement.
    // Current KindSchema uses 'text' for 'other' or specific alterations.
    // If valueContent was successfully parsed, and there's a text attribute, and it's not 'other', decide precedence.
    // For now, if valueContent parsed, we use it. If it was 'other', textAttr is already assigned.
    const textAttr = getAttribute(element, "text");
    if (textAttr && kindData.value === "other" && !kindData.text) {
      // If 'other' and text not set from valueContent
      kindData.text = textAttr;
    } else if (textAttr && kindData.value !== "other") {
      // If kind is not 'other' but has a text attribute, MusicXML might use it for display.
      // Add it if your schema expects/allows it.
      kindData.text = textAttr; // Example: store it if present
    }

    const useSymbolsAttr = getAttribute(element, "use-symbols");
    const parenthesesDegreesAttr = getAttribute(element, "parentheses-degrees");
    const bracketDegreesAttr = getAttribute(element, "bracket-degrees");

    if (useSymbolsAttr) kindData.useSymbols = useSymbolsAttr as "yes" | "no";
    if (parenthesesDegreesAttr)
      kindData.parenthesesDegrees = parenthesesDegreesAttr as "yes" | "no";
    if (bracketDegreesAttr)
      kindData.bracketDegrees = bracketDegreesAttr as "yes" | "no";
  } else {
    return undefined; // If no kind value could be determined
  }

  const result = KindSchema.safeParse(kindData);
  if (result.success) return result.data;
  // console.warn("Failed to parse kind element:", result.error, kindData, element.outerHTML);
  return undefined;
}

export function mapBassElement(
  element: Element,
): z.infer<typeof BassSchema> | undefined {
  if (!element) return undefined;
  const stepContent = element.querySelector("bass-step")?.textContent?.trim();
  const alterContent = element.querySelector("bass-alter")?.textContent?.trim();
  const textContentVal = element.querySelector("text")?.textContent?.trim(); // For text attribute of bass itself if any

  const bassData: Partial<z.infer<typeof BassSchema>> = {};
  if (stepContent) {
    const stepParseResult = BassStepSchema.safeParse(stepContent);
    if (stepParseResult.success) bassData.step = stepParseResult.data;
  }
  if (alterContent) bassData.alter = parseOptionalInt(alterContent);

  // In MusicXML, <bass> itself doesn't have a text attribute for its value,
  // but if there's a <text> child element for display purposes (not standard for <bass>):
  if (textContentVal) bassData.text = textContentVal;

  const result = BassSchema.safeParse(bassData);
  if (result.success && (bassData.step || bassData.text)) return result.data; // Ensure there's at least a step or text
  return undefined;
}

export function mapDegreeElement(
  element: Element,
): z.infer<typeof DegreeSchema> | undefined {
  if (!element) return undefined;
  const valueContent = element
    .querySelector("degree-value")
    ?.textContent?.trim();
  const typeContent = element.querySelector("degree-type")?.textContent?.trim();
  // const alterContent = element.querySelector('degree-alter')?.textContent?.trim(); // Corrected selector
  const alterElement = element.querySelector("degree-alter");

  if (!valueContent || !typeContent) return undefined;

  const degreeData: Partial<z.infer<typeof DegreeSchema>> = {};
  const valueNum = parseOptionalInt(valueContent);
  if (valueNum === undefined) return undefined;
  degreeData.value = valueNum;

  const typeParseResult = DegreeTypeEnum.safeParse(typeContent);
  if (typeParseResult.success) degreeData.type = typeParseResult.data;
  else return undefined;

  // const alterNum = alterContent ? parseOptionalInt(alterContent) : undefined;
  // if (alterNum !== undefined) degreeData.alter = alterNum;
  if (alterElement) {
    const alterText = alterElement.textContent?.trim();
    if (alterText) {
      const alterNum = parseOptionalInt(alterText);
      if (alterNum !== undefined) {
        // Check if alter is compatible with degree type (e.g., 'add' usually doesn't have alter)
        // This logic depends on how strict you want to be based on MusicXML rules.
        // For now, we parse it if present.
        degreeData.alter = alterNum;
      }
    }
  }

  const textAttr = getAttribute(element, "text");
  const printObjectAttr = getAttribute(element, "print-object");

  if (textAttr) degreeData.text = textAttr;
  if (printObjectAttr) degreeData.printObject = printObjectAttr as "yes" | "no";

  const result = DegreeSchema.safeParse(degreeData);
  if (result.success) return result.data;
  // console.warn("Failed to parse degree element:", result.error, degreeData, element.outerHTML);
  return undefined;
}

export function mapFrameElement(
  element: Element,
): z.infer<typeof FrameSchema> | undefined {
  if (!element) return undefined;

  const stringsText = element
    .querySelector("frame-strings")
    ?.textContent?.trim();
  const fretsText = element.querySelector("frame-frets")?.textContent?.trim();

  const frameData: Partial<z.infer<typeof FrameSchema>> = {};

  if (stringsText) frameData.frameStrings = parseOptionalInt(stringsText);
  if (fretsText) frameData.frameFrets = parseOptionalInt(fretsText);

  const firstFretEl = element.querySelector("first-fret");
  if (firstFretEl) {
    const value = parseOptionalInt(firstFretEl.textContent?.trim());
    const firstFretData: Partial<z.infer<typeof FirstFretSchema>> = {};
    if (value !== undefined) firstFretData.value = value;
    const textAttr = getAttribute(firstFretEl, "text");
    if (textAttr) firstFretData.text = textAttr;
    const locAttr = getAttribute(firstFretEl, "location");
    if (locAttr === "left" || locAttr === "right")
      firstFretData.location = locAttr as "left" | "right";
    const parsedFirst = FirstFretSchema.safeParse(firstFretData);
    if (parsedFirst.success) frameData.firstFret = parsedFirst.data;
  }

  const noteElements = Array.from(element.querySelectorAll("frame-note"));
  if (noteElements.length > 0) {
    const notes = noteElements
      .map((n) => {
        const stringText = n.querySelector("string")?.textContent?.trim();
        const fretText = n.querySelector("fret")?.textContent?.trim();
        if (!stringText || !fretText) return undefined;
        const noteData: Partial<z.infer<typeof FrameNoteSchema>> = {
          string: parseOptionalInt(stringText),
          fret: parseOptionalInt(fretText),
        };
        const fingeringText = n.querySelector("fingering")?.textContent?.trim();
        if (fingeringText) noteData.fingering = fingeringText;
        const barreEl = n.querySelector("barre");
        if (barreEl) {
          const typeAttr = getAttribute(barreEl, "type");
          if (typeAttr === "start" || typeAttr === "stop")
            noteData.barre = typeAttr as "start" | "stop";
        }
        const parsed = FrameNoteSchema.safeParse(noteData);
        return parsed.success ? parsed.data : undefined;
      })
      .filter(Boolean) as z.infer<typeof FrameNoteSchema>[];
    if (notes.length > 0) frameData.frameNotes = notes;
  }

  const heightAttr = getAttribute(element, "height");
  const widthAttr = getAttribute(element, "width");
  const unplayedAttr = getAttribute(element, "unplayed");
  if (heightAttr) frameData.height = parseOptionalFloat(heightAttr);
  if (widthAttr) frameData.width = parseOptionalFloat(widthAttr);
  if (unplayedAttr) frameData.unplayed = unplayedAttr;

  const validation = FrameSchema.safeParse(frameData);
  return validation.success ? validation.data : undefined;
}

export function mapHarmonyElement(
  harmonyElement: Element,
): Harmony | undefined {
  if (!harmonyElement) return undefined;

  const rootNode = harmonyElement.querySelector("root");
  const kindNode = harmonyElement.querySelector("kind");
  const bassNode = harmonyElement.querySelector("bass");
  const degreeNodes = Array.from(harmonyElement.querySelectorAll("degree"));

  const inversionText = harmonyElement
    .querySelector("inversion")
    ?.textContent?.trim();
  const staffText = harmonyElement.querySelector("staff")?.textContent?.trim();
  const printObjectAttr = getAttribute(harmonyElement, "print-object");
  const printFrameAttr = getAttribute(harmonyElement, "print-frame");
  const placementAttr = getAttribute(harmonyElement, "placement");
  const typeAttr = getAttribute(harmonyElement, "type"); // For harmony type

  const harmony: Partial<Harmony> = {
    _type: "harmony",
  };

  if (
    typeAttr &&
    (typeAttr === "explicit" ||
      typeAttr === "implied" ||
      typeAttr === "alternate")
  ) {
    harmony.type = typeAttr as "explicit" | "implied" | "alternate";
  }

  const mappedRoot = rootNode ? mapRootElement(rootNode) : undefined;
  if (mappedRoot) harmony.root = mappedRoot;

  const mappedKind = kindNode ? mapKindElement(kindNode) : undefined;
  if (mappedKind) harmony.kind = mappedKind;

  if (inversionText) harmony.inversion = parseOptionalInt(inversionText);

  const mappedBass = bassNode ? mapBassElement(bassNode) : undefined;
  if (mappedBass) harmony.bass = mappedBass;

  const mappedDegrees = degreeNodes
    .map(mapDegreeElement)
    .filter(Boolean) as z.infer<typeof DegreeSchema>[];
  if (mappedDegrees && mappedDegrees.length > 0)
    harmony.degrees = mappedDegrees;

  const frameNode = harmonyElement.querySelector("frame");
  if (frameNode) {
    const mappedFrame = mapFrameElement(frameNode);
    if (mappedFrame) harmony.frame = mappedFrame;
  }

  if (staffText) harmony.staff = parseOptionalInt(staffText);
  if (printObjectAttr) harmony.printObject = printObjectAttr as "yes" | "no";
  if (printFrameAttr) harmony.printFrame = printFrameAttr as "yes" | "no";
  if (
    placementAttr &&
    (placementAttr === "above" || placementAttr === "below")
  ) {
    harmony.placement = placementAttr as "above" | "below";
  }

  // Only attempt to parse if there's at least one core harmony component
  // (root, kind, bass, or degrees). Type attribute alone might not be enough.
  if (
    !harmony.root &&
    !harmony.kind &&
    !harmony.bass &&
    (!harmony.degrees || harmony.degrees.length === 0) &&
    !harmony.type
  ) {
    // If only _type and no other meaningful data, consider it not a valid harmony object to map.
    // This check might need adjustment based on how minimal a <harmony> can be.
    // For example, if <harmony type="implied"/> is valid with nothing else.
    if (Object.keys(harmony).length <= 1) return undefined; // Only _type
  }

  const validation = HarmonySchema.safeParse(harmony);
  if (validation.success) {
    return validation.data;
  } else {
    // console.error("Failed to parse harmony element:", validation.error.flatten().fieldErrors, JSON.stringify(harmony,null,2), harmonyElement.outerHTML);
    return undefined;
  }
}

export function mapPartSymbolElement(element: Element): PartSymbol | undefined {
  if (!element) return undefined;
  const value = element.textContent?.trim();
  if (!value) return undefined;

  const groupSymbolAttr = getAttribute(element, "group-symbol");
  const topStaffAttr = getAttribute(element, "top-staff");
  const bottomStaffAttr = getAttribute(element, "bottom-staff");
  const defaultXAttr = getAttribute(element, "default-x");
  const defaultYAttr = getAttribute(element, "default-y");
  const colorAttr = getAttribute(element, "color");

  const partSymbolData: Partial<PartSymbol> = {
    value: value,
    topStaff: parseOptionalInt(topStaffAttr),
    bottomStaff: parseOptionalInt(bottomStaffAttr),
    defaultX: parseOptionalFloat(defaultXAttr),
    defaultY: parseOptionalFloat(defaultYAttr),
    color: colorAttr || undefined,
  };

  if (groupSymbolAttr) {
    const groupSymbolParseResult =
      GroupSymbolValueEnum.safeParse(groupSymbolAttr);
    if (groupSymbolParseResult.success) {
      partSymbolData.groupSymbol = groupSymbolParseResult.data;
    }
  }

  const cleanedData = Object.fromEntries(
    Object.entries(partSymbolData).filter(([_, v]) => v !== undefined),
  );

  if (!cleanedData.value) return undefined;

  const validation = PartSymbolSchema.safeParse(cleanedData);
  if (validation.success) {
    return validation.data;
  } else {
    // console.error("Failed to parse part-symbol element:", validation.error, cleanedData, element.outerHTML);
    return undefined;
  }
}

// Function to map a <transpose> element
export const mapTransposeElement = (
  element: Element,
): Transpose | undefined => {
  const chromaticText = getTextContent(element, "chromatic");
  if (chromaticText === undefined) {
    // Chromatic is required, if not present, this is not a valid transpose element according to schema
    // However, to be robust, we might return undefined or let Zod validation handle it if schema demands it.
    // For now, if chromatic is missing, we treat it as an invalid/incomplete element for mapping.
    return undefined;
  }

  const diatonic = parseNumberContent(element, "diatonic");
  const chromatic = parseFloat(chromaticText); // Use parseFloat for chromatic as per schema suggestion
  const octaveChange = parseNumberContent(element, "octave-change");
  const doubleElement = element.querySelector("double");
  const numberAttr = getAttribute(element, "number");

  const transposeData: Partial<Transpose> = {};

  if (diatonic !== undefined) {
    transposeData.diatonic = diatonic;
  }
  transposeData.chromatic = chromatic;
  if (octaveChange !== undefined) {
    transposeData.octaveChange = octaveChange;
  }
  if (doubleElement) {
    transposeData.double = {
      above: getAttribute(doubleElement, "above") as "yes" | "no" | undefined,
    };
  }
  if (numberAttr !== undefined) {
    transposeData.number = parseInt(numberAttr, 10);
  }

  try {
    return TransposeSchema.parse(transposeData);
  } catch (e) {
    console.error(
      "Failed to parse transpose element:",
      JSON.stringify(transposeData, null, 2),
    );
    console.error("Validation errors:", (e as z.ZodError).errors);
    // Depending on strictness, you might throw e or return undefined
    return undefined;
  }
};

// Helper to map a <line-detail> element
const mapLineDetailElement = (element: Element): LineDetail | undefined => {
  const lineAttr = getAttribute(element, "line");
  if (!lineAttr) return undefined;
  const line = parseInt(lineAttr, 10);
  if (isNaN(line)) return undefined;

  const data: Partial<LineDetail> = {
    line,
  };

  const widthAttr = getAttribute(element, "width");
  if (widthAttr !== undefined) {
    const w = parseFloat(widthAttr);
    if (!isNaN(w)) data.width = w;
  }

  const colorAttr = getAttribute(element, "color");
  if (colorAttr) data.color = colorAttr;

  const lineTypeAttr = getAttribute(element, "line-type");
  if (lineTypeAttr) data.lineType = lineTypeAttr;

  const printObjAttr = getAttribute(element, "print-object");
  if (printObjAttr === "yes" || printObjAttr === "no")
    data.printObject = printObjAttr;

  const cleaned = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined),
  );

  try {
    return LineDetailSchema.parse(cleaned);
  } catch {
    return undefined;
  }
};

const TuningStepEnum = ["A", "B", "C", "D", "E", "F", "G"] as const;
type TuningStep = (typeof TuningStepEnum)[number];

// Helper to map a <staff-tuning> element
const mapStaffTuningElement = (element: Element): StaffTuning | undefined => {
  const lineAttr = getAttribute(element, "line");
  const stepText = getTextContent(element, "tuning-step");
  const octave = parseNumberContent(element, "tuning-octave");
  if (!lineAttr || !stepText || octave === undefined) return undefined;

  const line = parseInt(lineAttr, 10);
  if (isNaN(line)) return undefined;

  if (!TuningStepEnum.includes(stepText as TuningStep)) {
    console.warn(`Invalid tuning step: ${stepText}`);
    return undefined;
  }
  const step = stepText as TuningStep;

  const data: Partial<StaffTuning> = {
    line,
    tuningStep: step,
    tuningOctave: octave,
  };

  const alter = parseFloatContent(element, "tuning-alter");
  if (alter !== undefined) data.tuningAlter = alter;

  try {
    return StaffTuningSchema.parse(data);
  } catch {
    return undefined;
  }
};

// Function to map a <staff-details> element
export const mapStaffDetailsElement = (
  element: Element,
): StaffDetails | undefined => {
  if (!element) return undefined;

  const staffDetailsData: Partial<StaffDetails> = {
    staffType: getTextContent(element, "staff-type"),
    staffLines: parseNumberContent(element, "staff-lines"),
    capo: parseNumberContent(element, "capo"),
    number: parseOptionalNumberAttribute(element, "number"),
    showFrets: getAttribute(element, "show-frets") as
      | "numbers"
      | "letters"
      | undefined,
    printObject: getAttribute(element, "print-object") as
      | "yes"
      | "no"
      | undefined,
    printSpacing: getAttribute(element, "print-spacing") as
      | "yes"
      | "no"
      | undefined,
  };

  const lineDetailEls = Array.from(element.querySelectorAll("line-detail"));
  if (lineDetailEls.length > 0) {
    staffDetailsData.lineDetail = lineDetailEls
      .map(mapLineDetailElement)
      .filter(Boolean) as LineDetail[];
  }

  const tuningEls = Array.from(element.querySelectorAll("staff-tuning"));
  if (tuningEls.length > 0) {
    staffDetailsData.staffTuning = tuningEls
      .map(mapStaffTuningElement)
      .filter(Boolean) as StaffTuning[];
  }

  const staffSizeElement = element.querySelector("staff-size");
  if (staffSizeElement) {
    const valueText = staffSizeElement.textContent?.trim();
    const scalingAttr = getAttribute(staffSizeElement, "scaling");
    if (valueText) {
      const valueNum = parseFloat(valueText);
      if (!isNaN(valueNum)) {
        staffDetailsData.staffSize = {
          value: valueNum,
          scaling: scalingAttr ? parseFloat(scalingAttr) : undefined,
        };
      }
    }
  }

  const cleanedData = Object.fromEntries(
    Object.entries(staffDetailsData).filter(([, v]) => v !== undefined),
  );

  if (Object.keys(cleanedData).length === 0) {
    return undefined;
  }

  try {
    return StaffDetailsSchema.parse(cleanedData);
  } catch (e) {
    console.error(
      "Failed to parse staff-details element:",
      JSON.stringify(cleanedData, null, 2),
    );
    console.error("Validation errors:", (e as z.ZodError).errors);
    return undefined;
  }
};

const mapMultipleRestElement = (element: Element): MultipleRest | undefined => {
  const valueText = element.textContent?.trim();
  if (!valueText) return undefined;
  const value = parseInt(valueText, 10);
  if (isNaN(value)) return undefined;

  const data = {
    value: value,
    useSymbols: getAttribute(element, "use-symbols") as
      | "yes"
      | "no"
      | undefined,
  };
  try {
    return MultipleRestSchema.parse(data);
  } catch (e) {
    console.error(
      "Failed to parse multiple-rest element:",
      JSON.stringify(data, null, 2),
      (e as z.ZodError).errors,
    );
    return undefined;
  }
};

const mapMeasureRepeatElement = (
  element: Element,
): MeasureRepeat | undefined => {
  const valueText = element.textContent?.trim();
  const type = getAttribute(element, "type") as "start" | "stop" | undefined;
  if (!valueText || !type) return undefined;

  const value = parseInt(valueText, 10);
  if (isNaN(value)) return undefined;

  const slashes = parseOptionalNumberAttribute(element, "slashes");

  const data = {
    value,
    type,
    slashes,
  };
  try {
    return MeasureRepeatSchema.parse(data);
  } catch (e) {
    console.error(
      "Failed to parse measure-repeat element:",
      JSON.stringify(data, null, 2),
      (e as z.ZodError).errors,
    );
    return undefined;
  }
};

const mapBeatRepeatElement = (element: Element): BeatRepeat | undefined => {
  const type = getAttribute(element, "type") as "start" | "stop" | undefined;
  if (!type) return undefined;

  const data = {
    type,
    slashes: parseOptionalNumberAttribute(element, "slashes"),
    useDots: getAttribute(element, "use-dots") as "yes" | "no" | undefined,
    slashType: getTextContent(element, "slash-type"),
    slashDot:
      element.querySelectorAll("slash-dot").length > 0
        ? Array.from(element.querySelectorAll("slash-dot")).map(() => ({}))
        : undefined,
    exceptVoice:
      element.querySelectorAll("except-voice").length > 0
        ? Array.from(element.querySelectorAll("except-voice"))
            .map((el) => el.textContent?.trim())
            .filter((v): v is string => !!v)
        : undefined,
  };
  try {
    return BeatRepeatSchema.parse(data);
  } catch (e) {
    console.error(
      "Failed to parse beat-repeat element:",
      JSON.stringify(data, null, 2),
      (e as z.ZodError).errors,
    );
    return undefined;
  }
};

const mapSlashElement = (element: Element): Slash | undefined => {
  const type = getAttribute(element, "type") as "start" | "stop" | undefined;
  if (!type) return undefined;

  const data = {
    type,
    useDots: getAttribute(element, "use-dots") as "yes" | "no" | undefined,
    useStems: getAttribute(element, "use-stems") as "yes" | "no" | undefined,
    slashType: getTextContent(element, "slash-type"),
    slashDot:
      element.querySelectorAll("slash-dot").length > 0
        ? Array.from(element.querySelectorAll("slash-dot")).map(() => ({}))
        : undefined,
    exceptVoice:
      element.querySelectorAll("except-voice").length > 0
        ? Array.from(element.querySelectorAll("except-voice"))
            .map((el) => el.textContent?.trim())
            .filter((v): v is string => !!v)
        : undefined,
  };
  try {
    return SlashSchema.parse(data);
  } catch (e) {
    console.error(
      "Failed to parse slash element:",
      JSON.stringify(data, null, 2),
      (e as z.ZodError).errors,
    );
    return undefined;
  }
};
