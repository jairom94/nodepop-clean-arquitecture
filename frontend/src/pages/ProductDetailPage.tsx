import { Link, useParams } from "react-router";
import { useProduct } from "@/presentation/products/hooks/useProduct";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const eur = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = id ? Number(id) : null;
  const validId = productId !== null && Number.isInteger(productId) && productId > 0;

  const { data: product, isPending, isError, refetch } = useProduct(validId ? productId : null);

  if (!validId) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-destructive">Identificador de producto no válido</p>
        <Button variant="outline" render={<Link to="/products" />}>
          ← Volver a productos
        </Button>
      </div>
    );
  }

  if (isPending) {
    return <p className="text-muted-foreground">Cargando producto...</p>;
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-destructive">No se pudo cargar el producto</p>
        <Button variant="outline" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" render={<Link to="/products" />} className="mb-4">
        ← Volver a productos
      </Button>

      <Card>
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="aspect-video w-full rounded-t-lg object-cover"
          />
        )}
        <CardHeader>
          <CardTitle className="text-3xl">{product.name}</CardTitle>
          <CardDescription className="text-2xl font-semibold text-foreground">
            {eur.format(product.price)}
          </CardDescription>
        </CardHeader>

        {product.tags.length > 0 && (
          <CardContent className="flex flex-wrap gap-1">
            {product.tags.map((tag) => (
              <span
                key={tag.id ?? tag.name}
                className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
              >
                {tag.name}
              </span>
            ))}
          </CardContent>
        )}

        <CardContent className="text-sm text-muted-foreground">
          Publicado por el usuario #{product.ownerId}
        </CardContent>
      </Card>
    </section>
  );
}
