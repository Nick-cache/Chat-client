import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { backend_link } from "../../config";

// ! CHATS
const chatsAdapter = createEntityAdapter({
  selectId: (chat) => chat.uuid,
});
const chatsInitial = chatsAdapter.getInitialState();

export const chatsSlice = createApi({
  reducerPath: "chatsSlice",
  tagTypes: ["Chats"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${backend_link}/chats`,
  }),
  endpoints: (builder) => ({
    getAllChats: builder.query({
      query: () => ({
        method: "GET",
        url: "/get_all",
      }),
      transformResponse: (data) => {
        return chatsAdapter.setAll(chatsInitial, data);
      },
      providesTags: ["Chats"],
    }),
    createChat: builder.mutation({
      query: ({ name }) => ({
        method: "POST",
        url: "/create_chat",
        body: { name: name },
      }),
      invalidatesTags: ["Chats"],
    }),
    changeChatName: builder.mutation({
      query: ({ uuid, name }) => ({
        method: "PUT",
        url: `/${uuid}/change_name`,
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
  }),
});

export const {
  useGetAllChatsQuery,
  useChangeChatNameMutation,
  useCreateChatMutation,
  useDeleteChatMutation,
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

// ! MESSAGES
const messagesAdapter = createEntityAdapter({
  selectId: (message) => message.uuid,
});
const messagesInitial = messagesAdapter.getInitialState();

export const messagesSlice = createApi({
  reducerPath: "messagesSlice",
  tagTypes: ["Messages"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${backend_link}/chats`,
  }),
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (chat_uuid) => ({
        method: "GET",
        url: `/${chat_uuid}/messages`,
      }),
      transformResponse: (data) => {
        return messagesAdapter.setAll(messagesInitial, data);
      },
      providesTags: ["Messages"],
    }),
    addMessage: builder.mutation({
      query: ({ role, content, date, chat_uuid, stopped, tokens }) => ({
        method: "PUT",
        url: "/add_message",
        body: {
          role: role,
          content: content,
          date: date,
          chat_uuid: chat_uuid,
          stopped: stopped,
          tokens: tokens,
        },
      }),
      invalidatesTags: ["Messages"],
    }),
    updateMessage: builder.mutation({
      query: ({ uuid, content, stopped, tokens }) => ({
        method: "PUT",
        url: "/update_message",
        body: {
          uuid: uuid,
          content: content,
          stopped: stopped,
          tokens: tokens,
        },
      }),
      invalidatesTags: ["Messages"],
    }),
    deleteMessage: builder.mutation({
      query: (uuids) => ({
        method: "PUT",
        url: "/delete_messages",
        body: {
          uuids: uuids,
        },
      }),
      invalidatesTags: ["Messages"],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useAddMessageMutation,
  useDeleteMessageMutation,
  useUpdateMessageMutation,
} = messagesSlice;

export const useGetMessages = messagesSlice.endpoints.getMessages.useQueryState;
