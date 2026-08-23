import { useQuery } from "@tanstack/react-query";
import { getProductService } from "@/composition/container";

export function useProduct(id: number | null) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => getProductService.execute(id as number),
    enabled: id !== null,
  });
}
