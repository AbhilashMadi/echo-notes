import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReAuth from "@/lib/base-query-with-re-auth";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password, remember }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password, remember },
      }),
    }),
    signup: builder.mutation({
      query: ({ username, email, password, confirmPassword }) => ({
        url: "/auth/signup",
        method: "POST",
        body: { username, email, password, confirmPassword },
      }),
    }),
    verifyEmail: builder.mutation({
      query: ({ token }) => ({
        url: "/auth/verify/email",
        method: "POST",
        body: { token },
      }),
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useVerifyEmailMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;
