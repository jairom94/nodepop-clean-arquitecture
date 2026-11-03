import { createBrowserRouter } from "react-router";
import App from "./App";
import AppLayout from "./components/AppLayout";
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

// Router de datos: necesario para las View Transitions entre rutas.
export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      // Auth fuera del shell: layout a pantalla completa propio
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },

      // Resto de páginas dentro del layout compartido
      {
        element: <AppLayout />,
        children: [
          { path: "/", element: <HomePage /> },
          { path: "/products", element: <CatalogPage /> },
          { path: "/products/:id", element: <CatalogProductPage /> },
          {
            element: <AuthRedirect />,
            children: [
              { path: "/my-products", element: <MyProductsPage /> },
              { path: "/my-products/:id", element: <ProductDetailPage /> },
              { path: "/profile", element: <ProfilePage /> },
            ],
          },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
