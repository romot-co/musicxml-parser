import { z } from 'zod';
import { YesNoEnum } from './common';

/**
 * The staff-details element is used to indicate editorial information for a staff.
 * This includes the number of staff lines and other details.
 */

// Schema for <line-detail> element
// Only a subset of attributes are modeled for now.
export const LineDetailSchema = z.object({
  line: z.number().int(),
  width: z.number().optional(),
  color: z.string().optional(),
  lineType: z.string().optional(),
  printObject: YesNoEnum.optional(),
});

// Schema for <staff-tuning> element
export const StaffTuningSchema = z.object({
  tuningStep: z.enum(['A', 'B', 'C', 'D', 'E', 'F', 'G']),
  tuningAlter: z.number().optional(),
  tuningOctave: z.number().int(),
  line: z.number().int(),
});

export const StaffDetailsSchema = z.object({
  /**
   * The staff-type attribute indicates the type of staff this detail applies to.
   * This is typically a string.
   */
  staffType: z.string().optional(), // staff-type is PCDATA
  /**
   * The staff-lines element specifies the number of lines for this staff.
   * A value of 0 indicates a staff with no lines (e.g., for percussion).
   */
  staffLines: z.number().int().optional(), // staff-lines is PCDATA (number)
  lineDetail: z.array(LineDetailSchema).optional(),
  staffTuning: z.array(StaffTuningSchema).optional(),
  /**
   * The capo attribute indicates the capo position for this staff.
   * This is typically a number.
   */
  capo: z.number().int().optional(), // capo is PCDATA (number)
  staffSize: z.object({ // staff-size has PCDATA content and a 'scaling' attribute
    value: z.number(), // Assuming PCDATA is a number
    scaling: z.number().optional(),
  }).optional(),
  /**
   * The number attribute indicates the staff number this detail applies to.
   * Staff numbers are 1-based.
   */
  number: z.number().int().optional(), // attribute
  /**
   * The show-frets attribute indicates whether to show fret numbers on this staff.
   * This is typically one of "numbers" or "letters".
   */
  showFrets: z.enum(['numbers', 'letters']).optional(), // attribute
  /**
   * The print-object attribute indicates whether to print this staff detail information.
   * Typically "yes" or "no".
   */
  printObject: YesNoEnum.optional(), // attribute from %print-object;
  /**
   * The print-spacing attribute indicates whether to print spacing information for this staff.
   * Typically "yes" or "no".
   */
  printSpacing: YesNoEnum.optional(), // attribute from %print-spacing;
});

export type StaffDetails = z.infer<typeof StaffDetailsSchema>;
export type StaffTuning = z.infer<typeof StaffTuningSchema>;
export type LineDetail = z.infer<typeof LineDetailSchema>; 