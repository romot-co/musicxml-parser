import { z } from "zod";
import { PitchSchema } from "./pitch";
import { RestSchema } from "./rest";
import { LyricSchema } from "./lyric";
import { TieSchema } from "./tie";
import { AccidentalSchema } from "./accidental";
import { NotationsSchema } from "./notations";
import { StemSchema } from "./stem";
import { BeamSchema } from "./beam";
import { GraceSchema } from "./grace";
import { CueSchema } from "./cue";
import { UnpitchedSchema } from "./unpitched";
import { TimeModificationSchema } from "./timeModification";

/**
 * Represents a single musical note or rest.
 * Common fields include duration, voice, and type.
 * A note must contain either pitch information or be a rest.
 */
export const NoteSchema = z
  .object({
    _type: z.literal("note"),
    grace: GraceSchema.optional(),
    cue: CueSchema.optional(),
    isChord: z.boolean().optional(),
    pitch: PitchSchema.optional(),
    unpitched: UnpitchedSchema.optional(),
    rest: RestSchema.optional(),
    duration: z.number().int().optional(),
    timeModification: TimeModificationSchema.optional(),
    ties: z.array(TieSchema).max(2).optional(),
    voice: z.string().optional(),
    type: z.string().optional(),
    dots: z.array(z.object({})).optional(),
    accidental: AccidentalSchema.optional(),
    stem: StemSchema.optional(),
    beams: z.array(BeamSchema).optional(),
    notations: NotationsSchema.optional(),
    lyrics: z.array(LyricSchema).optional(),
    printLeger: z.enum(["yes", "no"]).optional(),
    dynamics: z.number().optional(),
    endDynamics: z.number().optional(),
    attack: z.number().optional(),
    release: z.number().optional(),
    pizzicato: z.enum(["yes", "no"]).optional(),
  })
  .refine(
    (data) => {
      const PITCH_LIKE_ELEMENTS = [data.pitch, data.rest, data.unpitched];
      return PITCH_LIKE_ELEMENTS.filter((p) => p !== undefined).length === 1;
    },
    {
      message: "Note must have exactly one of pitch, rest, or unpitched",
    },
  )
  .refine(
    (data) => {
      if (data.grace && data.duration !== undefined) {
        return false;
      }
      if (data.cue && !data.grace && data.duration === undefined) {
        return false;
      }
      if (!data.grace && !data.cue && data.duration === undefined) {
        return false;
      }
      return true;
    },
    {
      message: "Duration presence/absence depends on grace and cue elements.",
    },
  );

export type Note = z.infer<typeof NoteSchema>;
