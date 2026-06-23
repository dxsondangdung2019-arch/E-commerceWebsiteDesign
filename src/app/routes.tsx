import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { Category } from "./pages/Category";
import { Search } from "./pages/Search";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "product/:id", Component: ProductDetail },
      { path: "cart", Component: Cart },
      { path: "category/:slug", Component: Category },
      { path: "search", Component: Search },
    ],
  },
]);
