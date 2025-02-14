import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { clearUser } from "@/context/auth-slice";

export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  credentials: "include",
  // prepareHeaders: (headers, { getState }) => {
  //   const token = (getState() as RootState).auth.user?.accessToken;

  //   if (token) {
  //     headers.set("Authorization", `Bearer ${token}`);
  //   }

  //   return headers;
  // },
});

export const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs, // Request type (URL string or object)
  unknown, // Response type (can be any)
  FetchBaseQueryError // Error type
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.log("Access token expired, attempting to refresh...");

    const refreshResult = await baseQuery(
      { url: "/auth/refresh-token", method: "POST" },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      result = await baseQuery(args, api, extraOptions); // Retry request
    } else {
      console.log("Refresh failed, logging out...");
      api.dispatch(clearUser());
    }
  }

  return result;
};

export default baseQueryWithReAuth;
