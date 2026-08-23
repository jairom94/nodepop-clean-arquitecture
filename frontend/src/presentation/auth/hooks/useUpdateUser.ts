import type { UpdateUserDto } from "@/application/auth/schemas/UpdateUserSchema";
import { updateUserService } from "@/composition/container";
import { useMutation } from "@tanstack/react-query";

export function useUpdateUser() {
  return useMutation({
    mutationFn: ({ id, changes }: { id: number; changes: UpdateUserDto }) =>
      updateUserService.execute(id, changes),
  });
}
