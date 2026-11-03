import type { CatalogGateway, CatalogProduct } from "@/application/ports/CatalogGateway";

const PICSUM_IDS = 50;

/**
 * Ids de Picsum (1–50) barajadas una vez por carga de la página: cada producto
 * recibe una foto aleatoria sin repetir y la conserva en tarjeta y detalle.
 */
const photoIds = Array.from({ length: PICSUM_IDS }, (_, i) => i + 1)
  .map((id) => ({ id, order: Math.random() }))
  .sort((a, b) => a.order - b.order)
  .map(({ id }) => id);

/** Foto de ejemplo de Picsum; no tiene relación con el producto. */
function demoPhoto(productId: number): string {
  return `https://picsum.photos/id/${photoIds[(productId - 1) % PICSUM_IDS]}/600/400`;
}

function demoProduct(
  id: number,
  name: string,
  price: number,
  sellerName: string,
  tagNames: string[],
): CatalogProduct {
  return {
    id,
    name,
    price,
    sellerName,
    ownerId: 0,
    image: demoPhoto(id),
    tags: tagNames.map((tagName) => ({ id: null, name: tagName })),
  };
}

/** Datos ficticios para enseñar el catálogo. Ordenados del más reciente al más antiguo. */
const DEMO_PRODUCTS: CatalogProduct[] = [
  demoProduct(1, "Bicicleta de montaña", 150, "Laura Martín", ["Bicis", "Deporte"]),
  demoProduct(2, "Sofá de dos plazas", 220, "Diego Ruiz", ["Hogar"]),
  demoProduct(3, "Cámara réflex con objetivo", 340, "Marta Vidal", ["Electrónica"]),
  demoProduct(4, "Chaqueta vaquera", 25, "Nora Gil", ["Moda"]),
  demoProduct(5, "Lote de novelas", 18, "Pablo Soto", ["Libros"]),
  demoProduct(6, "Lámpara de pie", 40, "Diego Ruiz", ["Hogar"]),
  demoProduct(7, "Bicicleta plegable", 190, "Iván Castro", ["Bicis"]),
  demoProduct(8, "Auriculares inalámbricos", 55, "Marta Vidal", ["Electrónica"]),
  demoProduct(9, "Abrigo de lana", 60, "Nora Gil", ["Moda"]),
  demoProduct(10, "Enciclopedia ilustrada", 30, "Pablo Soto", ["Libros"]),
  demoProduct(11, "Mesa de centro", 75, "Laura Martín", ["Hogar"]),
  demoProduct(12, "Patinete urbano", 95.5, "Iván Castro", ["Deporte"]),
];

const LATENCY_MS = 300;

function withLatency<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

export class DemoCatalogGateway implements CatalogGateway {
  list(): Promise<CatalogProduct[]> {
    return withLatency(DEMO_PRODUCTS);
  }

  get(id: number): Promise<CatalogProduct | null> {
    return withLatency(DEMO_PRODUCTS.find((product) => product.id === id) ?? null);
  }
}
