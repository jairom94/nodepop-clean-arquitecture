import { useQuery } from "@tanstack/react-query";
import { catalogGateway } from "@/composition/container";

export function useCatalog() {
  return useQuery({
    queryKey: ["catalog"],
    queryFn: () => catalogGateway.list(),
  });
}

export function useCatalogProduct(id: number | null) {
  return useQuery({
    queryKey: ["catalog", id],
    queryFn: () => catalogGateway.get(id as number),
    enabled: id !== null,
  });
}
