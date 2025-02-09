import { z } from 'zod';
import { Regex } from '@/resources/regex.resource.js';

// Schema for user login validation
const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email address format' }),

  password: z
    .string({ required_error: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(Regex.PASSWORD, {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }),

  remember: z
    .boolean({ required_error: 'Remember field is required' })
});

export type LoginDto = z.infer<typeof loginSchema>;
export default loginSchema;
