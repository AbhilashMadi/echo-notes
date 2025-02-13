import type { NavigateOptions } from "react-router-dom";

import { HeroUIProvider } from "@heroui/system";
import { useHref, useNavigate } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";

import { store } from "@/context/store";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider
      className="font-primary"
      navigate={navigate}
      useHref={useHref}
    >
      <ReduxProvider store={store}>{children}</ReduxProvider>
    </HeroUIProvider>
  );
}
