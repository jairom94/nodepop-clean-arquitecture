const API_URL = import.meta.env.VITE_API_URL;

/** Origen del backend derivado de VITE_API_URL (ej: http://localhost:3005) */
const BACKEND_ORIGIN = (() => {
  try {
    return new URL(API_URL).origin;
  } catch {
    return "";
  }
})();

/**
 * Resuelve una ruta de imagen relativa (/uploads/...) a una URL completa
 * apuntando al dominio del backend.
 *
 * Si la URL ya es absoluta (http://, https://, blob:, data:), se devuelve sin
 * modificar para no romper previews locales ni URLs ya resueltas.
 */
export function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (/^(https?:|blob:|data:)/i.test(url)) return url;
  return `${BACKEND_ORIGIN}${url}`;
}

/**
 * Convierte una URL de imagen de producto en su versión thumbnail, resolviendo
 * además la URL completa contra el dominio del backend.
 *
 * El backend genera las imágenes con nombre `product-{timestamp}.webp` y sus
 * miniaturas como `product-{timestamp}-thumb.webp`, ambas bajo `/uploads/products/`.
 *
 * Ejemplo:
 *   /uploads/products/product-1234.webp
 *   -> http://localhost:3005/uploads/products/product-1234-thumb.webp
 *
 * Si la imagen no termina en .webp (datos heredados), se devuelve la URL
 * resuelta sin el sufijo -thumb.
 */
export function toThumbnailUrl(imageUrl: string | null | undefined): string | null {
  const resolved = resolveImageUrl(imageUrl);
  if (!resolved) return null;
  return resolved.replace(/\.webp$/, "-thumb.webp");
}
