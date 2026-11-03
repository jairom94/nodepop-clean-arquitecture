import { useState, type CSSProperties } from "react";
import { Link } from "react-router";
import { Pause, Play } from "lucide-react";
import type { CatalogProduct } from "@/application/ports/CatalogGateway";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PriceTag } from "@/presentation/components/PriceTag";
import { ProductImage } from "@/presentation/components/ProductImage";

type Direction = "up" | "down";

/** Primera y tercera bajan, la del centro sube; velocidades distintas para que no se vea mecánico. */
const COLUMNS: { direction: Direction; duration: string; className?: string }[] = [
  { direction: "down", duration: "46s" },
  { direction: "up", duration: "38s" },
  // En móvil solo caben dos columnas
  { direction: "down", duration: "52s", className: "max-sm:hidden" },
];

/** Alturas variadas como en un tablero de anuncios. */
const ASPECTS = ["aspect-[4/5]", "aspect-square", "aspect-[3/4]"];

function HeroTile({
  product,
  aspect,
  tint,
  hidden,
}: {
  product: CatalogProduct;
  aspect: string;
  /** Elige el color de fondo cuando no hay foto, según la posición en el mosaico. */
  tint: number;
  /** Copia para el bucle: invisible para lectores de pantalla y fuera del tabulador. */
  hidden: boolean;
}) {
  return (
    <li className="pb-4" aria-hidden={hidden || undefined}>
      <Link
        viewTransition
        to={`/products/${product.id}`}
        tabIndex={hidden ? -1 : undefined}
        className="relative block rounded-2xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <ProductImage
          src={product.image}
          name={product.name}
          tags={product.tags.map((tag) => tag.name)}
          seed={tint}
          // Las columnas se mueven solas: la carga diferida llegaría tarde al borde
          loading="eager"
          className={cn("w-full rounded-2xl", aspect)}
        />
        <PriceTag price={product.price} className="absolute bottom-3 left-3" />
      </Link>
    </li>
  );
}

interface HeroProductColumnsProps {
  products: CatalogProduct[] | undefined;
  className?: string;
}

/** Tres columnas de productos que se desplazan sin fin en sentidos alternos. */
export function HeroProductColumns({ products, className }: HeroProductColumnsProps) {
  const [paused, setPaused] = useState(false);

  const columns = COLUMNS.map((column, columnIndex) => ({
    ...column,
    items: (products ?? []).filter((_, index) => index % COLUMNS.length === columnIndex),
  }));

  return (
    <div className={cn("relative", className)}>
      <div
        data-paused={paused}
        className="hero-columns grid h-full grid-cols-2 gap-4 sm:grid-cols-3"
      >
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className={cn("min-w-0 overflow-hidden", column.className)}>
            {products ? (
              // La lista va dos veces: desplazar la mitad de la altura cierra el bucle sin salto.
              <ul
                className="hero-column"
                data-direction={column.direction}
                style={{ "--duration": column.duration } as CSSProperties}
              >
                {[false, true].flatMap((hidden) =>
                  column.items.map((product, index) => (
                    <HeroTile
                      key={`${hidden ? "copia" : "original"}-${product.id}`}
                      product={product}
                      aspect={ASPECTS[(index + columnIndex) % ASPECTS.length]}
                      // Desplazado por columna para que las vecinas no coincidan en color
                      tint={index + columnIndex}
                      hidden={hidden}
                    />
                  )),
                )}
              </ul>
            ) : (
              <div className="flex flex-col gap-4">
                <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                <Skeleton className="aspect-square w-full rounded-2xl" />
              </div>
            )}
          </div>
        ))}
      </div>

      {products && (
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
          aria-label={paused ? "Reanudar animación de productos" : "Pausar animación de productos"}
          className="hero-columns-toggle absolute right-3 bottom-3 flex size-11 items-center justify-center rounded-full bg-card/90 text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-card focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {paused ? <Play className="size-4.5" /> : <Pause className="size-4.5" />}
        </button>
      )}
    </div>
  );
}
