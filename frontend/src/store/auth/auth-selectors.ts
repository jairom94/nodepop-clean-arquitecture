import { useShallow } from "zustand/react/shallow";
import { useAppStore, type AppStore } from "../index";
import type { SessionUser } from "./auth-slice";

export const selectToken = (state: AppStore) => state.token;

export const selectUser = (state: AppStore): SessionUser | null => state.user;

export const selectIsAuthenticated = (state: AppStore): boolean =>
  state.token !== null;

export const useToken = (): string | null => useAppStore(selectToken);

export const useUser = (): SessionUser | null => useAppStore(selectUser);

export const useIsAuthenticated = (): boolean => useAppStore(selectIsAuthenticated);

export const useAuthActions = () =>
  useAppStore(
    useShallow((state: AppStore) => ({
      setSession: state.setSession,
      clearSession: state.clearSession,
    })),
  );
