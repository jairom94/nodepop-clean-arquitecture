import { Link } from "react-router";
import type { CatalogProduct } from "@/application/ports/CatalogGateway";
import { Skeleton } from "@/components/ui/skeleton";
import { PriceTag } from "@/presentation/components/PriceTag";
import { ProductImage } from "@/presentation/components/ProductImage";
import { cn } from "@/lib/utils";

const GRID_CLASS = "grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(14rem,1fr))]";

function CatalogCard({ product }: { product: CatalogProduct }) {
  const tags = product.tags.map((tag) => tag.name);

  return (
    <Link to={`/products/${product.id}`} className="group block rounded-2xl">
      <div className="relative">
        <ProductImage
          src={product.image}
          name={product.name}
          tags={tags}
          seed={product.id}
          className="aspect-4/3 w-full rounded-2xl transition-opacity group-hover:opacity-85"
        />
        <PriceTag price={product.price} className="absolute bottom-3 left-3" />
      </div>
      <h3 className="mt-3 font-semibold group-hover:underline">{product.name}</h3>
      <p className="text-sm text-muted-foreground">{tags.join(" · ")}</p>
    </Link>
  );
}

interface CatalogGridProps {
  products: CatalogProduct[];
  className?: string;
}

export function CatalogGrid({ products, className }: CatalogGridProps) {
  return (
    <ul className={cn(GRID_CLASS, className)}>
      {products.map((product) => (
        <li key={product.id}>
          <CatalogCard product={product} />
        </li>
      ))}
    </ul>
  );
}

interface CatalogGridSkeletonProps {
  count: number;
  className?: string;
}

export function CatalogGridSkeleton({ count, className }: CatalogGridSkeletonProps) {
  return (
    <ul aria-busy="true" aria-label="Cargando productos" className={cn(GRID_CLASS, className)}>
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <Skeleton className="aspect-4/3 w-full rounded-2xl" />
          <Skeleton className="mt-3 h-4 w-2/3" />
          <Skeleton className="mt-2 h-3.5 w-1/3" />
        </li>
      ))}
    </ul>
  );
}
