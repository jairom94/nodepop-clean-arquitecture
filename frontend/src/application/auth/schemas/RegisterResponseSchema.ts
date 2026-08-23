import z from "zod";

export const RegisterResponseSchema = z.object({
  id: z.number().nullable(),
  name: z.string(),
  lastname1: z.string(),
  email: z.email(),
});

export type RegisterResponseDto = z.infer<typeof RegisterResponseSchema>;
