import type { LoginCredentials } from "@/application/auth/schemas/LoginCredentialsSchema";
import { loginService } from "@/composition/container";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginService.execute(credentials),
  });
}
