import { Link } from "react-router";
import { buttonVariants } from "@/components/ui/button";
import { PageContainer } from "@/components/PageContainer";

export default function NotFoundPage() {
  return (
    <PageContainer>
      <section className="flex flex-col items-center rounded-3xl bg-card px-6 py-14 text-center">
        <p className="rounded-2xl bg-price px-6 py-2 font-display text-7xl leading-none text-price-foreground sm:text-8xl">
          404
        </p>
        <h1 className="mt-5 font-heading text-3xl leading-tight font-extrabold tracking-tight">
          Esta página ya no está aquí
        </h1>
        <p className="mt-1 mb-5 text-muted-foreground">
          Puede que se haya movido o que la dirección no sea correcta.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link viewTransition to="/products" className={buttonVariants()}>
            Ver productos
          </Link>
          <Link viewTransition to="/" className={buttonVariants({ variant: "outline" })}>
            Volver al inicio
          </Link>
        </div>
      </section>
    </PageContainer>
  );
}
