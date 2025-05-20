import { z } from "zod";
import type {
  Font,
  Scaling,
  LyricFont,
  LyricLanguage,
  Defaults,
  PageLayout,
  SystemLayout,
  SystemDividers,
  StaffLayout,
  Margins,
  LineWidth,
  Appearance,
  NoteSize,
  Distance,
  Glyph,
  OtherAppearance,
} from "../../types";
import {
  FontSchema,
  ScalingSchema,
  LyricFontSchema,
  LyricLanguageSchema,
  DefaultsSchema,
  PageLayoutSchema,
  MarginsSchema,
  LineWidthSchema,
  AppearanceSchema,
  NoteSizeSchema,
  DistanceSchema,
  GlyphSchema,
  OtherAppearanceSchema,
  SystemLayoutSchema,
  SystemDividersSchema,
  StaffLayoutSchema,
} from "../../schemas";

import {
  parseNumberContent,
  parseFloatContent,
  getAttribute,
  parseOptionalNumberAttribute,
} from "./utils";
// Helper to parse <margins> element (common for page and system layout)
const mapMarginsElement = (element: Element): Margins | undefined => {
  if (!element) return undefined;
  const marginsData: Partial<Margins> = {
    leftMargin: parseFloatContent(element, "left-margin"),
    rightMargin: parseFloatContent(element, "right-margin"),
    topMargin: parseFloatContent(element, "top-margin"),
    bottomMargin: parseFloatContent(element, "bottom-margin"),
    type: getAttribute(element, "type") as Margins["type"],
  };
  // Remove undefined to allow Zod to correctly validate optional fields
  Object.keys(marginsData).forEach(
    (key) =>
      marginsData[key as keyof Margins] === undefined &&
      delete marginsData[key as keyof Margins],
  );
  if (Object.keys(marginsData).length === 0) return undefined;
  try {
    return MarginsSchema.parse(marginsData);
  } catch {
    // console.warn("Failed to parse margins element:", JSON.stringify(marginsData, null, 2), (e as z.ZodError).errors);
    return undefined;
  }
};

// Helper to parse <page-layout> element
export const mapPageLayoutElement = (
  element: Element,
): PageLayout | undefined => {
  if (!element) return undefined;
  const pageLayoutData: Partial<PageLayout> = {
    pageHeight: parseFloatContent(element, "page-height"),
    pageWidth: parseFloatContent(element, "page-width"),
  };
  const pageMarginsElements = Array.from(
    element.querySelectorAll("page-margins"),
  );
  if (pageMarginsElements.length > 0) {
    const mappedMargins = pageMarginsElements
      .map(mapMarginsElement)
      .filter(Boolean) as Margins[];
    if (mappedMargins.length > 0) pageLayoutData.pageMargins = mappedMargins;
  }
  Object.keys(pageLayoutData).forEach(
    (key) =>
      pageLayoutData[key as keyof PageLayout] === undefined &&
      delete pageLayoutData[key as keyof PageLayout],
  );
  if (Object.keys(pageLayoutData).length === 0) return undefined;
  try {
    return PageLayoutSchema.parse(pageLayoutData);
  } catch {
    // console.warn("Failed to parse page-layout element:", JSON.stringify(pageLayoutData, null, 2), (e as z.ZodError).errors);
    return undefined;
  }
};

// Helper to parse <system-layout> element
const mapSystemDividersElement = (
  element: Element,
): SystemDividers | undefined => {
  if (!element) return undefined;
  const dividersData: Partial<SystemDividers> = {};
  if (element.querySelector("left-divider")) dividersData.leftDivider = true;
  if (element.querySelector("right-divider")) dividersData.rightDivider = true;
  if (Object.keys(dividersData).length === 0) return undefined;
  try {
    return SystemDividersSchema.parse(dividersData);
  } catch {
    return undefined;
  }
};

