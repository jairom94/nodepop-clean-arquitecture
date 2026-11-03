import type { FormEvent, ReactNode } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const REPOSITORY_URL = "https://github.com/jairom94/nodepop-clean-arquitecture";

const LINK_CLASS =
  "inline-flex min-h-9 items-center text-brand-foreground/80 underline-offset-4 transition-colors hover:text-brand-foreground hover:underline";

function showDemoNotice() {
  toast("Sección de demostración: no está disponible en este portfolio");
}

type FooterItem =
  | { label: string; to: string }
  /** Sin destino real: avisa de que es una demo en lugar de llevar a una página vacía. */
  | { label: string; demo: true };

const columns: { title: string; items: FooterItem[] }[] = [
  {
    title: "Explorar",
    items: [
      { label: "Todos los productos", to: "/products" },
      { label: "Bicis", to: "/products?tag=Bicis" },
      { label: "Hogar", to: "/products?tag=Hogar" },
      { label: "Electrónica", to: "/products?tag=Electrónica" },
      { label: "Moda", to: "/products?tag=Moda" },
    ],
  },
  {
    title: "Tu cuenta",
    items: [
      { label: "Publicar producto", to: "/my-products?new=1" },
      { label: "Mis productos", to: "/my-products" },
      { label: "Mi perfil", to: "/profile" },
      { label: "Crear cuenta", to: "/register" },
    ],
  },
  {
    title: "Ayuda",
    items: [
      { label: "Cómo funciona", to: "/#como-funciona" },
      { label: "Preguntas frecuentes", demo: true },
      { label: "Consejos de seguridad", demo: true },
      { label: "Contacto", demo: true },
    ],
  },
];

const legalItems = ["Privacidad", "Términos de uso", "Cookies"];

function FooterLink({ item }: { item: FooterItem }) {
  if ("demo" in item) {
    return (
      <button
        type="button"
        onClick={showDemoNotice}
        className={cn(LINK_CLASS, "cursor-pointer text-left")}
      >
        {item.label}
      </button>
    );
  }
  return (
    <Link viewTransition to={item.to} className={LINK_CLASS}>
      {item.label}
    </Link>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <nav aria-label={title}>
      <h2 className="mb-2 font-heading text-lg font-extrabold">{title}</h2>
      <ul className="flex flex-col">{children}</ul>
    </nav>
  );
}

export function AppFooter() {
  const year = new Date().getFullYear();

  const handleSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.currentTarget.reset();
    toast("Es una demo: no se ha guardado ningún email");
  };

  return (
    <footer className="bg-brand text-brand-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Llamada a la acción */}
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-b border-brand-foreground/20 py-10">
          <p className="max-w-xl font-display text-4xl leading-none sm:text-5xl">
            ¿Tienes algo que ya no usas? Ponle precio y publícalo.
          </p>
          <Link
            viewTransition
            to="/my-products?new=1"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-price px-6 font-semibold text-price-foreground transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-brand-foreground/60 focus-visible:outline-none"
          >
            Publicar producto
          </Link>
        </div>

        {/* Marca, enlaces y newsletter */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-10 sm:grid-cols-3 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="col-span-2 flex min-w-0 flex-col gap-4 sm:col-span-3 lg:col-span-1">
            <Link
              viewTransition
              to="/"
              className="self-start font-heading text-3xl font-extrabold tracking-tight"
            >
              nodepop
            </Link>
            <p className="max-w-xs text-brand-foreground/80">
              Compra y vende productos de segunda mano cerca de ti.
            </p>
            <form onSubmit={handleSubscribe} className="mt-2 flex max-w-sm flex-col gap-2">
              <label htmlFor="newsletter-email" className="text-sm font-semibold">
                Recibe novedades cada semana
              </label>
              <div className="flex gap-2">
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="tu@email.com"
                  className="h-11 min-w-0 flex-1 rounded-full bg-brand-foreground px-4 text-price-foreground outline-none placeholder:text-price-foreground/60 focus-visible:ring-3 focus-visible:ring-price"
                />
                <button
                  type="submit"
                  className="h-11 shrink-0 cursor-pointer rounded-full border border-brand-foreground/40 px-4 font-semibold transition-colors hover:bg-brand-foreground/10 focus-visible:ring-3 focus-visible:ring-brand-foreground/60 focus-visible:outline-none"
                >
                  Suscribirme
                </button>
              </div>
            </form>
          </div>

          {columns.map((column) => (
            <FooterColumn key={column.title} title={column.title}>
              {column.items.map((item) => (
                <li key={item.label}>
                  <FooterLink item={item} />
                </li>
              ))}
            </FooterColumn>
          ))}
        </div>

        {/* Pie legal */}
        <div className="flex flex-col gap-4 border-t border-brand-foreground/20 py-6 text-sm text-brand-foreground/80 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <p>© {year} nodepop. Proyecto de portfolio con productos de ejemplo.</p>
            <p>Construido con React, TanStack Query, Tailwind CSS y Base UI.</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {legalItems.map((label) => (
              <FooterLink key={label} item={{ label, demo: true }} />
            ))}
            <a
              href={REPOSITORY_URL}
              target="_blank"
              rel="noreferrer"
              className={cn(LINK_CLASS, "gap-2 font-semibold text-brand-foreground")}
            >
              <GithubIcon className="size-4.5" />
              Código en GitHub
              <span className="sr-only">(se abre en una pestaña nueva)</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
