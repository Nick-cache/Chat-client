import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

const chatsAdapter = createEntityAdapter();

const chatsInitial = chatsAdapter.getInitialState();

export const chatsSlice = createApi({
  reducerPath: "chatsSlice",
  baseQuery: fetchBaseQuery({ baseUrl: "http://backend:8000/chats" }),
  tagTypes: ["Chats", "Messages"],
  endpoints: (builder) => ({
    // ! CHATS
    createChat: builder.mutation({
      query: (name, tokens, project_uuid = null) => ({
        method: "POST",
        url: "/create_chat",
        body: { name: name, tokens: tokens, project_uuid: project_uuid },
      }),
      providesTags: ["Chats"],
    }),
    getAllChats: builder.query({
      query: () => ({
        method: "GET",
        url: "/get_all",
      }),
      providesTags: ["Chats"],
    }),
    changeChatName: builder.mutation({
      query: (uuid, name) => ({
        method: "PUT",
        url: `/${uuid}`,
        body: { name: name },
      }),
      invalidatesTags: ["Chats"],
    }),
    deleteChat: builder.mutation({
      query: (uuid) => ({
        method: "DELETE",
        url: `/${uuid}`,
      }),
      invalidatesTags: ["Chats"],
    }),
    // ! MESSAGES
    getMessages: builder.query({
      query: (uuid) => ({
        method: "GET",
        url: `/${uuid}/messages`,
      }),
      providesTags: ["Messages"],
    }),
    addMessage: builder.mutation({
      query: (role, content, date, chat_uuid, stopped) => ({
        method: "PUT",
        url: "/add_message",
        body: {
          role: role,
          content: content,
          date: date,
          chat_uuid: chat_uuid,
          stopped: stopped,
        },
      }),
      invalidatesTags: ["Messages"],
    }),
    updateMessage: builder.mutation({
      query: (uuid, content) => ({
        method: "PUT",
        url: "/update_message",
        body: {
          uuid: uuid,
          content: content,
        },
      }),
    }),
    invalidatesTags: ["Messages"],
  }),
});

export const {
  useCreateChatMutation,
  useChangeChatNameMutation,
  useDeleteChatMutation,
  useGetAllChatsQuery,

  useAddMessageMutation,
  useUpdateMessageMutation,
  useGetMessagesQuery,
} = chatsSlice;

export const selectChatsResult = chatsSlice.endpoints.getAllChats.select();

const selectChatsData = createSelector(
  selectChatsResult,
  (chatsResult) => chatsResult.data
);

export const {
  selectAll: selectAllChats,
  selectById: selectChatById,
  selectIds: selectChatsIds,
} = chatsAdapter.getSelectors(
  (state) => selectChatsData(state) ?? chatsInitial
);
