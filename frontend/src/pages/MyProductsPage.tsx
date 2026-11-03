import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import {
  EMPTY_PRODUCTS_FILTER,
  ProductsFilter,
  type ProductsFilterValues,
} from "@/presentation/products/components/ProductsFilter";
import { useMyProductsAll } from "@/presentation/products/hooks/useMyProductsAll";
import { useCreateProduct } from "@/presentation/products/hooks/useCreateProduct";
import { useUpdateProduct } from "@/presentation/products/hooks/useUpdateProduct";
import { useDeleteProduct } from "@/presentation/products/hooks/useDeleteProduct";
import {
  ProductFormDialog,
  type ProductFormResult,
} from "@/presentation/products/components/ProductFormDialog";
import { ProductRow } from "@/presentation/products/components/ProductRow";
import { TagsManagerDialog } from "@/presentation/tags/components/TagsManagerDialog";
import { ConfirmDialog } from "@/presentation/components/ConfirmDialog";
import { StateMessage } from "@/presentation/components/StateMessage";
import type { ProductDto } from "@/application/products/schemas/ProductSchema";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/PageContainer";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE = 10;

function parseOptionalNumber(value: string): number | null {
  if (value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export default function MyProductsPage() {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState<ProductsFilterValues>(EMPTY_PRODUCTS_FILTER);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<ProductDto | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<ProductDto | null>(null);
  const [tagsOpen, setTagsOpen] = useState(false);

  const { data: products, isPending, isError, refetch } = useMyProductsAll();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  // "Publicar" enlaza aquí con ?new=1 desde cualquier página.
  const showCreate = creating || params.has("new");

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

  const priceBounds = useMemo(() => {
    if (!products?.length) return null;
    const prices = products.map((product) => product.price);
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [products]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filteredItems.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const closeCreate = () => {
    setCreating(false);
    if (params.has("new")) setParams({}, { replace: true });
  };

  const handleCreate = async (values: ProductFormResult) => {
    await createProduct.mutateAsync(values);
    toast("Producto publicado");
  };

  const handleUpdate = async (id: number, { file, ...changes }: ProductFormResult) => {
    await updateProduct.mutateAsync({ id, changes, file });
    toast("Cambios guardados");
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast("Producto eliminado");
    } catch {
      toast.error("No se pudo eliminar el producto");
    } finally {
      setDeleting(null);
    }
  };

  const handleFiltersChange = (next: ProductsFilterValues) => {
    setFilters(next);
    setPage(1);
  };

  const hasProducts = (products?.length ?? 0) > 0;

  return (
    <PageContainer>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl leading-none text-retro">Mis productos</h1>
          {products && (
            <p className="text-muted-foreground">
              {filteredItems.length} de {products.length} productos
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setTagsOpen(true)}>
            Gestionar tags
          </Button>
          <Button onClick={() => setCreating(true)}>Publicar producto</Button>
        </div>
      </div>

      <ProductsFilter values={filters} onChange={handleFiltersChange} priceBounds={priceBounds} />

      {isPending && (
        <div aria-busy="true" aria-label="Cargando productos" className="mt-4 flex flex-col gap-3">
          <Skeleton className="h-22 w-full rounded-2xl" />
          <Skeleton className="h-22 w-full rounded-2xl" />
          <Skeleton className="h-22 w-full rounded-2xl" />
        </div>
      )}

      {isError && (
        <StateMessage
          alert
          title="No se pudieron cargar"
          description="Comprueba tu conexión e inténtalo otra vez."
          action={
            <Button variant="outline" onClick={() => void refetch()}>
              Reintentar
            </Button>
          }
        />
      )}

      {products && filteredItems.length === 0 && (
        <StateMessage
          title={hasProducts ? "Nada con esos filtros" : "Aún no vendes nada"}
          description={
            hasProducts
              ? "Prueba a ajustar la búsqueda o los tags."
              : "Publica tu primer producto para empezar."
          }
          action={
            hasProducts ? (
              <Button variant="outline" onClick={() => handleFiltersChange(EMPTY_PRODUCTS_FILTER)}>
                Limpiar filtros
              </Button>
            ) : (
              <Button onClick={() => setCreating(true)}>Publicar producto</Button>
            )
          }
        />
      )}

      {pageItems.length > 0 && (
        <ul className="mt-4 overflow-hidden rounded-2xl bg-card">
          {pageItems.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onEdit={setEditing}
              onDelete={setDeleting}
            />
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <nav aria-label="Paginación" className="mt-6 flex items-center justify-center gap-4">
          <Button variant="outline" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>
            Anterior
          </Button>
          <span className="text-muted-foreground">
            Página {safePage} de {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={safePage >= totalPages}
            onClick={() => setPage(safePage + 1)}
          >
            Siguiente
          </Button>
        </nav>
      )}

      {showCreate && (
        <ProductFormDialog key="new" product={null} onClose={closeCreate} onSubmit={handleCreate} />
      )}

      {editing && (
        <ProductFormDialog
          key={editing.id}
          product={editing}
          onClose={() => setEditing(null)}
          onSubmit={(values) => handleUpdate(editing.id as number, values)}
        />
      )}

      {deleting && (
        <ConfirmDialog
          open
          title="¿Eliminar este producto?"
          description={`«${deleting.name}» dejará de estar publicado. No se puede deshacer.`}
          confirmLabel="Eliminar"
          pending={deleteProduct.isPending}
          onConfirm={() => void handleDelete(deleting.id as number)}
          onCancel={() => setDeleting(null)}
        />
      )}

      {tagsOpen && <TagsManagerDialog onClose={() => setTagsOpen(false)} />}
    </PageContainer>
  );
}
