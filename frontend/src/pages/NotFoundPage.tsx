import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 py-16 text-center">
      <div className="relative">
        <h1 className="select-none text-[8rem] font-bold leading-none tracking-tighter text-muted/40 sm:text-[12rem]">
          404
        </h1>
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="rounded-full bg-destructive/10 px-4 py-1 text-sm font-medium text-destructive">
            Error
          </span>
        </span>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          Página no encontrada
        </h2>
        <p className="max-w-md text-muted-foreground">
          La página que buscas no existe o ha sido movida. Verifica la URL o
          vuelve al inicio para seguir explorando.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button render={<Link to="/" />}>
          Volver al inicio
        </Button>
        <Button variant="outline" render={<Link to="/products" />}>
          Ver productos
        </Button>
      </div>
    </section>
  );
}
