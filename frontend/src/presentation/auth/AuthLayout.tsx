import type { ReactNode } from "react";
import { Link } from "react-router";
import { BrandLogo } from "@/components/BrandLogo";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-brand px-4 py-10">
      <Link
        viewTransition
        to="/"
        className="rounded-lg focus-visible:ring-3 focus-visible:ring-brand-foreground/60 focus-visible:outline-none"
      >
        <BrandLogo height={104} priority />
      </Link>
      {children}
    </div>
  );
}
