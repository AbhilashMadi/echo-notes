import type {
  NavigateFunction,
  NavigateOptions,
  SetURLSearchParams,
} from "react-router-dom";

import { createContext, type FC, type ReactNode } from "react";
import { HeroUIProvider } from "@heroui/system";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";

import { store } from "@/context/store";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export interface IGlobalContextType {
  navigate: NavigateFunction;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
}

export const GlobalContext = createContext<IGlobalContextType | null>(null);

interface ProviderProps {
  children: ReactNode;
}

export const Provider: FC<ProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const value: IGlobalContextType = {
    navigate,
    searchParams,
    setSearchParams,
  };

  return (
    <HeroUIProvider>
      <ReduxProvider store={store}>
        <GlobalContext.Provider value={value}>
          {children}
        </GlobalContext.Provider>
      </ReduxProvider>
    </HeroUIProvider>
  );
};
