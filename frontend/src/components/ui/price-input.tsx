import { useState, type ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const MAX_INTEGER_DIGITS = 7; // hasta 9 999 999,99 €
const MAX_DECIMALS = 2;

const displayFormat = new Intl.NumberFormat("es-ES", {
  useGrouping: false,
  maximumFractionDigits: MAX_DECIMALS,
});

/** 150 → "150"; 95.5 → "95,50" (mismo criterio que las etiquetas de precio). */
function formatPrice(value: number | null): string {
  if (value === null || Number.isNaN(value)) return "";
  if (Number.isInteger(value)) return displayFormat.format(value);
  return value.toFixed(MAX_DECIMALS).replace(".", ",");
}

/**
 * Deja solo un precio válido: dígitos y un separador decimal (coma o punto),
 * con dos decimales como máximo.
 * - Al escribir, manda el primer separador: una segunda coma se ignora.
 * - Al pegar ("1.234,56 €"), el último separador es el decimal y los demás eran de miles.
 */
function sanitize(raw: string, pasted: boolean): string {
  const cleaned = raw.replace(/[^\d.,]/g, "");
  const separator = pasted
    ? Math.max(cleaned.lastIndexOf(","), cleaned.lastIndexOf("."))
    : cleaned.search(/[.,]/);
  if (separator === -1) return cleaned.slice(0, MAX_INTEGER_DIGITS);

  const integer = cleaned.slice(0, separator).replace(/[.,]/g, "").slice(0, MAX_INTEGER_DIGITS);
  const decimals = cleaned
    .slice(separator + 1)
    .replace(/[.,]/g, "")
    .slice(0, MAX_DECIMALS);
  return `${integer || "0"},${decimals}`;
}

function parsePrice(text: string): number | null {
  if (text === "") return null;
  const value = Number(text.replace(",", "."));
  return Number.isFinite(value) ? value : null;
}

type NativeInputProps = Omit<
  ComponentProps<"input">,
  "type" | "value" | "defaultValue" | "onChange" | "inputMode"
>;

interface PriceInputProps extends NativeInputProps {
  /** null cuando está vacío. */
  value: number | null | undefined;
  /**
   * Entrega null (no undefined) si se vacía: react-hook-form interpreta undefined
   * como "volver al valor por defecto" y rellenaría el campo de nuevo.
   */
  onChange: (value: number | null) => void;
}

/**
 * Campo de precio en euros: sin flechas ni cambios con la rueda del ratón,
 * acepta coma o punto y entrega un número (o null si está vacío).
 */
export function PriceInput({
  value: rawValue,
  onChange,
  onBlur,
  className,
  ...props
}: PriceInputProps) {
  const value = rawValue ?? null;
  const [text, setText] = useState(() => formatPrice(value));
  const [syncedValue, setSyncedValue] = useState(value);

  // Si el valor cambia desde fuera (reset del formulario), se refleja en el texto.
  if (value !== syncedValue) {
    setSyncedValue(value);
    if (value !== parsePrice(text)) setText(formatPrice(value));
  }

  return (
    <div className="relative">
      <Input
        {...props}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={text}
        onChange={(e) => {
          const pasted = (e.nativeEvent as InputEvent).inputType === "insertFromPaste";
          const next = sanitize(e.target.value, pasted);
          const parsed = parsePrice(next);
          setText(next);
          setSyncedValue(parsed);
          onChange(parsed);
        }}
        onBlur={(e) => {
          // Al salir se normaliza: "95,5" → "95,50", "150,00" → "150"
          setText(formatPrice(parsePrice(text)));
          onBlur?.(e);
        }}
        className={cn("pr-9 tabular-nums", className)}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground"
      >
        €
      </span>
    </div>
  );
}
