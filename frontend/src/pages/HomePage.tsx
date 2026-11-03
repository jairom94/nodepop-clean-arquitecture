import type { CSSProperties } from "react";
import { Link } from "react-router";
import { useCatalog } from "@/presentation/catalog/hooks/useCatalog";
import { CatalogGrid, CatalogGridSkeleton } from "@/presentation/catalog/components/CatalogGrid";
import { CatalogSearch } from "@/presentation/catalog/components/CatalogSearch";
import { PriceTag } from "@/presentation/components/PriceTag";
import { ProductImage } from "@/presentation/components/ProductImage";

const RECENT_COUNT = 4;

/** Cada pegatina con su giro y su turno al pegarse (propiedades CSS propias). */
const STICKERS = [
  { "--sticker-rotate": "-4deg", "--sticker-delay": "250ms" },
  { "--sticker-rotate": "3deg", "--sticker-delay": "400ms" },
  { "--sticker-rotate": "-2deg", "--sticker-delay": "550ms" },
] as unknown as CSSProperties[];

const steps = [
  { title: "Sube una foto", description: "Una imagen clara de lo que vendes." },
  { title: "Ponle precio y tags", description: "Los tags ayudan a que te encuentren." },
  {
    title: "Gestiónalo cuando quieras",
    description: "Edita o elimina tus productos desde Mis productos.",
  },
];

export default function HomePage() {
  const { data: products } = useCatalog();
  const featured = products?.slice(0, 3) ?? [];

  return (
    <>
      <section className="border-b bg-card">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:py-18">
          <div>
            <h1 className="font-display text-6xl leading-[0.92] lg:text-[5.5rem] text-retro">
              Lo que a otros les sobra, a ti te viene bien.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Compra y vende productos de segunda mano. Publicar un producto es subir una foto y
              ponerle precio.
            </p>
            <CatalogSearch placeholder="¿Qué buscas?" large className="mt-7" />
          </div>

          <div aria-hidden="true" className="grid min-h-80 grid-cols-2 gap-4">
            {featured.map((product, index) => (
              <div key={product.id} className={index === 0 ? "relative row-span-2" : "relative"}>
                <ProductImage
                  src={product.image}
                  name=""
                  tags={product.tags.map((tag) => tag.name)}
                  seed={product.id}
                  className="size-full min-h-36 rounded-2xl"
                />
                <PriceTag
                  price={product.price}
                  className="price-sticker absolute bottom-3 left-3 text-2xl"
                  style={STICKERS[index]}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pt-12 sm:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2 className="font-heading text-4xl font-extrabold tracking-tight">Recién publicado</h2>
          <Link
            viewTransition
            to="/products"
            className="inline-flex min-h-11 items-center font-semibold text-primary hover:underline"
          >
            Ver todos los productos
          </Link>
        </div>
        {products ? (
          <CatalogGrid products={products.slice(0, RECENT_COUNT)} className="mt-4" />
        ) : (
          <CatalogGridSkeleton count={RECENT_COUNT} className="mt-4" />
        )}
      </section>

      <section
        id="como-funciona"
        className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 pt-14 pb-16 sm:px-6"
      >
        <h2 className="font-heading text-4xl font-extrabold tracking-tight">Vende en tres pasos</h2>
        <ol className="mt-6 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="border-t-2 border-foreground pt-4">
              <span className="font-display text-5xl leading-none text-primary">{index + 1}</span>
              <h3 className="mt-3 text-[1.3125rem] font-semibold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
