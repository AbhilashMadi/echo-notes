import { type FC, lazy, Suspense, useLayoutEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Spinner } from "@heroui/react";

import { useLoginMutation, useRefreshTokenMutation } from "./context/auth-api";

import useGlobalContext from "@/hooks/context-hooks";
import { Paths } from "@/config/site";

const Auth = lazy(() => import("@/pages/auth"));
const IndexPage = lazy(() => import("@/pages/index"));
const NotFound = lazy(() => import("@/pages/not-found"));
const AuthLayout = lazy(() => import("@/layouts/auth-layout"));
const Dashboard = lazy(() => import("@/pages/dashboard"));

export const Loader: FC = () => {
  return (
    <main className="min-h-screen w-full flex-center">
      <Spinner label="Loading..." />
    </main>
  );
};

function App() {
  const [refreshToken, { isLoading }] = useRefreshTokenMutation();
  const [logout] = useLoginMutation();
  const { navigate } = useGlobalContext();

  const fetchData = async () => {
    // Refresh the tokens
    const { error } = await refreshToken({});

    // If the user haven't logged in before the get him out
    if (error) {
      await logout({});
      navigate(-1);
    }
  };

  useLayoutEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <main className="min-h-dvh">
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<Auth />} path={Paths.AUTH} />

          {/* Protected Routes (Inside AuthLayout) */}
          <Route element={<AuthLayout />}>
            <Route index element={<IndexPage />} />
            <Route element={<Dashboard />} path={Paths.DASHBOARD} />
          </Route>

          {/* Catch-All Not Found Route */}
          <Route element={<NotFound />} path="*" />
        </Routes>
      </Suspense>
    </main>
  );
}

export default App;
