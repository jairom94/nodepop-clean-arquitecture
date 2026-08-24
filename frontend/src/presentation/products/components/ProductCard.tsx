import { Link } from "react-router";
import type { ProductDto } from "@/application/products/schemas/ProductSchema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toThumbnailUrl } from "@/lib/image";

const eur = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

interface ProductCardProps {
  product: ProductDto;
  deletePending?: boolean;
  onEdit: (product: ProductDto) => void;
  onDelete: (id: number) => void;
}

export function ProductCard({
  product,
  deletePending = false,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const thumb = toThumbnailUrl(product.image);

  return (
    <Card className="flex h-full flex-col">
      {thumb && (
        <Link to={`/products/${product.id}`}>
          <img
            src={thumb}
            alt={product.name}
            className="aspect-video w-full rounded-t-lg object-cover"
          />
        </Link>
      )}
      <CardHeader>
        <CardTitle className="line-clamp-2">
          <Link to={`/products/${product.id}`} className="hover:underline">
            {product.name}
          </Link>
        </CardTitle>
        <CardDescription>{eur.format(product.price)}</CardDescription>
      </CardHeader>

      {product.tags.length > 0 && (
        <CardContent className="flex flex-wrap gap-1 pb-0">
          {product.tags.map((tag) => (
            <span
              key={tag.id ?? tag.name}
              className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
            >
              {tag.name}
            </span>
          ))}
        </CardContent>
      )}

      <CardContent className="mt-auto flex gap-2 pt-4">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onEdit(product)}
        >
          Editar
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex-1"
          disabled={deletePending}
          onClick={() => onDelete(product.id as number)}
        >
          Eliminar
        </Button>
      </CardContent>
    </Card>
  );
}
