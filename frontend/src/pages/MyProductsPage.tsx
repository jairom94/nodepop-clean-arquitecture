import { useMemo, useState } from "react";
import {
  EMPTY_PRODUCTS_FILTER,
  ProductsFilter,
  type ProductsFilterValues,
} from "@/presentation/products/components/ProductsFilter";
import { useMyProductsAll } from "@/presentation/products/hooks/useMyProductsAll";
import { useCreateProduct } from "@/presentation/products/hooks/useCreateProduct";
import { useUpdateProduct } from "@/presentation/products/hooks/useUpdateProduct";
import { useDeleteProduct } from "@/presentation/products/hooks/useDeleteProduct";
import { ProductFormDialog } from "@/presentation/products/components/ProductFormDialog";
import { ProductCard } from "@/presentation/products/components/ProductCard";
import { ProductsEmptyState } from "@/presentation/products/components/ProductsEmptyState";
import { TagsManagerDialog } from "@/presentation/tags/components/TagsManagerDialog";
import type { ProductDto } from "@/application/products/schemas/ProductSchema";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

function parseOptionalNumber(value: string): number | null {
  if (value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export default function MyProductsPage() {
  const [filters, setFilters] = useState<ProductsFilterValues>(EMPTY_PRODUCTS_FILTER);
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<{ open: boolean; product: ProductDto | null }>({
    open: false,
    product: null,
  });
  const [tagsOpen, setTagsOpen] = useState(false);

  const { data: products, isPending, isError, refetch } = useMyProductsAll();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const filteredItems = useMemo(() => {
    if (!products) return [];
    const name = filters.name.trim().toLowerCase();
    const priceMin = parseOptionalNumber(filters.priceMin);
    const priceMax = parseOptionalNumber(filters.priceMax);

    return products.filter((product) => {
      if (name && !product.name.toLowerCase().includes(name)) return false;
      if (priceMin !== null && product.price < priceMin) return false;
      if (priceMax !== null && product.price > priceMax) return false;
      const tagNames = product.tags.map((t) => t.name);
      for (const selected of filters.tags) {
        if (!tagNames.includes(selected)) return false;
      }
      return true;
    });
  }, [products, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filteredItems.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  if (isPending) {
    return <p className="text-muted-foreground">Cargando productos...</p>;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-destructive">No se pudieron cargar tus productos</p>
        <Button variant="outline" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    );
  }

  const mutationFailed =
    createProduct.isError || updateProduct.isError || deleteProduct.isError;

  const handleCreate = async (values: {
    name: string;
    price: number;
    file: File | null;
    tags: string[];
  }) => {
    await createProduct.mutateAsync(values);
  };

  const handleUpdate = async (
    id: number,
    values: { name: string; price: number; file: File | null; tags: string[] },
  ) => {
    await updateProduct.mutateAsync({
      id,
      changes: {
        name: values.name,
        price: values.price,
        tags: values.tags,
      },
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    await deleteProduct.mutateAsync(id);
  };

  const handleFiltersChange = (next: ProductsFilterValues) => {
    setFilters(next);
    setPage(1);
  };

  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mis productos</h1>
          <span className="text-sm text-muted-foreground">
            {filteredItems.length} de {products?.length ?? 0} productos
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setTagsOpen(true)}>
            Gestionar tags
          </Button>
          <Button onClick={() => setDialog({ open: true, product: null })}>
            Nuevo producto
          </Button>
        </div>
      </div>

      <ProductsFilter values={filters} onChange={handleFiltersChange} />

      {mutationFailed && (
        <p className="mt-4 text-sm text-destructive">
          Ha ocurrido un error en la última operación
        </p>
      )}

      {filteredItems.length === 0 ? (
        <ProductsEmptyState hasProducts={(products?.length ?? 0) > 0} />
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((product) => (
            <li key={product.id}>
              <ProductCard
                product={product}
                deletePending={deleteProduct.isPending}
                onEdit={(p) => setDialog({ open: true, product: p })}
                onDelete={(id) => void handleDelete(id)}
              />
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {safePage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}

      {dialog.open && (
        <ProductFormDialog
          key={dialog.product?.id ?? "new"}
          product={dialog.product}
          onClose={() => setDialog({ open: false, product: null })}
          onSubmit={async (values) => {
            if (dialog.product?.id != null) {
              await handleUpdate(dialog.product.id, values);
            } else {
              await handleCreate(values);
            }
          }}
        />
      )}

      {tagsOpen && <TagsManagerDialog onClose={() => setTagsOpen(false)} />}
    </section>
  );
}
