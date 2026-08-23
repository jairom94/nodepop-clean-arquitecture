import { z } from "zod";
import { TagSchema } from "@/application/tags/schemas/TagSchema";

export const ProductSchema = z.object({
  id: z.number().nullable(),
  name: z.string(),
  price: z.number(),
  ownerId: z.number(),
  image: z.string().nullable(),
  tags: z.array(TagSchema),
});

export type ProductDto = z.infer<typeof ProductSchema>;

export const ProductListResponseSchema = z.object({
  items: z.array(ProductSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export type ProductListResponseDto = z.infer<typeof ProductListResponseSchema>;

export const CreateProductSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(100, "Máximo 100 caracteres"),
  price: z.number().positive("El precio debe ser positivo"),
  ownerId: z.number().int().positive(),
  image: z.url("Debe ser una URL válida").nullable().optional(),
  tags: z.array(z.string().min(1)).optional(),
});

export type CreateProductDto = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = z
  .object({
    name: z.string().min(1, "El nombre es obligatorio").max(100, "Máximo 100 caracteres").optional(),
    price: z.number().positive("El precio debe ser positivo").optional(),
    image: z.url("Debe ser una URL válida").nullable().optional(),
    tags: z.array(z.string().min(1)).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debes proporcionar al menos un campo",
  });

export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;
