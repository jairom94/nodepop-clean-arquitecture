import { create } from "zustand";
import type { AuthSlice } from "./auth/auth-slice";
import { createAuthSlice } from "./auth/auth-slice";
import { tokenStorage } from "@/composition/container";

export type AppStore = AuthSlice;

const storedToken = tokenStorage.getToken();

export const useAppStore = create<AppStore>()((...a) => ({
  ...createAuthSlice(...a),
  token: storedToken,
}));
