import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ProductDto } from "@/application/products/schemas/ProductSchema";
import { getProductService } from "@/composition/container";

export function useProduct(id: number | null) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["products", id],
    queryFn: () => getProductService.execute(id as number),
    enabled: id !== null,
    // Parte de lo ya cargado en "Mis productos" para que la transición de ruta
    // capture el detalle completo; la petición refresca los datos después.
    initialData: () =>
      queryClient.getQueryData<ProductDto[]>(["products", "mine", "all"])?.find((p) => p.id === id),
    initialDataUpdatedAt: 0,
  });
}
