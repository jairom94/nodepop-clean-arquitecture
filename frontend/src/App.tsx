import { Route, Routes } from "react-router";
import AppLayout from "./components/AppLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProductsPage from "./pages/ProductsPage";
import MyProductsPage from "./pages/MyProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import TagsPage from "./pages/TagsPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      {/* Login fuera del shell: layout a pantalla completa propio */}
      <Route path="/login" element={<LoginPage />} />

      {/* Resto de páginas dentro del layout compartido */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/mine" element={<MyProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/tags" element={<TagsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
