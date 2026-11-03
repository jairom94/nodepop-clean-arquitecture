import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ProductDto } from "@/application/products/schemas/ProductSchema";
import { useTags } from "@/presentation/tags/hooks/useTags";
import { ProductImage } from "@/presentation/components/ProductImage";
import { TagChip } from "@/presentation/components/TagChip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resolveImageUrl } from "@/lib/image";

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_TAGS = 10;

const productFormSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(100, "Máximo 100 caracteres"),
  price: z.number({ error: "Introduce un precio válido" }).positive("El precio debe ser positivo"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export interface ProductFormResult extends ProductFormValues {
  file: File | null;
  tags: string[];
}

interface ProductFormDialogProps {
  product: ProductDto | null;
  onClose: () => void;
  onSubmit: (values: ProductFormResult) => Promise<void>;
}

export function ProductFormDialog({ product, onClose, onSubmit }: ProductFormDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(resolveImageUrl(product?.image));
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    product?.tags.map((tag) => tag.name) ?? [],
  );
  const [newTag, setNewTag] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name ?? "",
      price: product?.price ?? ("" as unknown as number),
    },
  });

  const tagsQuery = useTags();
  const existingTags = (tagsQuery.data ?? []).map((tag) => tag.name);
  const allTags = [...new Set([...existingTags, ...selectedTags])];
  const tagLimitReached = selectedTags.length >= MAX_TAGS;

  const toggleTag = (name: string) => {
    if (selectedTags.includes(name)) {
      setSelectedTags(selectedTags.filter((tag) => tag !== name));
    } else if (!tagLimitReached) {
      setSelectedTags([...selectedTags, name]);
    }
  };

  const handleNewTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const name = newTag.trim();
    if (!name) return;
    if (!selectedTags.includes(name) && !tagLimitReached) {
      setSelectedTags([...selectedTags, name]);
    }
    setNewTag("");
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(resolveImageUrl(product?.image));
      return;
    }
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setFileError(`Formato no permitido. Válidos: ${ALLOWED_EXTENSIONS.join(", ")}`);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError("La imagen no puede superar los 5 MB");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const submit = async (values: ProductFormValues) => {
    if (fileError) return;
    try {
      await onSubmit({ ...values, file: selectedFile, tags: selectedTags });
      onClose();
    } catch {
      setError("root", { message: "No se pudo guardar el producto. Inténtalo de nuevo" });
    }
  };

  return (
    <Dialog open onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{product ? "Editar producto" : "Publicar producto"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
          <div>
            <div className="relative">
              <ProductImage
                src={previewUrl}
                name="Vista previa"
                tags={selectedTags}
                seed={product?.id ?? 0}
                className="aspect-video w-full rounded-2xl"
              />
              <label className="absolute right-2.5 bottom-2.5 inline-flex h-10 cursor-pointer items-center rounded-full bg-card px-3.5 text-sm font-semibold has-focus-visible:ring-3 has-focus-visible:ring-ring/50">
                {previewUrl ? "Cambiar foto" : "Añadir foto"}
                <input
                  id="image-file"
                  type="file"
                  accept={ALLOWED_EXTENSIONS.join(",")}
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            </div>
            {fileError ? (
              <p className="mt-1.5 text-sm text-destructive">{fileError}</p>
            ) : (
              <p className="mt-1.5 text-sm text-muted-foreground">
                JPG, PNG, WebP o GIF, hasta 5 MB.
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex flex-[3_1_12rem] flex-col gap-1.5">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Bicicleta de montaña"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="flex flex-[1_1_7rem] flex-col gap-1.5">
              <Label htmlFor="price">Precio (€)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="150"
                aria-invalid={!!errors.price}
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm leading-none font-medium">Tags (máximo {MAX_TAGS})</legend>
            {allTags.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <TagChip
                    key={tag}
                    label={tag}
                    size="sm"
                    selected={selectedTags.includes(tag)}
                    onClick={() => toggleTag(tag)}
                  />
                ))}
              </div>
            )}
            <Label htmlFor="new-tag" className="mt-1">
              Añadir un tag nuevo
            </Label>
            <Input
              id="new-tag"
              maxLength={50}
              placeholder="Escribe y pulsa Enter"
              disabled={tagLimitReached}
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleNewTagKeyDown}
            />
          </fieldset>

          {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {product
                ? isSubmitting
                  ? "Guardando..."
                  : "Guardar cambios"
                : isSubmitting
                  ? "Publicando..."
                  : "Publicar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
