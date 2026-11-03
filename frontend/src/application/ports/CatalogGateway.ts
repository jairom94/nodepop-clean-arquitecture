import type { ProductDto } from "@/application/products/schemas/ProductSchema";

/** Producto del catálogo público: añade el vendedor a los datos del producto. */
export type CatalogProduct = Omit<ProductDto, "id"> & {
  id: number;
  sellerName: string;
};

/**
 * Acceso al catálogo público. Hoy lo implementan datos de ejemplo porque el
 * backend aún no expone un listado público: cuando exista, basta con añadir
 * otra implementación y cambiarla en composition/container.ts.
 */
export interface CatalogGateway {
  list(): Promise<CatalogProduct[]>;
  get(id: number): Promise<CatalogProduct | null>;
}
