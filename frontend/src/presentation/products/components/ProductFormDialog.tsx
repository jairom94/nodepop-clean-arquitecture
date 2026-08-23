import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ProductDto } from "@/application/products/schemas/ProductSchema";
import { useTags } from "@/presentation/tags/hooks/useTags";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const productFormSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(100, "Máximo 100 caracteres"),
  price: z
    .number({ error: "Introduce un precio válido" })
    .positive("El precio debe ser positivo"),
  image: z
    .string()
    .refine((v) => v === "" || z.url().safeParse(v).success, "Debe ser una URL válida"),
  tags: z.string().refine(
    (v) =>
      v
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean).length <= 10,
    "Máximo 10 tags",
  ),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormDialogProps {
  product: ProductDto | null;
  onClose: () => void;
  onSubmit: (values: {
    name: string;
    price: number;
    image: string | null;
    tags: string[];
  }) => Promise<void>;
}

function toFormValues(product: ProductDto | null): ProductFormValues {
  return {
    name: product?.name ?? "",
    price: product?.price ?? ("" as unknown as number),
    image: product?.image ?? "",
    tags: product?.tags.map((t) => t.name).join(", ") ?? "",
  };
}

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function ProductFormDialog({ product, onClose, onSubmit }: ProductFormDialogProps) {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: toFormValues(product),
  });

  const tagsQuery = useTags();
  const tagsValue = watch("tags") ?? "";

  const appendTag = (name: string) => {
    const current = parseTags(tagsValue);
    if (current.includes(name)) return;
    const next = [...current, name].join(", ");
    setValue("tags", next, { shouldValidate: true });
  };

  const submit = async (values: ProductFormValues) => {
    try {
      await onSubmit({
        name: values.name,
        price: values.price,
        image: values.image ? values.image : null,
        tags: parseTags(values.tags ?? ""),
      });
      onClose();
    } catch {
      setError("root", { message: "No se pudo guardar el producto. Inténtalo de nuevo" });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle>{product ? "Editar producto" : "Nuevo producto"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" placeholder="Bicicleta de montaña" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="price">Precio (€)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="150.00"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="image">Imagen (URL)</Label>
              <Input id="image" placeholder="https://..." {...register("image")} />
              {errors.image && <p className="text-sm text-destructive">{errors.image.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="tags">Tags (separados por coma)</Label>
              <Input id="tags" placeholder="bikes, mountain" {...register("tags")} />
              {errors.tags && <p className="text-sm text-destructive">{errors.tags.message}</p>}
              {(tagsQuery.data ?? []).length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {(tagsQuery.data ?? []).map((tag) => {
                    const selected = parseTags(tagsValue).includes(tag.name);
                    return (
                      <button
                        key={tag.id ?? tag.name}
                        type="button"
                        onClick={() => appendTag(tag.name)}
                        className={[
                          "rounded-full px-2 py-0.5 text-xs transition-colors",
                          selected
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                        ].join(" ")}
                      >
                        {tag.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
