import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTagService } from "@/composition/container";

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTagService.execute(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tags"] });
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
