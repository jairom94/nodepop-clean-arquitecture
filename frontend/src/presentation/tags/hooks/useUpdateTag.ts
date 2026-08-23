import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTagService } from "@/composition/container";

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      updateTagService.execute(id, name),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tags"] });
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
