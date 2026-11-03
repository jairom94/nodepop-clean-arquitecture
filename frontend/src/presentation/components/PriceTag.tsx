import type { CSSProperties } from "react";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface PriceTagProps {
  price: number;
  /** Posición, tamaño de texto (el resto escala con él) o giro de la etiqueta. */
  className?: string;
  style?: CSSProperties;
}

/** Precio con la forma de la etiqueta del logo: esquinas recortadas, agujero y contorno café. */
export function PriceTag({ price, className, style }: PriceTagProps) {
  return (
    <span style={style} className={cn("price-tag text-xl", className)}>
      <span className="price-tag-body font-heading font-extrabold">{formatPrice(price)}</span>
    </span>
  );
}
