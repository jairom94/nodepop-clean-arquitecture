import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface PriceTagProps {
  price: number;
  className?: string;
}

export function PriceTag({ price, className }: PriceTagProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-[10px] bg-price px-3 py-0.5 font-heading text-xl font-extrabold text-price-foreground",
        className,
      )}
    >
      {formatPrice(price)}
    </span>
  );
}
