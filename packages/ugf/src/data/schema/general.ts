import { z } from 'zod';

export const SizeSchema = z.object({
  width: z.number().nonnegative(),
  height: z.number().nonnegative(),
});