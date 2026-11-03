import { useState } from "react";
import {
  Bike,
  BookOpen,
  Camera,
  Package,
  Shirt,
  Sofa,
  Volleyball,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_BY_TAG: Record<string, LucideIcon> = {
  bicis: Bike,
  deporte: Volleyball,
  electrónica: Camera,
  hogar: Sofa,
  libros: BookOpen,
  moda: Shirt,
};

const TINTS = ["bg-tint-1", "bg-tint-2", "bg-tint-3"];

interface ProductImageProps {
  src: string | null;
  name: string;
  tags: string[];
  /** Elige el color de fondo cuando no hay foto, para que no varíe entre visitas. */
  seed: number;
  className?: string;
}

/** Foto del producto o, si no hay o no carga, un fondo de color con icono. */
export function ProductImage({ src, name, tags, seed, className }: ProductImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (src && src !== failedSrc) {
    return (
      <img
        src={src}
        alt={name}
        loading="lazy"
        onError={() => setFailedSrc(src)}
        className={cn("object-cover", className)}
      />
    );
  }

  const tagWithIcon = tags.find((tag) => tag.toLowerCase() in ICON_BY_TAG);
  const Icon = tagWithIcon ? ICON_BY_TAG[tagWithIcon.toLowerCase()] : Package;

  return (
    <div
      role="img"
      aria-label={name}
      className={cn(
        "flex items-center justify-center text-foreground/50",
        TINTS[seed % TINTS.length],
        className,
      )}
    >
      <Icon className="size-1/4 max-h-20 max-w-20" strokeWidth={1.5} aria-hidden="true" />
    </div>
  );
}
