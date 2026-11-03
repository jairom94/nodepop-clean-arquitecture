import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateProductDto } from "@/application/products/schemas/ProductSchema";
import { updateProductService, uploadProductImageService } from "@/composition/container";

interface UpdateProductInput {
  id: number;
  changes: UpdateProductDto;
  file?: File | null;
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, changes, file }: UpdateProductInput) => {
      const updated = await updateProductService.execute(id, changes);
      return file ? uploadProductImageService.execute(id, file) : updated;
    },
    onSettled: () => {
      // También tras un fallo: los datos pudieron guardarse aunque la imagen no.
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
