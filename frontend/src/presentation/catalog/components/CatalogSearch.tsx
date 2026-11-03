import { useState, type FormEvent } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CatalogSearchProps {
  placeholder: string;
  /** Muestra un botón "Buscar" junto al campo y aumenta su tamaño. */
  large?: boolean;
  className?: string;
}

export function CatalogSearch({ placeholder, large = false, className }: CatalogSearchProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();

  const urlQuery = params.get("q") ?? "";
  const [value, setValue] = useState(urlQuery);
  const [syncedQuery, setSyncedQuery] = useState(urlQuery);

  // Refleja cambios externos de la URL (limpiar filtros, volver atrás...).
  if (urlQuery !== syncedQuery) {
    setSyncedQuery(urlQuery);
    setValue(urlQuery);
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(pathname === "/products" ? params : undefined);
    const query = value.trim();
    if (query) {
      next.set("q", query);
    } else {
      next.delete("q");
    }
    const search = next.toString();
    navigate(search ? `/products?${search}` : "/products");
  };

  return (
    <form role="search" onSubmit={handleSubmit} className={cn("flex gap-2", className)}>
      <label
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2.5 rounded-full bg-secondary px-4 has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
          large ? "h-13" : "h-11",
        )}
      >
        <Search className="size-4.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Buscar productos</span>
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full min-w-0 bg-transparent outline-none placeholder:text-muted-foreground"
        />
      </label>
      {large && (
        <Button type="submit" size="lg" className="h-13">
          Buscar
        </Button>
      )}
    </form>
  );
}
