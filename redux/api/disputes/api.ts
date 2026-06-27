import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";
import type { IDispute } from "./interface";

const baseName = "/disputes";

const disputeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createDispute: builder.mutation<Response<IDispute>, {
      orderId: string; type: string; reason: string; description?: string; images?: string[];
    }>({
      query: (data) => ({ url: `${baseName}/me`, method: "POST", data }),
      invalidatesTags: [{ type: tagTypes.GET_ORDERS }],
    }),

    getMyDisputes: builder.query<Response<{ data: IDispute[]; metadata: any }>, { pageSize?: number }>({
      query: (params) => ({ url: `${baseName}/me`, method: "GET", params }),
    }),

    getMyDispute: builder.query<Response<IDispute>, string>({
      query: (id) => ({ url: `${baseName}/me/${id}`, method: "GET" }),
    }),

    sendDisputeMessage: builder.mutation<Response<IDispute>, { id: string; body: string; images?: string[] }>({
      query: ({ id, ...data }) => ({ url: `${baseName}/me/${id}/message`, method: "POST", data }),
    }),

    closeMyDispute: builder.mutation<Response<IDispute>, { id: string; resolution?: string }>({
      query: ({ id, ...data }) => ({ url: `${baseName}/me/${id}/close`, method: "PATCH", data }),
    }),
  }),
});

export const {
  useCreateDisputeMutation,
  useGetMyDisputesQuery,
  useGetMyDisputeQuery,
  useSendDisputeMessageMutation,
  useCloseMyDisputeMutation,
} = disputeApi;