export const mapSystemLayoutElement = (
  element: Element,
): SystemLayout | undefined => {
  if (!element) return undefined;
  const systemLayoutData: Partial<SystemLayout> = {
    systemDistance: parseFloatContent(element, "system-distance"),
    topSystemDistance: parseFloatContent(element, "top-system-distance"),
  };
  const systemMarginsElement = element.querySelector("system-margins");
  if (systemMarginsElement) {
    const mappedMargins = mapMarginsElement(systemMarginsElement);
    if (mappedMargins) systemLayoutData.systemMargins = mappedMargins;
  }
  const dividersElement = element.querySelector("system-dividers");
  if (dividersElement) {
    const mappedDividers = mapSystemDividersElement(dividersElement);
    if (mappedDividers) systemLayoutData.systemDividers = mappedDividers;
  }
  Object.keys(systemLayoutData).forEach(
    (key) =>
      systemLayoutData[key as keyof SystemLayout] === undefined &&
      delete systemLayoutData[key as keyof SystemLayout],
  );
  if (Object.keys(systemLayoutData).length === 0) return undefined;
  try {
    return SystemLayoutSchema.parse(systemLayoutData);
  } catch {
    // console.warn("Failed to parse system-layout element:", JSON.stringify(systemLayoutData, null, 2), (e as z.ZodError).errors);
    return undefined;
  }
};

// Helper to parse <staff-layout> element
export const mapStaffLayoutElement = (
  element: Element,
): StaffLayout | undefined => {
  if (!element) return undefined;
  const staffLayoutData: Partial<StaffLayout> = {
    number: parseOptionalNumberAttribute(element, "number"),
    staffDistance: parseFloatContent(element, "staff-distance"),
  };
  Object.keys(staffLayoutData).forEach(
    (key) =>
      staffLayoutData[key as keyof StaffLayout] === undefined &&
      delete staffLayoutData[key as keyof StaffLayout],
  );
  if (Object.keys(staffLayoutData).length === 0) return undefined;
  try {
    return StaffLayoutSchema.parse(staffLayoutData);
  } catch {
    // console.warn('Failed to parse staff-layout element:', JSON.stringify(staffLayoutData, null, 2), (e as z.ZodError).errors);
    return undefined;
  }
};

// Helper to parse <line-width> element
const mapLineWidthElement = (element: Element): LineWidth | undefined => {
  if (!element) return undefined;
  const lineWidthData: Partial<LineWidth> = {
    type: getAttribute(element, "type"),
    value: element.textContent
      ? parseFloat(element.textContent.trim())
      : undefined,
  };
  Object.keys(lineWidthData).forEach(
    (key) =>
      lineWidthData[key as keyof LineWidth] === undefined &&
      delete lineWidthData[key as keyof LineWidth],
  );
  if (
    Object.keys(lineWidthData).length === 0 ||
    lineWidthData.type === undefined
  )
    return undefined; // type is often crucial
  try {
    return LineWidthSchema.parse(lineWidthData);
  } catch {
    // console.warn("Failed to parse line-width element:", JSON.stringify(lineWidthData, null, 2), (e as z.ZodError).errors);
    return undefined;
  }
};

const mapNoteSizeElement = (element: Element): NoteSize | undefined => {
  if (!element) return undefined;
  const type = getAttribute(element, "type");
  const value = element.textContent
    ? parseFloat(element.textContent.trim())
    : undefined;
  if (!type || value === undefined) return undefined;
  try {
    return NoteSizeSchema.parse({ type, value });
  } catch {
    return undefined;
  }
};

const mapDistanceElement = (element: Element): Distance | undefined => {
  if (!element) return undefined;
  const type = getAttribute(element, "type");
  const value = element.textContent
    ? parseFloat(element.textContent.trim())
    : undefined;
  if (!type || value === undefined) return undefined;
  try {
    return DistanceSchema.parse({ type, value });
  } catch {
    return undefined;
  }
};

const mapGlyphElement = (element: Element): Glyph | undefined => {
  if (!element) return undefined;
  const type = getAttribute(element, "type");
  const value = element.textContent?.trim();
  if (!type || !value) return undefined;
  try {
    return GlyphSchema.parse({ type, value });
  } catch {
    return undefined;
  }
};

const mapOtherAppearanceElement = (
  element: Element,
): OtherAppearance | undefined => {
  if (!element) return undefined;
  const type = getAttribute(element, "type");
  const value = element.textContent?.trim();
  if (!type || !value) return undefined;
  try {
    return OtherAppearanceSchema.parse({ type, value });
  } catch {
    return undefined;
  }
};

