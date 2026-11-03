import { Outlet } from "react-router";
import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="flex-1">
        <Outlet />
      </main>

      <AppFooter />
    </div>
  );
}
