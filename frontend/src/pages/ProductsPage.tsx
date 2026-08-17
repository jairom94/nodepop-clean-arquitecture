import { Link } from "react-router";

export default function ProductsPage() {
  return (
    <section>
      <h1>Productos</h1>
      <p>Listado de todos los productos</p>
      <Link to="/products/mine">Mis productos</Link>
    </section>
  );
}
