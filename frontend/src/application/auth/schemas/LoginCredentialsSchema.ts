import { z } from 'zod';

export const LoginCredentialsSchema = z.object({
  email: z
    .string({ error: "El email es obligatorio" })
    .min(1, "El email es obligatorio")
    .pipe(z.email("Introduce un email válido")),
  password: z
    .string({ error: "La contraseña es obligatoria" })
    .min(1, "La contraseña es obligatoria")
    .min(6, "Debe tener al menos 6 caracteres"),
});

export type LoginCredentials =
  z.infer<typeof LoginCredentialsSchema>;