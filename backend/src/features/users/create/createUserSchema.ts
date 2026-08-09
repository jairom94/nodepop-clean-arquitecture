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
    .max(100, { message: "Password must be less than 100 characters" }),
})
