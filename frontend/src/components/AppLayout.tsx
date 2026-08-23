import { Outlet } from "react-router";
import { AppHeader } from "@/components/AppHeader";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

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
