import { z } from 'zod';

export const FermataShapeEnum = z.enum([
  'normal',
  'angled',
  'square',
  'double-angled',
  'double-square',
  'double-dot',
  'half-curve',
  'curlew',
  '',
]);
export type FermataShape = z.infer<typeof FermataShapeEnum>;

export const FermataSchema = z.object({
  value: FermataShapeEnum.optional(),
  type: z.enum(['upright', 'inverted']).optional(),
});
export type Fermata = z.infer<typeof FermataSchema>;
