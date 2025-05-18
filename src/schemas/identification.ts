import { z } from 'zod';

/**
 * The creator element is used to name the creator of a work.
 * The type attribute is used to distinguish composers, arrangers, lyricists, etc.
 */
export const CreatorSchema = z.object({
  type: z.string().optional(), // e.g., "composer", "lyricist", "arranger"
  name: z.string(), // Text content of the creator element
});
export type Creator = z.infer<typeof CreatorSchema>;

/**
 * The rights element is used to specify copyright and other intellectual property notices.
 * The type attribute indicates the type of rights (e.g., "copyright", "publisher").
 */
export const RightsSchema = z.object({
  type: z.string().optional(),
  text: z.string(), // Text content of the rights element
});
export type Rights = z.infer<typeof RightsSchema>;

/**
 * The encoding element contains information about the digital encoding of the MusicXML file.
 */
export const EncodingSoftwareSchema = z.string(); // Software name
export const EncodingDateSchema = z.string(); // Date in YYYY-MM-DD format or similar
export const EncoderSchema = z.string(); // Person or organization doing the encoding

export const EncodingSchema = z.object({
  software: z.array(EncodingSoftwareSchema).optional(), // Can have multiple <software> tags
  'encoding-date': z.array(EncodingDateSchema).optional(), // Can have multiple <encoding-date> tags
  encoder: z.array(EncoderSchema).optional(), // Can have multiple <encoder> tags
  // TODO: Add other encoding children like <supports>
});
export type Encoding = z.infer<typeof EncodingSchema>;

/**
 * The identification complex type contains metadata about the score.
 * This includes information about the work, the encoding, and rights.
 */
export const IdentificationSchema = z.object({
  creators: z.array(CreatorSchema).optional(),
  rights: z.array(RightsSchema).optional(),
  encoding: EncodingSchema.optional(),
  /**
   * The source element is used to give a bibliographic reference for the source of the music.
   */
  source: z.string().optional(),
  // TODO: Add other identification children like <relation>, <miscellaneous>
});
export type Identification = z.infer<typeof IdentificationSchema>; 