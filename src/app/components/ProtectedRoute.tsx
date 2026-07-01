import { Navigate, useLocation } from "react-router";
import { useSelector } from "react-redux";
import type { ReactNode } from "react";
import type { RootState } from "../../store/store";

type ProtectedRouteProps = {
  children: ReactNode;
  role?: "USER" | "ADMIN";
};

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const location = useLocation();
  const auth = useSelector((state: RootState) => state.auth);

  if (!auth.token) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  if (role && auth.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
