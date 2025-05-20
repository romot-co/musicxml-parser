export type { Pitch } from "../schemas/pitch";
export type { Rest } from "../schemas/rest";
export type { Note } from "../schemas/note";
export type { Measure } from "../schemas/measure";
export type { Part } from "../schemas/part";
export type { ScorePart } from "../schemas/scorePart";
export type { PartList } from "../schemas/partList";
export type { ScorePartwise } from "../schemas/scorePartwise";
export type { ScoreTimewise } from "../schemas/scoreTimewise";
export type { TimewiseMeasure } from "../schemas/timewiseMeasure";
export type { TimewisePart } from "../schemas/timewisePart";
export type { Key } from "../schemas/key";
export type { Time } from "../schemas/time";
export type { Clef } from "../schemas/clef";
export type { Attributes } from "../schemas/attributes";
export type { Lyric, Extend, Elision, LyricFormatting } from "../schemas/lyric";
export type { Tie } from "../schemas/tie";
export type { Tie as Tied } from "../schemas/tie";
export type {
  Direction,
  DirectionType,
  Words,
  Metronome,
  MetronomeBeatUnit,
  MetronomePerMinute,
  MetronomeNote,
  MetronomeRelation,
  Dynamics,
  Pedal,
  Wedge,
  Segno,
  Coda,
  Rehearsal,
  OctaveShift,
  Dashes,
  Bracket,
  Image,
  Eyeglasses,
  Damp,
  DampAll,
  StringMute,
  HarpPedals,
  PedalTuning,
  Scordatura,
  Accord,
  PrincipalVoice,
  AccordionRegistration,
  StaffDivide,
  OtherDirection,
} from "../schemas/direction";

export type {
  Transpose,
  Diatonic,
  Chromatic,
  OctaveChange,
  Double,
} from "../schemas/transpose";
export type {
  StaffDetails,
  StaffTuning,
  LineDetail,
} from "../schemas/staffDetails";
export type {
  MeasureStyle,
  MultipleRest,
  MeasureRepeat,
  BeatRepeat,
  Slash,
} from "../schemas/measureStyle";
export type { Accidental, AccidentalValue } from "../schemas/accidental";
export type {
  Notations,
  Slur,
  Articulations,
  Staccato,
  Accent,
  Tenuto,
  Spiccato,
  Staccatissimo,
  StrongAccent,
  Tuplet,
  Ornaments,
  TrillMark,
  Turn,
  Mordent,
  Schleifer,
  OtherOrnament,
  Technical,
  Arpeggiate,
  NonArpeggiate,
} from "../schemas/notations";
export type { Barline, BarStyle, Repeat, Ending } from "../schemas/barline";
export type { Fermata, FermataShape } from "../schemas/fermata";
export type { Work } from "../schemas/work";
export type { Opus } from "../schemas/opus";
export type {
  Identification,
  Creator,
  Rights,
  Encoding,
  Supports,
  Relation,
  Miscellaneous,
  MiscellaneousField,
  EncodingSoftwareSchema as EncodingSoftware,
  EncodingDateSchema as EncodingDate,
  EncoderSchema as Encoder,
} from "../schemas/identification";
export type { Beam, BeamValue } from "../schemas/beam";
export type { PartSymbol } from "../schemas/partSymbol";
export type { StemValue } from "../schemas/stem";
export type { Grace } from "../schemas/grace";
export type { Cue } from "../schemas/cue";
export type {
  Unpitched,
  DisplayStep,
  DisplayOctave,
} from "../schemas/unpitched";
export type { NoteTypeValue } from "../schemas/noteType";
export type {
  YesNo,
  Font,
  FontStyleEnum,
  FontWeightEnum,
  Margins,
  LineWidth,
} from "../schemas/common";
export type {
  Defaults,
  Scaling,
  PageLayout,
  SystemLayout,
  StaffLayout,
  Appearance,
  NoteSize,
  Distance,
  Glyph,
  OtherAppearance,
  ConcertScore,
  MusicFont,
  WordFont,
  LyricFont,
  LyricLanguage,
  SystemDividers,
} from "../schemas/defaults";
export type {
  Credit,
  CreditType,
  CreditWords,
  CreditSymbol,
  CreditImage,
  TextFormatting,
  SymbolFormatting,
} from "../schemas/credit";
export type { Harmony, Frame, FrameNote, FirstFret } from "../schemas/harmony";
export type { Print } from "../schemas/print";
export type { Sound } from "../schemas/sound";
export type { MeasureContent } from "../schemas/measure";
export type { Backup } from "../schemas/backup";
export type { Forward } from "../schemas/forward";
export type { WavyLine } from "../schemas/wavyLine";
export type { Footnote, Level } from "../schemas/editorial";
export type { GroupSymbolValue } from "../schemas/partSymbol";
export type { PartGroup } from "../schemas/partGroup";
export type { ScoreInstrument } from "../schemas/scoreInstrument";
export type { MidiInstrument } from "../schemas/midiInstrument";
export type { FiguredBass, Figure } from "../schemas/figuredBass";
export type { Grouping, Feature } from "../schemas/grouping";
export type { Link } from "../schemas/link";
export type { Bookmark } from "../schemas/bookmark";
export type {
  Glissando,
  Slide,
  Tremolo,
  OtherNotation,
} from "../schemas/notations";
export type { MidiDevice } from "../schemas/midiDevice";
export type { TimeModification } from "../schemas/timeModification";
export type {
  NoteheadText,
  DisplayText,
  AccidentalText,
} from "../schemas/noteheadText";
// Add other inferred types from Zod schemas here as they are created.

export type ParsedMusicXml = Record<string, unknown>;
export type { DisplayText, AccidentalText } from "../schemas/displayText";
export type { PartNameDisplay } from "../schemas/partNameDisplay";
export type { PartAbbreviationDisplay } from "../schemas/partAbbreviationDisplay";
