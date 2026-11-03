import type { CSSProperties } from "react";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface PriceTagProps {
  price: number;
  className?: string;
  style?: CSSProperties;
}

export function PriceTag({ price, className, style }: PriceTagProps) {
  return (
    <span
      style={style}
      className={cn(
        "inline-block rounded-[10px] bg-price px-3 py-0.5 font-heading text-xl font-extrabold text-price-foreground",
        className,
      )}
    >
      {formatPrice(price)}
    </span>
  );
}
