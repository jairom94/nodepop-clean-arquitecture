import { useState } from "react";
import { Link, useParams } from "react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { PageContainer } from "@/components/PageContainer";
import { Skeleton } from "@/components/ui/skeleton";
import { parsePositiveId } from "@/lib/format";
import { ContactSellerDialog } from "@/presentation/catalog/components/ContactSellerDialog";
import { useCatalogProduct } from "@/presentation/catalog/hooks/useCatalog";
import { StateMessage } from "@/presentation/components/StateMessage";
import { ProductDetailView } from "@/presentation/products/components/ProductDetailView";

export default function CatalogProductPage() {
  const { id } = useParams<{ id: string }>();
  const productId = parsePositiveId(id);
  const [contactOpen, setContactOpen] = useState(false);
  const { data: product, isLoading, isError, refetch } = useCatalogProduct(productId);

  if (isLoading) {
    return (
      <PageContainer>
        <Skeleton className="aspect-4/3 w-full max-w-2xl rounded-3xl" />
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <StateMessage
          alert
          title="No se pudo cargar"
          description="Comprueba tu conexión e inténtalo otra vez."
          action={
            <Button variant="outline" onClick={() => void refetch()}>
              Reintentar
            </Button>
          }
        />
      </PageContainer>
    );
  }

  if (!product) {
    return (
      <PageContainer>
        <StateMessage
          title="Este producto ya no está disponible"
          description="Puede que se haya retirado o que la dirección no sea correcta."
          action={
            <Link viewTransition to="/products" className={buttonVariants()}>
              Ver productos
            </Link>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="pt-4">
      <ProductDetailView
        id={product.id}
        name={product.name}
        price={product.price}
        image={product.image}
        tags={product.tags.map((tag) => tag.name)}
        sellerName={product.sellerName}
        backTo="/products"
        backLabel="Volver a productos"
      >
        <Button size="lg" onClick={() => setContactOpen(true)}>
          Contactar
        </Button>
      </ProductDetailView>

      <ContactSellerDialog
        open={contactOpen}
        sellerName={product.sellerName}
        productName={product.name}
        onClose={() => setContactOpen(false)}
      />
    </PageContainer>
  );
}
