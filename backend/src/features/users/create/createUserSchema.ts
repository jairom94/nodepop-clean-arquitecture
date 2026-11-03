import z from "zod";

export const createUserSchema = z.object({
    name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name must be less than 50 characters" }),
    lastname1: z
    .string()
    .min(1, { message: "Lastname is required" })
    .max(50, { message: "Lastname must be less than 50 characters" }),
    email: z
    .string()
    .email({ message: "Email must be a valid email" }),
    password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    // bcrypt ignora lo que pasa de 72 bytes: más larga daría una falsa sensación de seguridad
    .refine((value) => Buffer.byteLength(value, "utf8") <= 72, {
        message: "Password must be at most 72 bytes",
    }),
})
