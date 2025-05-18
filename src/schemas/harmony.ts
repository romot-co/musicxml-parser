import { z } from "zod";
import { TextFormattingSchema } from "./credit"; // Assuming similar formatting needs
import { YesNoEnum } from "./common";

// Forward declaration for FrameSchema as it's a child of Harmony
// We will define a placeholder schema for now and replace it later.
const PlaceholderFrameSchema = z.object({
  placeholder: z.string().optional(), // This will be replaced by the actual FrameSchema
});
export type Frame = z.infer<typeof PlaceholderFrameSchema>; // Temporary type
export const FrameSchema = z.lazy(() => PlaceholderFrameSchema); // Use placeholder

export const RootStepSchema = z.enum(["A", "B", "C", "D", "E", "F", "G"]);
const AlterSchema = z.number().int().min(-2).max(2); // Assuming double-flat to double-sharp

export const RootSchema = z.object({
  step: RootStepSchema,
  alter: AlterSchema.optional(),
  text: z.string().optional(), // For cases like 'none' or complex roots
});

export const BassStepSchema = RootStepSchema; // Bass has the same structure as root

export const BassSchema = z.object({
  step: BassStepSchema,
  alter: AlterSchema.optional(),
  text: z.string().optional(),
});

export const KindValueEnum = z.enum([
  "major",
  "minor",
  "augmented",
  "diminished",
  "dominant",
  "major-seventh",
  "minor-seventh",
  "diminished-seventh",
  "augmented-seventh",
  "half-diminished",
  "major-minor",
  "major-sixth",
  "minor-sixth",
  "dominant-ninth",
  "major-ninth",
  "minor-ninth",
  "dominant-11th",
  "major-11th",
  "minor-11th",
  "dominant-13th",
  "major-13th",
  "minor-13th",
  "suspended-second",
  "suspended-fourth",
  "power",
  "none",
  "other", // 'other' requires text attribute
]);

export const KindSchema = z.object({
  value: KindValueEnum,
  text: z.string().optional(), // For 'other' or specific alterations
  useSymbols: YesNoEnum.optional(),
  stackDegrees: YesNoEnum.optional(), // Not in 4.0, but might be in older versions or common use
  parenthesesDegrees: YesNoEnum.optional(),
  bracketDegrees: YesNoEnum.optional(),
});

export const DegreeTypeEnum = z.enum(["add", "alter", "subtract"]);
const DegreeValueSchema = z.number().int().min(1).max(15); // Example range
const DegreeAlterSchema = AlterSchema;

export const DegreeSchema = z.object({
  value: DegreeValueSchema,
  type: DegreeTypeEnum,
  alter: DegreeAlterSchema.optional(),
  text: z.string().optional(), // For display purposes
  printObject: YesNoEnum.optional(),
});

export const HarmonySchema = z.object({
  _type: z.literal("harmony"),
  type: z.enum(["explicit", "implied", "alternate"]).optional(), // Not standard but useful
  root: RootSchema.optional(),
  kind: KindSchema.optional(),
  inversion: z.number().int().min(0).optional(),
  bass: BassSchema.optional(),
  degrees: z.array(DegreeSchema).optional(), // For alterations like "add9", "flat5"
  frame: FrameSchema.optional(), // To be defined later
  offset: z.number().optional(), // Not standard MusicXML, but used for time position
  staff: z.number().int().positive().optional(),
  show: z.enum(["all", "root", "chord", "bass"]).optional(), // Not standard, for display hints
  printObject: YesNoEnum.optional(),
  printFrame: YesNoEnum.optional(),
  placement: z.enum(["above", "below"]).optional(), // For staff placement
  system: z.string().optional(), // For system-specific harmonies
  formatting: TextFormattingSchema.optional(), // For text display properties
  // additional attributes like 'default-x', 'default-y', 'relative-x', 'relative-y' can be added
  // if detailed positioning is needed, potentially in a sub-object.
});

export type Harmony = z.infer<typeof HarmonySchema>;

// Placeholder for FrameSchemaInternal to avoid circular dependencies for now
// This will be properly defined in frame.ts and imported/used here.
// const FrameSchemaInternal = z.object({  // This can be removed for now
//   // Define Frame properties here later
//   placeholder: z.string().optional(),
// });
