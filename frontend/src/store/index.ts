import { create } from "zustand";
import type { AuthSlice } from "./auth/auth-slice";
import { createAuthSlice } from "./auth/auth-slice";
import { tokenStorage, httpClient } from "@/composition/container";
import type { SessionUser } from "./auth/auth-slice";

export type AppStore = AuthSlice;

const storedToken = tokenStorage.getToken();
const storedUserRaw = tokenStorage.getUser();
let storedUser: SessionUser | null = null;
if (storedUserRaw) {
  try {
    storedUser = JSON.parse(storedUserRaw) as SessionUser;
  } catch {
    storedUser = null;
  }
}

export const useAppStore = create<AppStore>()((...a) => ({
  ...createAuthSlice(...a),
  token: storedToken,
  user: storedUser,
}));

// Cuando el refresh token falla, el interceptor de Axios limpia los tokens
// del storage y dispara este callback para sincronizar el estado en memoria.
httpClient.setOnSessionExpired(() => {
  useAppStore.getState().clearSession();
});
