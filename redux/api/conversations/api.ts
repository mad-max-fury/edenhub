import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";
import { IConversation, IConversationListResponse } from "./interface";

const baseName = "/conversations";

const conversationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyConversations: builder.query<
      IConversationListResponse,
      { pageSize?: number; pageNumber?: number }
    >({
      query: (params) => ({
        url: `${baseName}/me`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.GET_CONVERSATIONS }],
    }),

    getMyConversation: builder.query<Response<IConversation>, string>({
      query: (id) => ({ url: `${baseName}/me/${id}`, method: "GET" }),
      providesTags: [{ type: tagTypes.GET_CONVERSATION }],
    }),

    createConversation: builder.mutation<
      Response<IConversation>,
      { subject: string; body: string }
    >({
      query: (data) => ({
        url: `${baseName}/me`,
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: tagTypes.GET_CONVERSATIONS }],
    }),

    replyConversation: builder.mutation<
      Response<IConversation>,
      { id: string; body: string }
    >({
      query: ({ id, body }) => ({
        url: `${baseName}/me/${id}/reply`,
        method: "POST",
        data: { body },
      }),
      invalidatesTags: [
        { type: tagTypes.GET_CONVERSATIONS },
        { type: tagTypes.GET_CONVERSATION },
      ],
    }),

    getMyUnreadCount: builder.query<Response<{ count: number }>, void>({
      query: () => ({ url: `${baseName}/me/unread`, method: "GET" }),
    }),

    uploadChatFile: builder.mutation<Response<{ url: string }>, FormData>({
      query: (data) => ({
        url: "/shop-reviews/image",
        method: "POST",
        params: { type: "chat" },
        data,
        headers: { "Content-Type": "multipart/form-data" },
      }),
    }),
  }),
});

export const {
  useGetMyConversationsQuery,
  useGetMyConversationQuery,
  useCreateConversationMutation,
  useReplyConversationMutation,
  useGetMyUnreadCountQuery,
  useUploadChatFileMutation,
} = conversationApi;
