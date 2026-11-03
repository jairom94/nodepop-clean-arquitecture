import { Route, Routes } from "react-router";
import AppLayout from "./components/AppLayout";
import { Toaster } from "./components/ui/sonner";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CatalogPage from "./pages/CatalogPage";
import CatalogProductPage from "./pages/CatalogProductPage";
import MyProductsPage from "./pages/MyProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import { AuthRedirect } from "@/presentation/routing/AuthRedirect";
import { ErrorBoundary } from "@/presentation/components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Auth fuera del shell: layout a pantalla completa propio */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Resto de páginas dentro del layout compartido */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<CatalogPage />} />
          <Route path="/products/:id" element={<CatalogProductPage />} />
          <Route element={<AuthRedirect />}>
            <Route path="/my-products" element={<MyProductsPage />} />
            <Route path="/my-products/:id" element={<ProductDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;
