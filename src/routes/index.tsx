import { lazy, Suspense } from "react";
import { Navigate, createBrowserRouter } from "react-router";
import { ProtectedRoute } from "../app/components/ProtectedRoute";

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
const Checkout = lazy(() =>
  import("../app/pages/Checkout").then((m) => ({ default: m.Checkout })),
);
const CheckoutSuccess = lazy(() =>
  import("../app/pages/CheckoutSuccess").then((m) => ({
    default: m.CheckoutSuccess,
  })),
);
const AuthPage = lazy(() =>
  import("../app/pages/Auth").then((m) => ({ default: m.AuthPage })),
);
const AccountPage = lazy(() =>
  import("../app/pages/Account").then((m) => ({ default: m.AccountPage })),
);
const SellerChannelPage = lazy(() =>
  import("../app/pages/SellerChannel").then((m) => ({
    default: m.SellerChannelPage,
  })),
);
const BecomeSellerPage = lazy(() =>
  import("../app/pages/BecomeSeller").then((m) => ({
    default: m.BecomeSellerPage,
  })),
);
const NotificationsPage = lazy(() =>
  import("../app/pages/Notifications").then((m) => ({
    default: m.NotificationsPage,
  })),
);
const AdminPage = lazy(() =>
  import("../app/pages/Admin").then((m) => ({ default: m.AdminPage })),
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
      { path: "checkout", element: <Checkout /> },
      { path: "checkout/success", element: <CheckoutSuccess /> },
      { path: "auth", element: <AuthPage /> },
      { path: "seller/channel", element: <SellerChannelPage /> },
      { path: "seller/register", element: <BecomeSellerPage /> },
      { path: "notifications", element: <NotificationsPage /> },
      {
        path: "account",
        element: (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute role="ADMIN">
            <AdminPage />
          </ProtectedRoute>
        ),
      },
      { path: "category/:slug", element: <Category /> },
      { path: "search", element: <Search /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
