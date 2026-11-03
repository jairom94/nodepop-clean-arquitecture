import { Navigate, Outlet, useLocation } from "react-router";
import { useIsAuthenticated } from "@/store/auth/auth-selectors";

export function AuthRedirect() {
  const isAuthenticated = useIsAuthenticated();
  const { pathname, search } = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: `${pathname}${search}` }} />;
  }

  return <Outlet />;
}
