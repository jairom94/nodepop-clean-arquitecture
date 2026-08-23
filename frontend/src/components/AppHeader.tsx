import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { Menu, X, User } from "lucide-react";
import { useIsAuthenticated, useAuthActions } from "@/store/auth/auth-selectors";
import { useLogout } from "@/presentation/auth/hooks/useLogout";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", label: "Inicio", end: true },
  { to: "/products", label: "Productos" },
];

export function AppHeader() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const { clearSession } = useAuthActions();
  const logout = useLogout();

  const items = isAuthenticated
    ? navItems
    : [...navItems, { to: "/login", label: "Login", end: false }];

  const handleLogout = async () => {
    setIsOpen(false);
    await logout.mutateAsync();
    clearSession();
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-secondary text-secondary-foreground"
        : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
    ].join(" ");

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-4 px-4">
        <NavLink to="/" className="text-lg font-semibold tracking-tight">
          Nodepop
        </NavLink>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-1 sm:flex">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Acciones desktop */}
        <div className="ml-auto hidden items-center gap-1 sm:flex">
          {isAuthenticated && (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                [
                  "inline-flex size-8 items-center justify-center rounded-md transition-colors",
                  isActive
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
                ].join(" ")
              }
              aria-label="Mi perfil"
            >
              <User className="size-4" />
            </NavLink>
          )}
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void handleLogout()}
              disabled={logout.isPending}
            >
              {logout.isPending ? "Saliendo..." : "Cerrar sesión"}
            </Button>
          )}
        </div>

        {/* Botón menú móvil */}
        <button
          type="button"
          className="ml-auto inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-secondary-foreground sm:hidden"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Panel menú móvil */}
      {isOpen && (
        <nav className="border-t sm:hidden">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 py-3">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <>
                <NavLink
                  to="/profile"
                  className={linkClass}
                  onClick={() => setIsOpen(false)}
                >
                  Mi perfil
                </NavLink>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1 justify-start"
                  onClick={() => void handleLogout()}
                  disabled={logout.isPending}
                >
                  {logout.isPending ? "Saliendo..." : "Cerrar sesión"}
                </Button>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
