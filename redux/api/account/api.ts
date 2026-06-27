import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";

import { IAddress, IAddressPayload } from "./interface";

const baseName = "/user/addresses";

const accountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query<Response<IAddress[]>, void>({
      query: () => ({ url: baseName, method: "GET" }),
      providesTags: [{ type: tagTypes.GET_ADDRESSES }],
    }),

    addAddress: builder.mutation<Response<IAddress[]>, IAddressPayload>({
      query: (data) => ({ url: baseName, method: "POST", data }),
      invalidatesTags: [{ type: tagTypes.GET_ADDRESSES }],
    }),

    updateAddress: builder.mutation<
      Response<IAddress[]>,
      { id: string; data: Partial<IAddressPayload> }
    >({
      query: ({ id, data }) => ({
        url: `${baseName}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [{ type: tagTypes.GET_ADDRESSES }],
    }),

    setDefaultAddress: builder.mutation<Response<IAddress[]>, string>({
      query: (id) => ({ url: `${baseName}/${id}/default`, method: "PATCH" }),
      invalidatesTags: [{ type: tagTypes.GET_ADDRESSES }],
    }),

    deleteAddress: builder.mutation<Response<IAddress[]>, string>({
      query: (id) => ({ url: `${baseName}/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: tagTypes.GET_ADDRESSES }],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useSetDefaultAddressMutation,
  useDeleteAddressMutation,
} = accountApi;
