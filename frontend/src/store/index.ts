import { create } from "zustand";
import type { AuthSlice } from "./auth/auth-slice";
import { createAuthSlice } from "./auth/auth-slice";

export type AppStore = AuthSlice;

export const useAppStore = create<AppStore>()((...a) => ({
  ...createAuthSlice(...a),
}));
