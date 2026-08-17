import { Link, useParams } from "react-router";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <section>
      <h1>Detalle del producto #{id}</h1>
      <Link to="/products">← Volver a productos</Link>
    </section>
  );
}
