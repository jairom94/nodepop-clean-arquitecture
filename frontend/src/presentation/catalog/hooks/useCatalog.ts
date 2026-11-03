import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { CatalogProduct } from "@/application/ports/CatalogGateway";
import { catalogGateway } from "@/composition/container";

const CATALOG_KEY = ["catalog"];

export function useCatalog() {
  return useQuery({
    queryKey: CATALOG_KEY,
    queryFn: () => catalogGateway.list(),
  });
}

export function useCatalogProduct(id: number | null) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["catalog", id],
    queryFn: () => catalogGateway.get(id as number),
    enabled: id !== null,
    // Si venimos del listado, el detalle pinta al instante: así la View
    // Transition captura la foto y no un skeleton.
    initialData: () =>
      queryClient.getQueryData<CatalogProduct[]>(CATALOG_KEY)?.find((p) => p.id === id),
  });
}
