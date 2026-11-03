import { Outlet, ScrollRestoration } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { ErrorBoundary } from "@/presentation/components/ErrorBoundary";

/** Raíz de todas las rutas: límites de error, avisos y restauración del scroll. */
function App() {
  return (
    <ErrorBoundary>
      <Outlet />
      <Toaster />
      <ScrollRestoration />
    </ErrorBoundary>
  );
}

export default App;
