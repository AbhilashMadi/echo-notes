import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "@/lib/base-query-with-re-auth";
import { ApiResponse } from "@/types/generic-types";
import { setUser } from "@/context/auth-slice";

// Reusable function to handle query success
const handleQuerySuccess = async (queryFulfilled: any, dispatch: any) => {
  try {
    const { data } = await queryFulfilled;

    if (data.success) {
      dispatch(setUser(data.data));
    }
  } catch (error) {
    console.error("Auth API Error:", error);
  }
};

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
      onQueryStarted: (_arg, { dispatch, queryFulfilled }) =>
        handleQuerySuccess(queryFulfilled, dispatch),
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
      onQueryStarted: (_arg, { dispatch, queryFulfilled }) =>
        handleQuerySuccess(queryFulfilled, dispatch),
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
      onQueryStarted: (_arg, { dispatch, queryFulfilled }) =>
        handleQuerySuccess(queryFulfilled, dispatch),
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
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          if (data.success) {
            dispatch(setUser(null));
          }
        } catch (error) {
          console.error("Logout error:", error);
        }
      },
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
