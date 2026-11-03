import type { ReactNode } from "react";
import { Link } from "react-router";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-brand px-4 py-10">
      <Link
        viewTransition
        to="/"
        className="font-heading text-4xl font-extrabold tracking-tight text-brand-foreground"
      >
        nodepop
      </Link>
      {children}
    </div>
  );
}
