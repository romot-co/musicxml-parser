import { z } from "zod";

export const FeatureSchema = z.object({
  type: z.string().optional(),
  value: z.string(),
});

export const GroupingSchema = z.object({
  _type: z.literal("grouping"),
  type: z.enum(["start", "stop", "single"]),
  number: z.string().optional(),
  memberOf: z.string().optional(),
  features: z.array(FeatureSchema).optional(),
});

export type Feature = z.infer<typeof FeatureSchema>;
export type Grouping = z.infer<typeof GroupingSchema>;
