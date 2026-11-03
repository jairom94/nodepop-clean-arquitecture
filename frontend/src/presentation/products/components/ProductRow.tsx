import { Link, useViewTransitionState } from "react-router";
import { Pencil, Trash2 } from "lucide-react";
import type { ProductDto } from "@/application/products/schemas/ProductSchema";
import { Button } from "@/components/ui/button";
import { toThumbnailUrl } from "@/lib/image";
import { cn } from "@/lib/utils";
import { PriceTag } from "@/presentation/components/PriceTag";
import { ProductImage } from "@/presentation/components/ProductImage";

interface ProductRowProps {
  product: ProductDto;
  onEdit: (product: ProductDto) => void;
  onDelete: (product: ProductDto) => void;
}

export function ProductRow({ product, onEdit, onDelete }: ProductRowProps) {
  const tags = product.tags.map((tag) => tag.name);
  const detailPath = `/my-products/${product.id}`;
  const isTransitioning = useViewTransitionState(detailPath);

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b px-4 py-3 last:border-b-0">
      <ProductImage
        src={toThumbnailUrl(product.image)}
        name={product.name}
        tags={tags}
        seed={product.id ?? 0}
        className={cn(
          "h-16.5 w-22 shrink-0 rounded-xl",
          isTransitioning && "[view-transition-name:product-image]",
        )}
      />
      <div className="min-w-0 flex-[1_1_12rem]">
        <h2 className="truncate font-semibold">
          <Link viewTransition to={detailPath} className="hover:underline">
            {product.name}
          </Link>
        </h2>
        <p className="truncate text-sm text-muted-foreground">{tags.join(", ")}</p>
      </div>
      <PriceTag price={product.price} className="text-lg" />
      <div className="flex gap-1">
        <Button
          variant="secondary"
          size="icon"
          aria-label={`Editar ${product.name}`}
          onClick={() => onEdit(product)}
        >
          <Pencil />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="text-destructive"
          aria-label={`Eliminar ${product.name}`}
          onClick={() => onDelete(product)}
        >
          <Trash2 />
        </Button>
      </div>
    </li>
  );
}
