import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/local-auth";

/** Wrap a route's element; signed-out visitors go to the login page and come back after. */
export function RequireAuth({
  children,
  redirectTo = "/login",
}: {
  children?: ReactNode;
  redirectTo?: string;
}) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}

export default RequireAuth;