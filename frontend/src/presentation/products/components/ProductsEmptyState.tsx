import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductsEmptyStateProps {
  /** true si el usuario tiene productos pero los filtros no devuelven resultados */
  hasProducts: boolean;
}

export function ProductsEmptyState({ hasProducts }: ProductsEmptyStateProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>No hay productos que mostrar</CardTitle>
        <CardDescription>
          {hasProducts
            ? "Prueba a ajustar los filtros de búsqueda"
            : "Publica tu primer producto para empezar a vender"}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
