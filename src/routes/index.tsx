import { lazy, Suspense } from "react";
import { Navigate, createBrowserRouter } from "react-router";

const Home = lazy(() =>
  import("../app/pages/Home").then((m) => ({ default: m.Home })),
);
const Category = lazy(() =>
  import("../app/pages/Category").then((m) => ({ default: m.Category })),
);
const Search = lazy(() =>
  import("../app/pages/Search").then((m) => ({ default: m.Search })),
);
const ProductDetail = lazy(() =>
  import("../app/pages/ProductDetail").then((m) => ({
    default: m.ProductDetail,
  })),
);
const Cart = lazy(() =>
  import("../app/pages/Cart").then((m) => ({ default: m.Cart })),
);

const Layout = lazy(() =>
  import("../app/components/Layout").then((m) => ({ default: m.Layout })),
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense
        fallback={
          <div className="p-8 text-center text-gray-600">Loading...</div>
        }
      >
        <Layout />
      </Suspense>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "product/:id", element: <ProductDetail /> },
      { path: "cart", element: <Cart /> },
      { path: "category/:slug", element: <Category /> },
      { path: "search", element: <Search /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
