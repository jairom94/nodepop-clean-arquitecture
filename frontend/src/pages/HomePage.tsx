import { Link } from "react-router";

export default function HomePage() {
  return (
    <section>
      <h1>Nodepop</h1>
      <p>Bienvenido a la plataforma de compra-venta</p>
      <ul>
        <li>
          <Link to="/products">Ver productos</Link>
        </li>
        <li>
          <Link to="/login">Iniciar sesión</Link>
        </li>
      </ul>
    </section>
  );
}