// Helper to parse <appearance> element
const mapAppearanceElement = (element: Element): Appearance | undefined => {
  if (!element) return undefined;
  const appearanceData: Partial<Appearance> = {};
  const lineWidthElements = Array.from(element.querySelectorAll("line-width"));
  if (lineWidthElements.length > 0) {
    const mappedLineWidths = lineWidthElements
      .map(mapLineWidthElement)
      .filter(Boolean) as LineWidth[];
    if (mappedLineWidths.length > 0)
      appearanceData.lineWidths = mappedLineWidths;
  }
  const noteSizeElements = Array.from(element.querySelectorAll("note-size"));
  if (noteSizeElements.length > 0) {
    const mapped = noteSizeElements
      .map(mapNoteSizeElement)
      .filter(Boolean) as NoteSize[];
    if (mapped.length > 0) appearanceData.noteSizes = mapped;
  }
  const distanceElements = Array.from(element.querySelectorAll("distance"));
  if (distanceElements.length > 0) {
    const mapped = distanceElements
      .map(mapDistanceElement)
      .filter(Boolean) as Distance[];
    if (mapped.length > 0) appearanceData.distances = mapped;
  }
  const glyphElements = Array.from(element.querySelectorAll("glyph"));
  if (glyphElements.length > 0) {
    const mapped = glyphElements
      .map(mapGlyphElement)
      .filter(Boolean) as Glyph[];
    if (mapped.length > 0) appearanceData.glyphs = mapped;
  }
  const otherElements = Array.from(
    element.querySelectorAll("other-appearance"),
  );
  if (otherElements.length > 0) {
    const mapped = otherElements
      .map(mapOtherAppearanceElement)
      .filter(Boolean) as OtherAppearance[];
    if (mapped.length > 0) appearanceData.otherAppearances = mapped;
  }
  if (Object.keys(appearanceData).length === 0) return undefined;
  try {
    return AppearanceSchema.parse(appearanceData);
  } catch {
    // console.warn("Failed to parse appearance element:", JSON.stringify(appearanceData, null, 2), (e as z.ZodError).errors);
    return undefined;
  }
};

// Helper to parse font attributes, assuming FontSchema structure
export const mapFontAttributes = (element: Element): Font => {
  const fontFamily = getAttribute(element, "font-family");
  const fontStyleAttr = getAttribute(element, "font-style");
  const fontSize = getAttribute(element, "font-size");
  const fontWeightAttr = getAttribute(element, "font-weight");

  const fontData: Partial<Font> = {};

  if (fontFamily) fontData.fontFamily = fontFamily;
  if (fontSize) fontData.fontSize = fontSize;

  if (fontStyleAttr === "normal" || fontStyleAttr === "italic") {
    fontData.fontStyle = fontStyleAttr;
  }

  if (fontWeightAttr === "normal" || fontWeightAttr === "bold") {
    fontData.fontWeight = fontWeightAttr;
  }
  return FontSchema.parse(fontData);
};

export const mapScalingElement = (element: Element): Scaling | undefined => {
  if (!element) return undefined;
  const millimeters = parseFloatContent(element, "millimeters");
  const tenths = parseNumberContent(element, "tenths");
  if (millimeters === undefined || tenths === undefined) return undefined;
  const scalingData: Scaling = {
    millimeters,
    tenths,
  };
  if (Object.values(scalingData).every((v) => v === undefined))
    return undefined;
  return ScalingSchema.parse(scalingData);
};

export const mapLyricFontElement = (
  element: Element,
): LyricFont | undefined => {
  if (!element) return undefined;
  const fontAttrs = mapFontAttributes(element);
  const lyricFontData: Partial<LyricFont> = {
    ...fontAttrs,
    number: getAttribute(element, "number"),
    name: getAttribute(element, "name"),
  };
  Object.keys(lyricFontData).forEach(
    (key) =>
      lyricFontData[key as keyof LyricFont] === undefined &&
      delete lyricFontData[key as keyof LyricFont],
  );
  if (Object.keys(lyricFontData).length === 0) return undefined;
  return LyricFontSchema.parse(lyricFontData);
};

