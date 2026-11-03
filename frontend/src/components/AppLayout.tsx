import { Outlet } from "react-router";
import { AppHeader } from "@/components/AppHeader";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t bg-card">
        <p className="mx-auto w-full max-w-6xl px-4 py-5 text-sm text-muted-foreground sm:px-6">
          nodepop · Proyecto de portfolio: compra y venta de segunda mano con productos de ejemplo
        </p>
      </footer>
    </div>
  );
}
