import { createApi } from "@reduxjs/toolkit/query/react";

import { updateUserTags } from "./auth-slice";

import baseQueryWithReAuth from "@/lib/base-query-with-re-auth";
import { Note, NotesResponse } from "@/types/object-types";
import { ApiResponse } from "@/types/generic-types";
import { ServerKeys } from "@/resources/serverkeys";

export const notesApi = createApi({
  reducerPath: "notes-api",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["NOTES"],
  endpoints: (builder) => ({
    getNotes: builder.query<ApiResponse<NotesResponse>, { query: string }>({
      query: ({ query }) => `/notes?${query}`,
      providesTags: ["NOTES"],
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        // Updating the tags of the user
        dispatch(updateUserTags(data?.data?.[ServerKeys.TAGS] ?? []));
      },
    }),

    // eslint-disable-next-line prettier/prettier
    updateNote: builder.mutation<ApiResponse<Note>, { noteId: string; body: Partial<Note> }>({
      query: ({ noteId, body }) => ({
        url: `/notes/${noteId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["NOTES"],
    }),

    // eslint-disable-next-line prettier/prettier
    favoriteNote: builder.mutation<ApiResponse<Note>, { noteId: string; favorite: boolean }>({
      query: ({ noteId, favorite }) => ({
        url: `/notes/${noteId}`,
        method: "PATCH",
        body: { favorite },
      }),
      invalidatesTags: ["NOTES"],
    }),

    // eslint-disable-next-line prettier/prettier
    pinNote: builder.mutation<ApiResponse<Note>, { noteId: string; pinned: boolean }>({
      query: ({ noteId, pinned }) => ({
        url: `/notes/${noteId}`,
        method: "PATCH",
        body: { pinned },
      }),
      invalidatesTags: ["NOTES"],
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
  useFavoriteNoteMutation,
  usePinNoteMutation,
} = notesApi;
