import { z } from 'zod';

/**
 * The group-symbol-value type indicates how a line is displayed in relation to a part group.
 * Standard values are none, brace, line, bracket, and square.
 */
export const GroupSymbolValueEnum = z.enum([
  'none', 'brace', 'line', 'bracket', 'square'
]);
export type GroupSymbolValue = z.infer<typeof GroupSymbolValueEnum>;

/**
 * The part-symbol type represents a musical symbol that is used across multiple staves, such as a bracket or brace.
 * The group attribute allows specification of staff groups, as with the part-group element.
 *
 * The top-staff and bottom-staff attributes are used when the symbol is not displayed across all staves in a part.
 * The default-x and default-y attributes are used for precise positioning. The color attribute is used for color.
 *
 * The part-symbol element indicates how a symbol is displayed across staves. It can be used for staff groups (brackets, braces)
 * that are notated in the MusicXML file.
 *
 * For example, a bracket might be indicated by a <part-symbol> element with a text content of "bracket".
 * The element's attributes would then control how this bracket is displayed.
 */
export const PartSymbolSchema = z.object({
  /**
   * The text content of the part-symbol element (e.g., "bracket", "brace").
   * This corresponds to the type of symbol.
   */
  value: z.string(),
  /**
   * Indicates how a line is displayed in relation to a part group.
   */
  groupSymbol: GroupSymbolValueEnum.optional(),
  /**
   * Specifies the top staff of the symbol.
   */
  topStaff: z.number().int().optional(),
  /**
   * Specifies the bottom staff of the symbol.
   */
  bottomStaff: z.number().int().optional(),
  /**
   * Changes the horizontal position relative to the default position, positive to the right and negative to the left.
   */
  defaultX: z.number().optional(),
  /**
   * Changes the vertical position relative to the default position, positive up and negative down.
   */
  defaultY: z.number().optional(),
  /**
   * Specifies the color of an element.
   */
  color: z.string().optional(), // Assuming color is a string like #RRGGBB
});

export type PartSymbol = z.infer<typeof PartSymbolSchema>; 