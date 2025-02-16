import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReAuth from "@/lib/base-query-with-re-auth";
import { Note, NotesResponse } from "@/types/object-types";
import { ApiResponse } from "@/types/generic-types";

export const notesApi = createApi({
  reducerPath: "notes-api",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["NOTES"], // Define tag for invalidation
  endpoints: (builder) => ({
    getNotes: builder.query<ApiResponse<NotesResponse>, { query: string }>({
      query: ({ query }) => `/notes?${query}`,
      providesTags: ["NOTES"],
    }),

    // eslint-disable-next-line prettier/prettier
    updateNote: builder.mutation<ApiResponse<Note>, { noteId: string; body: any }>({
      query: ({ noteId, body }) => ({
        url: `/notes/${noteId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["NOTES"], // Invalidate "Notes" tag to trigger refetch
    }),

    deleteNote: builder.mutation<ApiResponse<object>, { noteId: string }>({
      query: ({ noteId }) => ({
        url: `/notes/${noteId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NOTES"],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApi;
