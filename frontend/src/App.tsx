import { Link, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ProductsPage from "./pages/ProductsPage.tsx";
import MyProductsPage from "./pages/MyProductsPage.tsx";
import ProductDetailPage from "./pages/ProductDetailPage.tsx";
import TagsPage from "./pages/TagsPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";

function App() {
  return (
    <>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/products">Productos</Link>
        <Link to="/tags">Tags</Link>
        <Link to="/login">Login</Link>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/mine" element={<MyProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/tags" element={<TagsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
