import { Navbar } from "@heroui/navbar";
import { Navigate, Outlet } from "react-router-dom";

import useAuth from "@/hooks/use-auth";
import { Paths } from "@/config/site";

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        <Outlet />
      </main>
    </div>
  ) : (
    <Navigate replace to={Paths.LOGIN} />
  );
}
