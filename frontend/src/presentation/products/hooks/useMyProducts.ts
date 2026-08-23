import { useQuery } from "@tanstack/react-query";
import type { ListMyProductsParams } from "@/application/products/ListMyProductsService";
import { listMyProductsService } from "@/composition/container";

export function useMyProducts({ page = 1, pageSize = 10 }: ListMyProductsParams = {}) {
  return useQuery({
    queryKey: ["products", "mine", page, pageSize],
    queryFn: () => listMyProductsService.execute({ page, pageSize }),
  });
}
