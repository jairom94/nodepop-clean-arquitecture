import { z } from "zod";

export const UpdateUserSchema = z.object({
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
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
