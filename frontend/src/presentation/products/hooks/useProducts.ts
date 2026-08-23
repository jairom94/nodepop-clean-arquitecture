import { useQuery } from "@tanstack/react-query";
import { listProductsService } from "@/composition/container";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => listProductsService.execute(),
  });
}
