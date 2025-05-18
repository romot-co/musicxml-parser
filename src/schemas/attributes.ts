import { z } from "zod";
import { KeySchema } from "./key";
import { TimeSchema } from "./time";
import { ClefSchema } from "./clef";
import { TransposeSchema } from "./transpose";
import { StaffDetailsSchema } from "./staffDetails";
import { MeasureStyleSchema } from "./measureStyle";
import { PartSymbolSchema } from "./partSymbol";

export const AttributesSchema = z.object({
  _type: z.literal("attributes"),
  divisions: z.number().int().positive().optional(),
  key: z.array(KeySchema).optional(), // <key> can appear multiple times for different staves, though often once
  time: z.array(TimeSchema).optional(), // <time> can appear multiple times
  clef: z.array(ClefSchema).optional(), // <clef> can appear multiple times
  transpose: z.array(TransposeSchema).optional(),
  instruments: z.number().int().positive().optional(),
  staves: z.number().int().positive().optional(),
  /** Number of instruments represented in the part */
  instruments: z.number().int().positive().optional(),
  staffDetails: z.array(StaffDetailsSchema).optional(),
  measureStyle: z.array(MeasureStyleSchema).optional(),
  partSymbol: PartSymbolSchema.optional(),
  // Placeholder for other attributes like <for-part> etc.
});

export type Attributes = z.infer<typeof AttributesSchema>;
