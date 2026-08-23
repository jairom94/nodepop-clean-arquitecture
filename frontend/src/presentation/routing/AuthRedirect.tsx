import { Navigate, Outlet } from "react-router";
import { useIsAuthenticated } from "@/store/auth/auth-selectors";

export function AuthRedirect() {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
