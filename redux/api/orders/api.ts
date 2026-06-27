import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";

import {
  ICreateOrderPayload,
  IFetchRatesResult,
  IMyOrdersResponse,
  IOrder,
  IOrderItemInput,
  IReceiverAddress,
} from "./interface";

const baseName = "/order";

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchRates: builder.mutation<
      Response<IFetchRatesResult>,
      { receiver: IReceiverAddress; items: IOrderItemInput[] }
    >({
      query: (data) => ({
        url: `${baseName}/rates`,
        method: "POST",
        data,
      }),
    }),

    createOrder: builder.mutation<Response<IOrder>, ICreateOrderPayload>({
      query: (data) => ({
        url: baseName,
        method: "POST",
        data,
      }),
      invalidatesTags: [
        { type: tagTypes.GET_ORDERS },
        { type: tagTypes.GET_CART },
      ],
    }),

    getMyOrders: builder.query<
      IMyOrdersResponse,
      { pageNumber?: number; pageSize?: number; status?: string }
    >({
      query: (params) => ({
        url: `${baseName}/me`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.GET_ORDERS }],
    }),

    getMyOrder: builder.query<Response<IOrder>, string>({
      query: (id) => ({ url: `${baseName}/me/${id}`, method: "GET" }),
      providesTags: [{ type: tagTypes.GET_ORDER }],
    }),

    verifyMyOrder: builder.mutation<Response<IOrder>, string>({
      query: (id) => ({ url: `${baseName}/me/${id}/verify`, method: "POST" }),
      invalidatesTags: [
        { type: tagTypes.GET_ORDER },
        { type: tagTypes.GET_ORDERS },
      ],
    }),

    cancelMyOrder: builder.mutation<Response<IOrder>, { id: string; reason?: string }>({
      query: ({ id, ...data }) => ({ url: `${baseName}/me/${id}/cancel`, method: "POST", data }),
      invalidatesTags: [
        { type: tagTypes.GET_ORDER },
        { type: tagTypes.GET_ORDERS },
      ],
    }),
  }),
});

export const {
  useFetchRatesMutation,
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetMyOrderQuery,
  useVerifyMyOrderMutation,
  useCancelMyOrderMutation,
} = orderApi;
