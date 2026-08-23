import z from "zod";

export const LoginResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
  user: z.object({
    id: z.number(),
    name: z.string(),
    lastname1: z.string(),
    email: z.email(),
  }),
});

export type LoginResponseDto = z.infer<typeof LoginResponseSchema>;