import z from "zod";

export const updateProductSchema = z.object({
    name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" })
    .optional(),
    price: z
    .number()
    .positive({ message: "Price must be positive" })
    .optional(),
    image: z
    .string()
    .url({ message: "Image must be a valid URL" })
    .nullable()
    .optional(),
    tags: z
    .array(z.string().min(1, { message: "Tag must not be empty" }))
    .optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided" }
);
