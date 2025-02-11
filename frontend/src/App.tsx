import { type FC, lazy, LazyExoticComponent, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const IndexPage: LazyExoticComponent<FC> = lazy(() => import("@/pages/index"));

function App() {
  return (
    <Suspense fallback="Loading...">
      <Routes>
        <Route element={<IndexPage />} path="/" />
      </Routes>
    </Suspense>
  );
}

export default App;
