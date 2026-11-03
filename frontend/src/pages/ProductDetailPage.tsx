import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { apiErrorMessage } from "@/lib/api-error";
import { Button, buttonVariants } from "@/components/ui/button";
import { PageContainer } from "@/components/PageContainer";
import { Skeleton } from "@/components/ui/skeleton";
import { parsePositiveId } from "@/lib/format";
import { resolveImageUrl } from "@/lib/image";
import { ConfirmDialog } from "@/presentation/components/ConfirmDialog";
import { StateMessage } from "@/presentation/components/StateMessage";
import { ProductDetailView } from "@/presentation/products/components/ProductDetailView";
import { ProductFormDialog } from "@/presentation/products/components/ProductFormDialog";
import { useDeleteProduct } from "@/presentation/products/hooks/useDeleteProduct";
import { useProduct } from "@/presentation/products/hooks/useProduct";
import { useUpdateProduct } from "@/presentation/products/hooks/useUpdateProduct";
import { useUser } from "@/store/auth/auth-selectors";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = parsePositiveId(id);
  const navigate = useNavigate();
  const user = useUser();
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const { data: product, isLoading, isError, refetch } = useProduct(productId);
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  if (isLoading) {
    return (
      <PageContainer>
        <Skeleton className="aspect-4/3 w-full max-w-2xl rounded-3xl" />
      </PageContainer>
    );
  }

  if (productId === null || isError || !product) {
    return (
      <PageContainer>
        <StateMessage
          alert
          title="No se pudo cargar el producto"
          description="Puede que ya no exista o que haya fallado la conexión."
          action={
            productId === null ? (
              <Link
                viewTransition
                to="/my-products"
                className={buttonVariants({ variant: "outline" })}
              >
                Volver a mis productos
              </Link>
            ) : (
              <Button variant="outline" onClick={() => void refetch()}>
                Reintentar
              </Button>
            )
          }
        />
      </PageContainer>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteProduct.mutateAsync(productId);
      toast("Producto eliminado");
      navigate("/my-products", { replace: true, viewTransition: true });
    } catch (error) {
      setConfirmingDelete(false);
      toast.error(apiErrorMessage(error, "No se pudo eliminar el producto"));
    }
  };

  const sellerName = user ? `${user.name} ${user.lastname1}` : "Tú";

  return (
    <PageContainer className="pt-4">
      <ProductDetailView
        id={productId}
        name={product.name}
        price={product.price}
        image={resolveImageUrl(product.image)}
        tags={product.tags.map((tag) => tag.name)}
        sellerName={sellerName}
        backTo="/my-products"
        backLabel="Volver a mis productos"
      >
        <div className="rounded-2xl bg-card p-5">
          <p className="mb-3 font-semibold">Este producto es tuyo</p>
          <div className="flex flex-wrap gap-2">
            <Button className="flex-[1_1_8rem]" onClick={() => setEditing(true)}>
              Editar
            </Button>
            <Button
              variant="outline"
              className="flex-[1_1_8rem] text-destructive"
              onClick={() => setConfirmingDelete(true)}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </ProductDetailView>

      {editing && (
        <ProductFormDialog
          product={product}
          onClose={() => setEditing(false)}
          onSubmit={async ({ file, ...changes }) => {
            await updateProduct.mutateAsync({ id: productId, changes, file });
            toast("Cambios guardados");
          }}
        />
      )}

      <ConfirmDialog
        open={confirmingDelete}
        title="¿Eliminar este producto?"
        description={`«${product.name}» dejará de estar publicado. No se puede deshacer.`}
        confirmLabel="Eliminar"
        pending={deleteProduct.isPending}
        onConfirm={() => void handleDelete()}
        onCancel={() => setConfirmingDelete(false)}
      />
    </PageContainer>
  );
}
