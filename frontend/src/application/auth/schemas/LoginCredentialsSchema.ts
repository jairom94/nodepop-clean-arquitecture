import { z } from 'zod';

export const LoginCredentialsSchema = z.object({
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .pipe(z.email("Introduce un email válido")),
  password: z.string().min(1, "La contraseña es obligatoria").min(8, "Debe tener al menos 8 caracteres"),
});

export type LoginCredentials =
  z.infer<typeof LoginCredentialsSchema>;