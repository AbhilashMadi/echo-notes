import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { authApi } from "./auth-api";
import authSlice from "./auth-slice";

export const ENV_MODE =
  import.meta.env.MODE === "production" ? "production" : "local";

export const store = configureStore({
  reducer: {
    [authSlice.reducerPath]: authSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(authApi.middleware);
  },
  devTools: ENV_MODE === "local" && !!window.__REDUX_DEVTOOLS_EXTENSION__,
});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
