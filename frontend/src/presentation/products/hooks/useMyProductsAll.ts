import { useQuery } from "@tanstack/react-query";
import { listMyProductsService } from "@/composition/container";

const PAGE_SIZE = 100;

export function useMyProductsAll() {
  return useQuery({
    queryKey: ["products", "mine", "all"],
    queryFn: async () => {
      const first = await listMyProductsService.execute({ page: 1, pageSize: PAGE_SIZE });
      const items = [...first.items];

      for (let page = 2; page <= first.totalPages; page++) {
        const next = await listMyProductsService.execute({ page, pageSize: PAGE_SIZE });
        items.push(...next.items);
      }

      return items;
    },
  });
}
