import { Regex } from '@/resources/regex.resource.js';
import { z } from 'zod';

export default z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address' }),

  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(Regex.PASSWORD, { message: 'Password must have at least one uppercase letter, one lowercase letter, one number, and one special character' }),

  remember: z
    .boolean(),
});
