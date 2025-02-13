import { type FC, lazy, type LazyExoticComponent, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { Paths } from "@/config/site";

const Auth: LazyExoticComponent<FC> = lazy(() => import("@/pages/auth"));
const IndexPage: LazyExoticComponent<FC> = lazy(() => import("@/pages/index"));
const NotFound: LazyExoticComponent<FC> = lazy(
  () => import("@/pages/not-found"),
);

function App() {
  return (
    <main className="min-h-dvh">
      <Suspense fallback="Loading...">
        <Routes>
          <Route index element={<IndexPage />} path={Paths.INDEX} />
          <Route element={<Auth />} path={Paths.AUTH} />
          <Route element={<NotFound />} path={"*"} />
        </Routes>
      </Suspense>
    </main>
  );
}

export default App;
