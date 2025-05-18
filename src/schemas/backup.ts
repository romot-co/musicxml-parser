import { z } from 'zod';

export const BackupSchema = z.object({
  _type: z.literal('backup'),
  duration: z.number().int(),
});

export type Backup = z.infer<typeof BackupSchema>;
