import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";

import { IPaginationQuery } from "../interface";
import {
  IBusinessUnitProps,
  ICreateBusinessUnitPayload,
  IEditBusinessUnitPayload,
  IPaginatedBusinessUnitResponse,
} from "./interface";

const baseName = "/businessUnit";
const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBusinessUnits: builder.query<
      Response<IPaginatedBusinessUnitResponse>,
      IPaginationQuery
    >({
      query: (params) => ({
        url: `${baseName}/all`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.ALL_BUSINESS_UNITS }],
    }),
    getAllUnpaginatedBusinessUnits: builder.query<
      Response<IBusinessUnitProps[]>,
      {
        companyId: string;
      }
    >({
      query: (params) => ({
        url: `${baseName}/unpaginated`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.ALL_BUSINESS_UNITS }],
    }),
    createBusinessUnit: builder.mutation<
      Response<IBusinessUnitProps>,
      ICreateBusinessUnitPayload
    >({
      query: (payload) => ({
        url: `${baseName}/update`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: [{ type: tagTypes.ALL_BUSINESS_UNITS }],
    }),
    updateBusinessUnit: builder.mutation<
      Response<IBusinessUnitProps>,
      IEditBusinessUnitPayload
    >({
      query: (payload) => ({
        url: `${baseName}/update`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: [{ type: tagTypes.ALL_BUSINESS_UNITS }],
    }),
    deleteBusinessUnit: builder.mutation<Response, string>({
      query: (id) => ({
        url: `${baseName}/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: tagTypes.ALL_BUSINESS_UNITS }],
    }),
  }),
});

export const {
  useGetAllBusinessUnitsQuery,
  useGetAllUnpaginatedBusinessUnitsQuery,
  useCreateBusinessUnitMutation,
  useUpdateBusinessUnitMutation,
  useDeleteBusinessUnitMutation,
} = authApi;
