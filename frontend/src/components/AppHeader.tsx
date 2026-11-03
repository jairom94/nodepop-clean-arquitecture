import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Menu, Moon, Plus, Sun, User, X } from "lucide-react";
import { useIsAuthenticated, useUser } from "@/store/auth/auth-selectors";
import { useThemeStore } from "@/store/theme/theme-store";
import { BrandLogo } from "@/components/BrandLogo";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CatalogSearch } from "@/presentation/catalog/components/CatalogSearch";
import { UserAvatar } from "@/presentation/components/UserAvatar";

// Abre el modal de publicar: sin View Transition para que la cabecera no quede encima.
const SELL_PATH = "/my-products?new=1";

export function AppHeader() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const items = [
    { to: "/products", label: "Productos" },
    isAuthenticated
      ? { to: "/my-products", label: "Mis productos" }
      : { to: "/login", label: "Iniciar sesión" },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "inline-flex min-h-11 items-center rounded-full px-3.5 font-medium transition-colors hover:bg-secondary",
      isActive && "font-semibold text-primary",
    );

  const themeLabel = theme === "dark" ? "Usar tema claro" : "Usar tema oscuro";
  const ThemeIcon = theme === "dark" ? Sun : Moon;

  return (
    <header className="sticky top-0 z-40 border-b bg-card [view-transition-name:site-header]">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-2 gap-y-2 px-4 py-3 sm:gap-x-4 sm:px-6">
        <Link
          viewTransition
          to="/"
          className="shrink-0 rounded-lg focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <BrandLogo height={48} priority />
        </Link>

        {pathname.startsWith("/products") && (
          <CatalogSearch
            placeholder="Busca bicis, sofás, cámaras…"
            className="order-last w-full md:order-none md:w-auto md:flex-1"
          />
        )}

        <div className="ml-auto flex items-center gap-1">
          <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
            {items.map((item) => (
              <NavLink viewTransition key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Link to={SELL_PATH} className={buttonVariants({ className: "px-3.5 sm:mx-1 sm:px-5" })}>
            <Plus className="size-4" aria-hidden="true" />
            Publicar
          </Link>

          <Button variant="ghost" size="icon" aria-label={themeLabel} onClick={toggleTheme}>
            <ThemeIcon className="size-5" />
          </Button>

          {isAuthenticated && (
            <Link
              viewTransition
              to="/profile"
              aria-label="Mi perfil"
              className="hidden rounded-full md:block"
            >
              {user ? (
                <UserAvatar name={user.name} lastname={user.lastname1} />
              ) : (
                <span className="flex size-11 items-center justify-center rounded-full bg-accent">
                  <User className="size-5" aria-hidden="true" />
                </span>
              )}
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <nav aria-label="Menú móvil" className="border-t md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {items.map((item) => (
              <NavLink
                viewTransition
                key={item.to}
                to={item.to}
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <NavLink
                viewTransition
                to="/profile"
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                Mi perfil
              </NavLink>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
