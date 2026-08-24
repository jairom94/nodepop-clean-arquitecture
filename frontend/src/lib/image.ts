/**
 * Convierte una URL de imagen de producto en su versión thumbnail.
 *
 * El backend genera las imágenes con nombre `product-{timestamp}.webp` y sus
 * miniaturas como `product-{timestamp}-thumb.webp`, ambas bajo `/uploads/products/`.
 *
 * Ejemplo:
 *   /uploads/products/product-1234.webp
 *   -> /uploads/products/product-1234-thumb.webp
 *
 * Si la imagen no sigue el formato esperado (por ejemplo, datos heredados),
 * se devuelve la URL original para no romper la UI.
 */
export function toThumbnailUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null;
  return imageUrl.replace(/\.webp$/, "-thumb.webp");
}
