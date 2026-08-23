import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateProductInput } from "@/application/products/CreateProductService";
import { createProductService } from "@/composition/container";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: CreateProductInput) => createProductService.execute(product),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
