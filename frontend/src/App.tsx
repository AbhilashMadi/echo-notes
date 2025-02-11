import { Route, Routes } from "react-router-dom";
import { FC, lazy, LazyExoticComponent, Suspense } from "react";

const IndexPage: LazyExoticComponent<FC> = lazy(() => import("@/pages/index"));
const DocsPage: LazyExoticComponent<FC> = lazy(() => import("@/pages/docs"));
// eslint-disable-next-line prettier/prettier
const PricingPage: LazyExoticComponent<FC> = lazy(() => import("@/pages/pricing"));
const BlogPage: LazyExoticComponent<FC> = lazy(() => import("@/pages/blog"));
const AboutPage: LazyExoticComponent<FC> = lazy(() => import("@/pages/about"));

function App() {
  return (
    <Suspense fallback="Loading...">
      <Routes>
        <Route element={<IndexPage />} path="/" />
        <Route element={<DocsPage />} path="/docs" />
        <Route element={<PricingPage />} path="/pricing" />
        <Route element={<BlogPage />} path="/blog" />
        <Route element={<AboutPage />} path="/about" />
      </Routes>
    </Suspense>
  );
}

export default App;
