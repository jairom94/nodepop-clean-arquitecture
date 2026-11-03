import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import type { CatalogProduct } from "@/application/ports/CatalogGateway";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/PageContainer";
import { CatalogGrid, CatalogGridSkeleton } from "@/presentation/catalog/components/CatalogGrid";
import { useCatalog } from "@/presentation/catalog/hooks/useCatalog";
import { StateMessage } from "@/presentation/components/StateMessage";
import { TagChip } from "@/presentation/components/TagChip";

const PAGE_SIZE = 8;

function CatalogResults({ products }: { products: CatalogProduct[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  return (
    <>
      <CatalogGrid products={products.slice(0, visibleCount)} className="mt-7" />
      {visibleCount < products.length && (
        <div className="mt-10 flex justify-center">
          <Button variant="outline" onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}>
            Ver más productos
          </Button>
        </div>
      )}
    </>
  );
}

export default function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const { data: products, isPending, isError, refetch } = useCatalog();

  const query = params.get("q") ?? "";
  const selectedTag = params.get("tag");

  const tagNames = useMemo(
    () => [...new Set(products?.flatMap((p) => p.tags.map((tag) => tag.name)))],
    [products],
  );

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    return (products ?? []).filter(
      (product) =>
        product.name.toLowerCase().includes(term) &&
        (!selectedTag || product.tags.some((tag) => tag.name === selectedTag)),
    );
  }, [products, query, selectedTag]);

  const selectTag = (tag: string | null) => {
    const next = new URLSearchParams(params);
    if (tag) {
      next.set("tag", tag);
    } else {
      next.delete("tag");
    }
    setParams(next, { replace: true });
  };

  return (
    <PageContainer>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <h1 className="font-display text-6xl leading-none lg:text-7xl">Productos</h1>
        <p className="text-muted-foreground">
          {products ? `${products.length} productos de ejemplo, ` : ""}del más reciente al más
          antiguo
        </p>
      </div>

      {tagNames.length > 0 && (
        <div role="group" aria-label="Filtrar por tag" className="mt-6 flex flex-wrap gap-2">
          <TagChip label="Todo" selected={!selectedTag} onClick={() => selectTag(null)} />
          {tagNames.map((tag) => (
            <TagChip
              key={tag}
              label={tag}
              selected={selectedTag === tag}
              onClick={() => selectTag(tag)}
            />
          ))}
        </div>
      )}

      {isPending && <CatalogGridSkeleton count={PAGE_SIZE} className="mt-7" />}

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

      {products && results.length === 0 && (
        <StateMessage
          title="Nada con esos filtros"
          description="Prueba a ajustar la búsqueda o los tags."
          action={
            <Button variant="outline" onClick={() => setParams({}, { replace: true })}>
              Limpiar filtros
            </Button>
          }
        />
      )}

      {results.length > 0 && <CatalogResults key={`${query}|${selectedTag}`} products={results} />}
    </PageContainer>
  );
}
