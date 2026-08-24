import z from "zod";

export const createProductSchema = z.object({
    name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
    price: z
    .coerce
    .number()
    .positive({ message: "Price must be positive" }),
    ownerId: z
    .coerce
    .number()
    .int()
    .positive({ message: "Owner is required" }),
    tags: z
    .preprocess(
      (val) => {
        if (typeof val === "string") {
          try { return JSON.parse(val); }
          catch { return [val]; }
        }
        return val;
      },
      z.array(z.string().min(1, { message: "Tag must not be empty" })).optional(),
    )
    .optional(),
});
