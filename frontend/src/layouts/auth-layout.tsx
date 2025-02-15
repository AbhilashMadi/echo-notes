import { Navigate, Outlet } from "react-router-dom";

import { Paths } from "@/config/site";
import useAuth from "@/hooks/use-auth";
import Sider from "@/components/common/sider";

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <main className="flex m-16 gap-12 font-primary">
      <Sider />
      <div className="flex-grow p-16 rounded bg-foreground-50">
        <Outlet />
      </div>
    </main>
  ) : (
    <Navigate replace to={Paths.LOGIN} />
  );
}
