import type { StateCreator } from "zustand";
import type { LoginResponseDto } from "@/application/auth/schemas/LoginResponseSchema";

export type SessionUser = LoginResponseDto["user"];

export interface AuthSlice {
  token: string | null;
  user: SessionUser | null;
  setSession: (session: LoginResponseDto) => void;
  clearSession: () => void;
}

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
  token: null,
  user: null,
  setSession: ({ token, user }) => set({ token, user }),
  clearSession: () => set({ token: null, user: null }),
});
