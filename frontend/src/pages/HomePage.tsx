import { Link } from "react-router";
import { useCatalog } from "@/presentation/catalog/hooks/useCatalog";
import { CatalogGrid, CatalogGridSkeleton } from "@/presentation/catalog/components/CatalogGrid";
import { CatalogSearch } from "@/presentation/catalog/components/CatalogSearch";
import { PriceTag } from "@/presentation/components/PriceTag";
import { ProductImage } from "@/presentation/components/ProductImage";

const RECENT_COUNT = 4;

const steps = [
  { title: "Sube una foto", description: "Una imagen clara de lo que vendes." },
  { title: "Ponle precio y tags", description: "Los tags ayudan a que te encuentren." },
  {
    title: "Gestiónalo cuando quieras",
    description: "Edita o retira tus anuncios desde Mis productos.",
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
            <h1 className="font-heading text-5xl leading-none font-extrabold tracking-tight lg:text-7xl">
              Lo que a otros les sobra, a ti te viene bien.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Compra y vende productos de segunda mano. Publicar un anuncio es subir una foto y
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
                <PriceTag price={product.price} className="absolute bottom-3 left-3" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pt-12 sm:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight">Recién publicado</h2>
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

      <section className="mx-auto w-full max-w-6xl px-4 pt-14 pb-16 sm:px-6">
        <h2 className="font-heading text-3xl font-extrabold tracking-tight">Vende en tres pasos</h2>
        <ol className="mt-5 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-2xl bg-card p-6">
              <span className="font-heading text-4xl leading-none font-extrabold text-primary">
                {index + 1}
              </span>
              <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
