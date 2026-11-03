import type { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { PriceTag } from "@/presentation/components/PriceTag";
import { ProductImage } from "@/presentation/components/ProductImage";
import { UserAvatar } from "@/presentation/components/UserAvatar";

interface ProductDetailViewProps {
  id: number;
  name: string;
  price: number;
  image: string | null;
  tags: string[];
  sellerName: string;
  backTo: string;
  backLabel: string;
  /** Acciones disponibles para quien ve el anuncio. */
  children: ReactNode;
}

export function ProductDetailView({
  id,
  name,
  price,
  image,
  tags,
  sellerName,
  backTo,
  backLabel,
  children,
}: ProductDetailViewProps) {
  const [firstName = "", lastName = ""] = sellerName.split(" ");

  return (
    <section>
      <Link
        to={backTo}
        className="inline-flex min-h-11 items-center gap-1.5 font-medium text-primary hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {backLabel}
      </Link>

      <div className="mt-2 flex flex-wrap items-start gap-8">
        <ProductImage
          src={image}
          name={name}
          tags={tags}
          seed={id}
          className="aspect-4/3 min-w-0 flex-[3_1_24rem] rounded-3xl"
        />

        <div className="flex min-w-0 flex-[2_1_18rem] flex-col gap-5">
          <div>
            <h1 className="font-heading text-4xl leading-tight font-extrabold tracking-tight lg:text-5xl">
              {name}
            </h1>
            <PriceTag price={price} className="mt-4 rounded-xl px-4 py-1 text-3xl" />
          </div>

          {tags.length > 0 && (
            <ul aria-label="Tags" className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li key={tag}>
                  <Link
                    to={`/products?tag=${encodeURIComponent(tag)}`}
                    className="inline-flex h-9 items-center rounded-full border border-input bg-card px-3.5 text-sm font-medium hover:bg-muted"
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center gap-3 border-y py-4">
            <UserAvatar name={firstName} lastname={lastName} />
            <p>
              <span className="block text-sm text-muted-foreground">Publicado por</span>
              <span className="font-semibold">{sellerName}</span>
            </p>
          </div>

          {children}
        </div>
      </div>
    </section>
  );
}
