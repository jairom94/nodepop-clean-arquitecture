import { useState } from "react";
import { useMyProducts } from "@/presentation/products/hooks/useMyProducts";
import { useCreateProduct } from "@/presentation/products/hooks/useCreateProduct";
import { useUpdateProduct } from "@/presentation/products/hooks/useUpdateProduct";
import { useDeleteProduct } from "@/presentation/products/hooks/useDeleteProduct";
import { ProductFormDialog } from "@/presentation/products/components/ProductFormDialog";
import type { ProductDto } from "@/application/products/schemas/ProductSchema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const eur = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

export default function MyProductsPage() {
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<{ open: boolean; product: ProductDto | null }>({
    open: false,
    product: null,
  });

  const { data, isPending, isError, refetch } = useMyProducts({ page, pageSize: 10 });
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  if (isPending) {
    return <p className="text-muted-foreground">Cargando productos...</p>;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-destructive">No se pudieron cargar tus productos</p>
        <Button variant="outline" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    );
  }

  const { items, total, totalPages } = data;
  const mutationFailed =
    createProduct.isError || updateProduct.isError || deleteProduct.isError;

  const handleCreate = async (values: {
    name: string;
    price: number;
    image: string | null;
    tags: string[];
  }) => {
    await createProduct.mutateAsync(values);
  };

  const handleUpdate = async (
    id: number,
    values: { name: string; price: number; image: string | null; tags: string[] },
  ) => {
    await updateProduct.mutateAsync({
      id,
      changes: {
        name: values.name,
        price: values.price,
        image: values.image,
        tags: values.tags,
      },
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    await deleteProduct.mutateAsync(id);
  };

  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mis productos</h1>
          <span className="text-sm text-muted-foreground">{total} en total</span>
        </div>
        <Button onClick={() => setDialog({ open: true, product: null })}>
          Nuevo producto
        </Button>
      </div>

      {mutationFailed && (
        <p className="mt-4 text-sm text-destructive">
          Ha ocurrido un error en la última operación
        </p>
      )}

      {items.length === 0 ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Aún no tienes productos</CardTitle>
            <CardDescription>Publica tu primer producto para empezar a vender</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product) => (
            <li key={product.id}>
              <Card className="flex h-full flex-col">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                  <CardDescription>{eur.format(product.price)}</CardDescription>
                </CardHeader>

                {product.tags.length > 0 && (
                  <CardContent className="flex flex-wrap gap-1 pb-0">
                    {product.tags.map((tag) => (
                      <span
                        key={tag.id ?? tag.name}
                        className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </CardContent>
                )}

                <CardContent className="mt-auto flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setDialog({ open: true, product })}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    disabled={deleteProduct.isPending}
                    onClick={() => void handleDelete(product.id as number)}
                  >
                    Eliminar
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}

      {dialog.open && (
        <ProductFormDialog
          key={dialog.product?.id ?? "new"}
          product={dialog.product}
          onClose={() => setDialog({ open: false, product: null })}
          onSubmit={async (values) => {
            if (dialog.product?.id != null) {
              await handleUpdate(dialog.product.id, values);
            } else {
              await handleCreate(values);
            }
          }}
        />
      )}
    </section>
  );
}
