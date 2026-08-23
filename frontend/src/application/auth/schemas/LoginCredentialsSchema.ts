import { z } from 'zod';

export const LoginCredentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type LoginCredentials =
  z.infer<typeof LoginCredentialsSchema>;