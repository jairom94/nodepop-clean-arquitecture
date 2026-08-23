import { NavLink, Outlet, useNavigate } from "react-router";
import { useIsAuthenticated, useAuthActions } from "@/store/auth/auth-selectors";
import { useLogout } from "@/presentation/auth/hooks/useLogout";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", label: "Inicio", end: true },
  { to: "/products", label: "Productos" },
  { to: "/tags", label: "Tags" },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const { clearSession } = useAuthActions();
  const logout = useLogout();

  const items = isAuthenticated
    ? navItems
    : [...navItems, { to: "/login", label: "Login", end: false }];

  const handleLogout = async () => {
    await logout.mutateAsync();
    clearSession();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-4 px-4">
          <NavLink to="/" className="text-lg font-semibold tracking-tight">
            Nodepop
          </NavLink>
          <nav className="flex items-center gap-1">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={() => void handleLogout()}
              disabled={logout.isPending}
            >
              {logout.isPending ? "Saliendo..." : "Cerrar sesión"}
            </Button>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-center px-4 py-4">
          <p className="text-sm text-muted-foreground">
            Nodepop · Plataforma de compra-venta
          </p>
        </div>
      </footer>
    </div>
  );
}
