import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";

import {
  ICreateReviewPayload,
  IMyReviews,
  IProductReviewsResponse,
  IReview,
} from "./interface";

const baseName = "/review";

const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query<
      IProductReviewsResponse,
      { productId: string; pageNumber?: number; pageSize?: number }
    >({
      query: ({ productId, ...params }) => ({
        url: `${baseName}/product/${productId}`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.GET_REVIEWS }],
    }),

    getMyReviews: builder.query<Response<IMyReviews>, void>({
      query: () => ({
        url: `${baseName}/me`,
        method: "GET",
      }),
      providesTags: [{ type: tagTypes.GET_MY_REVIEWS }],
    }),

    createReview: builder.mutation<Response<IReview>, ICreateReviewPayload>({
      query: (data) => ({
        url: `${baseName}`,
        method: "POST",
        data,
      }),
      invalidatesTags: [
        { type: tagTypes.GET_REVIEWS },
        { type: tagTypes.GET_MY_REVIEWS },
      ],
    }),

    toggleReviewLike: builder.mutation<
      Response<{ likes: number; liked: boolean }>,
      string
    >({
      query: (id) => ({
        url: `${baseName}/${id}/like`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: tagTypes.GET_REVIEWS }],
    }),

    replyToReview: builder.mutation<
      Response<IReview>,
      { id: string; comment: string }
    >({
      query: ({ id, comment }) => ({
        url: `${baseName}/${id}/reply`,
        method: "POST",
        data: { comment },
      }),
      invalidatesTags: [{ type: tagTypes.GET_REVIEWS }],
    }),
  }),
});

export const {
  useGetProductReviewsQuery,
  useGetMyReviewsQuery,
  useCreateReviewMutation,
  useToggleReviewLikeMutation,
  useReplyToReviewMutation,
} = reviewApi;
