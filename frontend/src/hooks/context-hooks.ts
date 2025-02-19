import { useContext } from "react";

import { GlobalContext, IGlobalContextType } from "@/provider";

export default function useGlobalContext(): IGlobalContextType {
  return useContext(GlobalContext);
}
