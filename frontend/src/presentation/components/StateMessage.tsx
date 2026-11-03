import type { ReactNode } from "react";

interface StateMessageProps {
  title: string;
  description: string;
  /** Botón o enlace para salir de este estado. */
  action?: ReactNode;
  alert?: boolean;
}

/** Bloque para estados vacíos, sin resultados o de error. */
export function StateMessage({ title, description, action, alert = false }: StateMessageProps) {
  return (
    <div
      role={alert ? "alert" : undefined}
      className="mt-6 flex flex-col items-center gap-2 rounded-3xl bg-card px-6 py-10 text-center"
    >
      <h2 className="font-heading text-2xl leading-tight font-extrabold">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
