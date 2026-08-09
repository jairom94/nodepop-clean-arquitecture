import z from "zod";

export const createProductSchema = z.object({
    name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
    price: z
    .number()
    .positive({ message: "Price must be positive" }),
    ownerId: z
    .number()
    .int()
    .positive({ message: "Owner is required" }),
    image: z
    .string()
    .url({ message: "Image must be a valid URL" })
    .nullable()
    .optional(),
    tags: z
    .array(z.string().min(1, { message: "Tag must not be empty" }))
    .optional(),
})
