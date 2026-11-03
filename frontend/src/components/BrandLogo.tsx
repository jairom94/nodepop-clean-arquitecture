import logo128 from "@/assets/brand/nodepop-logo-128.webp";
import logo256 from "@/assets/brand/nodepop-logo-256.webp";
import logo384 from "@/assets/brand/nodepop-logo-384.webp";
import logo512 from "@/assets/brand/nodepop-logo-512.webp";
import logo768 from "@/assets/brand/nodepop-logo-768.webp";
import { cn } from "@/lib/utils";

// Generadas con `pnpm logo` a partir de src/assets/nodepop-logo.png
const SRC_SET = [
  `${logo128} 128w`,
  `${logo256} 256w`,
  `${logo384} 384w`,
  `${logo512} 512w`,
  `${logo768} 768w`,
].join(", ");

/** Proporción del logo recortado (2327 x 1090). */
const ASPECT_RATIO = 2327 / 1090;

interface BrandLogoProps {
  /** Alto en píxeles CSS; el ancho se deriva de la proporción del logo. */
  height: number;
  /** Para el logo visible al cargar (cabecera): se pide antes que el resto de imágenes. */
  priority?: boolean;
  className?: string;
}

export function BrandLogo({ height, priority = false, className }: BrandLogoProps) {
  const width = Math.round(height * ASPECT_RATIO);

  return (
    <img
      src={logo256}
      srcSet={SRC_SET}
      // El navegador elige el archivo según este ancho y la densidad de la pantalla.
      sizes={`${width}px`}
      width={width}
      height={height}
      alt="nodepop"
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      className={cn("block max-w-none select-none", className)}
    />
  );
}
