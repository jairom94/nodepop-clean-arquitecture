import { NavLink, Outlet } from "react-router";

const navItems = [
  { to: "/", label: "Inicio", end: true },
  { to: "/products", label: "Productos" },
  { to: "/tags", label: "Tags" },
  { to: "/login", label: "Login" },
];

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-4 px-4">
          <NavLink to="/" className="text-lg font-semibold tracking-tight">
            Nodepop
          </NavLink>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
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