export const mapDefaultsElement = (element: Element): Defaults | undefined => {
  if (!element) return undefined;

  const scalingElement = element.querySelector("scaling");
  const concertScoreElement = element.querySelector("concert-score");
  const pageLayoutElement = element.querySelector("page-layout"); // Added
  const systemLayoutElement = element.querySelector("system-layout"); // Added
  const appearanceElement = element.querySelector("appearance"); // Added
  const musicFontElement = element.querySelector("music-font");
  const wordFontElement = element.querySelector("word-font");
  const lyricFontElements = Array.from(element.querySelectorAll("lyric-font"));
  const lyricLanguageElements = Array.from(
    element.querySelectorAll("lyric-language"),
  );
  const staffLayoutElements = Array.from(
    element.querySelectorAll("staff-layout"),
  );

  const defaultsData: Partial<Defaults> = {};

  if (scalingElement) {
    const mappedScaling = mapScalingElement(scalingElement);
    if (mappedScaling) defaultsData.scaling = mappedScaling;
  }
  if (concertScoreElement) {
    defaultsData.concertScore = {};
  }
  if (pageLayoutElement) {
    // Added
    const mappedPageLayout = mapPageLayoutElement(pageLayoutElement);
    if (mappedPageLayout) defaultsData.pageLayout = mappedPageLayout;
  }
  if (systemLayoutElement) {
    // Added
    const mappedSystemLayout = mapSystemLayoutElement(systemLayoutElement);
    if (mappedSystemLayout) defaultsData.systemLayout = mappedSystemLayout;
  }
  if (staffLayoutElements.length > 0) {
    const mappedStaffLayouts = staffLayoutElements
      .map(mapStaffLayoutElement)
      .filter(Boolean) as StaffLayout[];
    if (mappedStaffLayouts.length > 0)
      defaultsData.staffLayout = mappedStaffLayouts;
  }
  if (appearanceElement) {
    // Added
    const mappedAppearance = mapAppearanceElement(appearanceElement);
    if (mappedAppearance) defaultsData.appearance = mappedAppearance;
  }
  if (musicFontElement) {
    try {
      defaultsData.musicFont = mapFontAttributes(musicFontElement);
    } catch (e) {
      console.warn("Failed to parse music-font attributes", e);
    }
  }
  if (wordFontElement) {
    try {
      defaultsData.wordFont = mapFontAttributes(wordFontElement);
    } catch (e) {
      console.warn("Failed to parse word-font attributes", e);
    }
  }
  if (lyricFontElements.length > 0) {
    const mappedFonts = lyricFontElements
      .map(mapLyricFontElement)
      .filter(Boolean) as LyricFont[];
    if (mappedFonts.length > 0) defaultsData.lyricFonts = mappedFonts;
  }
  if (lyricLanguageElements.length > 0) {
    const mappedLanguages = lyricLanguageElements
      .map(mapLyricLanguageElement)
      .filter(Boolean) as LyricLanguage[];
    if (mappedLanguages.length > 0)
      defaultsData.lyricLanguages = mappedLanguages;
  }

  if (Object.keys(defaultsData).length === 0) {
    return undefined;
  }
  try {
    return DefaultsSchema.parse(defaultsData);
  } catch (e) {
    console.error(
      "Failed to parse defaults element:",
      JSON.stringify(defaultsData, null, 2),
    );
    console.error("Validation errors:", (e as z.ZodError).errors);
    return undefined;
  }
};
export const mapLyricLanguageElement = (
  element: Element,
): LyricLanguage | undefined => {
  if (!element) return undefined;
  const xmlLang = getAttribute(element, "xml:lang");
  if (!xmlLang) {
    console.warn("<lyric-language> is missing required 'xml:lang' attribute.");
    return undefined;
  }
  const lyricLanguageData: Partial<LyricLanguage> = {
    number: getAttribute(element, "number"),
    name: getAttribute(element, "name"),
    xmlLang: xmlLang,
  };
  Object.keys(lyricLanguageData).forEach(
    (key) =>
      lyricLanguageData[key as keyof LyricLanguage] === undefined &&
      delete lyricLanguageData[key as keyof LyricLanguage],
  );
  return LyricLanguageSchema.parse(lyricLanguageData);
};
