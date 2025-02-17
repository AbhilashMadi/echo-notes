import { Navigate, Outlet } from "react-router-dom";

import { Paths } from "@/config/site";
import useAuth from "@/hooks/use-auth";

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate replace to={Paths.LOGIN} />;
}
