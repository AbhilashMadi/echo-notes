import type { NavigateFunction, NavigateOptions } from "react-router-dom";

import { createContext } from "react";
import { HeroUIProvider } from "@heroui/system";
import { useHref, useNavigate } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";

import { store } from "@/context/store";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export interface IGlobalContextType {
  navigate: NavigateFunction;
}

export const GlobalContext = createContext<IGlobalContextType>({
  navigate: () => null,
});

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <ReduxProvider store={store}>
        <GlobalContext.Provider value={{ navigate }}>
          {children}
        </GlobalContext.Provider>
      </ReduxProvider>
    </HeroUIProvider>
  );
}
