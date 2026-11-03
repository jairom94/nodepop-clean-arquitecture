import z from "zod";

export const createProductSchema = z.object({
    name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
    price: z
    .coerce
    .number()
    .positive({ message: "Price must be positive" })
    .max(10_000_000, { message: "Price must be at most 10,000,000" }),
    tags: z
    .preprocess(
      (val) => {
        if (typeof val === "string") {
          try { return JSON.parse(val); }
          catch { return [val]; }
        }
        return val;
      },
      z.array(
      z.string()
        .min(1, { message: "Tag must not be empty" })
        .max(50, { message: "Tag must be at most 50 characters" }),
    ).max(10, { message: "A product can have at most 10 tags" }).optional(),
    )
    .optional(),
});
