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
    .max(10_000_000, { message: "Price must be at most 10,000,000" })
    .optional(),
    tags: z
    .array(
      z.string()
        .min(1, { message: "Tag must not be empty" })
        .max(50, { message: "Tag must be at most 50 characters" }),
    )
    .max(10, { message: "A product can have at most 10 tags" })
    .optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided" }
);
