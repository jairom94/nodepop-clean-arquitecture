import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTagService } from "@/composition/container";

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createTagService.execute({ name }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}
