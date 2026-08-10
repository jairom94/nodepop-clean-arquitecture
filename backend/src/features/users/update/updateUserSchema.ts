import z from "zod";

export const updateUserSchema = z.object({
    name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name must be less than 50 characters" })
    .optional(),
    lastname1: z
    .string()
    .min(1, { message: "Lastname is required" })
    .max(50, { message: "Lastname must be less than 50 characters" })
    .optional(),
    email: z
    .string()
    .email({ message: "Email must be a valid email" })
    .optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided" }
);
