import { useQuery } from "@tanstack/react-query";
import { listTagsService } from "@/composition/container";

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => listTagsService.execute(),
  });
}
