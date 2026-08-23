import { useMutation } from "@tanstack/react-query";
import { logoutService } from "@/composition/container";

export function useLogout() {
  return useMutation({
    mutationFn: () => logoutService.execute(),
  });
}
