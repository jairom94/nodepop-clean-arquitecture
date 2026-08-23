import { z } from "zod";

export const RegisterCredentialsSchema = z.object({
  name: z
    .string({ error: "El nombre es obligatorio" })
    .min(1, "El nombre es obligatorio")
    .max(50, "Debe tener menos de 50 caracteres"),
  lastname1: z
    .string({ error: "El apellido es obligatorio" })
    .min(1, "El apellido es obligatorio")
    .max(50, "Debe tener menos de 50 caracteres"),
  email: z
    .string({ error: "El email es obligatorio" })
    .min(1, "El email es obligatorio")
    .pipe(z.email("Introduce un email válido")),
  password: z
    .string({ error: "La contraseña es obligatoria" })
    .min(1, "La contraseña es obligatoria")
    .min(6, "Debe tener al menos 6 caracteres")
    .max(100, "Debe tener menos de 100 caracteres"),
});

export type RegisterCredentials = z.infer<typeof RegisterCredentialsSchema>;
