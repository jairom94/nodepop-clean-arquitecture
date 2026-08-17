import { Link } from "react-router";

export default function MyProductsPage() {
  return (
    <section>
      <h1>Mis productos</h1>
      <p>Productos que pertenecen al usuario autenticado</p>
      <Link to="/products">Ver todos los productos</Link>
    </section>
  );
}
