import { Route, Routes } from "react-router";
import AppLayout from "./components/AppLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/ProductsPage";
import MyProductsPage from "./pages/MyProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import TagsPage from "./pages/TagsPage";
import NotFoundPage from "./pages/NotFoundPage";
import { AuthRedirect } from "@/presentation/routing/AuthRedirect";

function App() {
  return (
    <Routes>
      {/* Auth fuera del shell: layout a pantalla completa propio */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Resto de páginas dentro del layout compartido */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route element={<AuthRedirect />}>
          <Route path="/products/mine" element={<MyProductsPage />} />
        </Route>
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/tags" element={<TagsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
