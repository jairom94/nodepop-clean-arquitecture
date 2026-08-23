import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProductService } from "@/composition/container";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProductService.execute(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
