import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateProductDto } from "@/application/products/schemas/ProductSchema";
import { updateProductService } from "@/composition/container";

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, changes }: { id: number; changes: UpdateProductDto }) =>
      updateProductService.execute(id, changes),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
      void queryClient.invalidateQueries({ queryKey: ["products", variables.id] });
    },
  });
}
