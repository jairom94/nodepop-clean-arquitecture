import { Route, Routes } from "react-router";
import AppLayout from "./components/AppLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyProductsPage from "./pages/MyProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
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
          <Route element={<AuthRedirect />}>
            <Route path="/products" element={<MyProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
