import z from "zod";

export const logoutSchema = z.object({
    token: z
    .string()
    .min(1, { message: "Token is required" })
    .optional(),
})
