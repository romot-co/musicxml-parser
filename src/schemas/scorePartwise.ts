import { z } from "zod";
import { PartListSchema } from "./partList";
import { PartSchema } from "./part";
import { WorkSchema } from "./work";
import { IdentificationSchema } from "./identification";
import { DefaultsSchema } from "./defaults";
import { CreditSchema } from "./credit";

// Placeholders for other top-level metadata elements
// const WorkSchemaPlaceholder = z.object({ title: z.string().optional() }).passthrough().optional();
// const MovementTitleSchemaPlaceholder = z.string().optional();
// const IdentificationSchemaPlaceholder = z.object({ composer: z.string().optional() }).passthrough().optional();
// const DefaultsSchemaPlaceholder = z.object({}).passthrough().optional(); // Complex, placeholder for now
// const CreditSchemaPlaceholder = z
//  .object({ creditWords: z.string().optional() })
//  .passthrough();

/**
 * Represents the <score-partwise> element, the root element for a partwise MusicXML score.
 * It contains metadata about the score and the musical data organized by parts.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ScorePartwiseSchema: z.ZodType<any> = z
  .object({
    /**
     * The version of the MusicXML format (e.g., "3.1", "4.0").
     * While optional in the DTD, it's good practice to include it.
     */
    version: z.string().optional().default("1.0"),
    /** Work title and related information. */
    work: WorkSchema.optional(),
    /** Movement title. */
    movementTitle: z.string().optional(),
    /** Identification of creators, encoding, etc. */
    identification: IdentificationSchema.optional(),
    /** Score-wide defaults for layout, appearance, and MIDI. */
    defaults: DefaultsSchema.optional(),
    /** Text credits for the score. */
    credit: z.array(CreditSchema).optional(),

    /**
     * The <part-list> contains the list of all parts in the score,
     * along with their names and IDs.
     * This is a required element.
     */
    partList: PartListSchema, // <part-list>
    /**
     * An array of <part> elements, each containing the musical data (measures and notes)
     * for a specific part defined in the <part-list>.
     * This is a required element and must contain at least one part.
     */
    parts: z.array(PartSchema).min(1), // <part>
  })
  .passthrough(); // Allows other top-level elements not explicitly defined

export type ScorePartwise = z.infer<typeof ScorePartwiseSchema>;
