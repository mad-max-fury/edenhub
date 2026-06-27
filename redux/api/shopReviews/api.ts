import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";

import { ICreateShopReview, IShopReview } from "./interface";

const baseName = "/shop-reviews";

const shopReviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShopReviews: builder.query<
      Response<IShopReview[]>,
      { limit?: number } | void
    >({
      query: (params) => ({
        url: baseName,
        method: "GET",
        params: params || {},
      }),
    }),

    createShopReview: builder.mutation<Response<IShopReview>, ICreateShopReview>({
      query: (data) => ({ url: baseName, method: "POST", data }),
    }),

    uploadReviewImage: builder.mutation<
      Response<{ url: string }>,
      FormData
    >({
      query: (data) => ({
        url: `${baseName}/image`,
        method: "POST",
        params: { type: "profiles" },
        data,
        headers: { "Content-Type": "multipart/form-data" },
      }),
    }),
  }),
});

export const {
  useGetShopReviewsQuery,
  useCreateShopReviewMutation,
  useUploadReviewImageMutation,
} = shopReviewsApi;
