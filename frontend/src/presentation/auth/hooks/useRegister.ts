import type { RegisterCredentials } from "@/application/auth/schemas/RegisterCredentialsSchema";
import { registerService } from "@/composition/container";
import { useMutation } from "@tanstack/react-query";

export function useRegister() {
  return useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      registerService.execute(credentials),
  });
}
