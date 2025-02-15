import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "@/lib/base-query-with-re-auth";
import { ApiResponse } from "@/types/generic-types";
import { setUser } from "@/context/auth-slice";

export const authApi = createApi({
  reducerPath: "auth-api",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<any>, any>({
      query: ({ email, password, remember }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password, remember },
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data.success) {
            // Set user data in Redux store
            dispatch(setUser(data.data));
          }
        } catch (error) {
          console.error("Login error:", error);
        }
      },
    }),
    signup: builder.mutation<ApiResponse<any>, any>({
      query: ({ username, email, password, confirmPassword }) => ({
        url: "/auth/signup",
        method: "POST",
        body: { username, email, password, confirmPassword },
      }),
    }),
    verifyEmail: builder.mutation({
      query: ({ otp }) => ({
        url: "/auth/verify/email",
        method: "POST",
        body: { otp },
      }),
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data.success) {
            // Set user data in Redux store
            dispatch(setUser(data.data));
          }
        } catch (error) {
          console.error("Login error:", error);
        }
      },
    }),
    resendOtp: builder.mutation({
      query: () => ({
        url: "/auth/resend-otp",
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
  useResendOtpMutation,
} = authApi;
