import z from "zod";

export const RefreshTokenResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
});

export type RefreshTokenResponseDto = z.infer<typeof RefreshTokenResponseSchema>;
