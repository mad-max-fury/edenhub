import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";
import type { IQuestion, IQuestionListResponse } from "./interface";

const baseName = "/questions";

const questionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductQuestions: builder.query<
      IQuestionListResponse,
      { productId: string; pageNumber?: number; pageSize?: number }
    >({
      query: ({ productId, ...params }) => ({
        url: `${baseName}/product/${productId}`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.GET_QUESTIONS],
    }),

    createQuestion: builder.mutation<
      Response<IQuestion>,
      { productId: string; question: string }
    >({
      query: (body) => ({
        url: baseName,
        method: "POST",
        data: body,
      }),
      invalidatesTags: [tagTypes.GET_QUESTIONS],
    }),

    answerQuestion: builder.mutation<
      Response<IQuestion>,
      { id: string; body: string }
    >({
      query: ({ id, ...data }) => ({
        url: `${baseName}/${id}/answer`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.GET_QUESTIONS],
    }),

    voteQuestion: builder.mutation<
      Response<{ votes: number; voted: boolean }>,
      string
    >({
      query: (id) => ({
        url: `${baseName}/${id}/vote`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.GET_QUESTIONS],
    }),
  }),
});

export const {
  useGetProductQuestionsQuery,
  useCreateQuestionMutation,
  useAnswerQuestionMutation,
  useVoteQuestionMutation,
} = questionsApi;
