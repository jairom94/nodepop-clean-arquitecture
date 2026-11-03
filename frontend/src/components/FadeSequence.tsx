import {
  Children,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type FadeStyle = CSSProperties & { "--fade-index"?: number };

interface FadeWordsProps {
  text: string;
  /** Etiqueta que se renderiza (h1, p...). */
  as?: ElementType;
  className?: string;
  /** Lo asigna FadeSequence para continuar la secuencia; fuera de ella empieza en 0. */
  startIndex?: number;
}

/** Texto que aparece palabra a palabra. Se lee igual que el texto normal. */
export function FadeWords({ text, as: Tag = "span", className, startIndex = 0 }: FadeWordsProps) {
  const words = text.split(" ");

  return (
    <Tag className={className}>
      {words.map((word, index) => (
        <span key={index}>
          <span
            className="fade-item inline-block"
            style={{ "--fade-index": startIndex + index } as FadeStyle}
          >
            {word}
          </span>
          {index < words.length - 1 && " "}
        </span>
      ))}
    </Tag>
  );
}

interface FadeSequenceProps {
  children: ReactNode;
  /** Milisegundos entre un elemento (o palabra) y el siguiente. */
  step?: number;
  /** Espera antes del primero, en milisegundos. */
  delay?: number;
  as?: ElementType;
  className?: string;
}

/**
 * Hace aparecer sus hijos directos uno tras otro, con un fundido suave hacia arriba.
 * Un hijo FadeWords cuenta cada palabra como un paso de la secuencia.
 * Los hijos deben ser elementos que acepten className y style.
 */
export function FadeSequence({
  children,
  step = 80,
  delay = 0,
  as: Tag = "div",
  className,
}: FadeSequenceProps) {
  let index = 0;

  const items = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;

    if (child.type === FadeWords) {
      const words = child as ReactElement<FadeWordsProps>;
      const startIndex = index;
      index += words.props.text.split(" ").length;
      return cloneElement(words, { startIndex });
    }

    const element = child as ReactElement<{ className?: string; style?: CSSProperties }>;
    const style: FadeStyle = { ...element.props.style, "--fade-index": index++ };
    return cloneElement(element, {
      className: cn(element.props.className, "fade-item"),
      style,
    });
  });

  return (
    <Tag
      className={className}
      style={{ "--fade-step": `${step}ms`, "--fade-delay": `${delay}ms` } as CSSProperties}
    >
      {items}
    </Tag>
  );
}
