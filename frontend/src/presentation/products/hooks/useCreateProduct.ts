import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateProductDto } from "@/application/products/schemas/ProductSchema";
import { createProductService } from "@/composition/container";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: CreateProductDto) => createProductService.execute(product),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
