import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";

import { IPaginationQuery } from "../interface";
import {
  ICompanyByLocationProps,
  ICompanyProps,
  ICreateCompayPayload,
  IEditCompayPayload,
  IPaginatedCompaniesResponse,
} from "./interface";

const baseName = "/company";
const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCompanies: builder.query<
      Response<IPaginatedCompaniesResponse>,
      IPaginationQuery
    >({
      query: (params) => ({
        url: `${baseName}/all`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.ALL_COMPANIES }],
    }),
    getAllUnpaginatedCompanies: builder.query<Response<ICompanyProps[]>, void>({
      query: () => ({
        url: `${baseName}/unpaginated`,
        method: "GET",
      }),
      providesTags: [{ type: tagTypes.ALL_UNPAGINATED_COMPANIES }],
    }),
    getAllCompaniesByLocationId: builder.query<
      Response<ICompanyByLocationProps[]>,
      { locationId: string }
    >({
      query: ({ locationId }) => ({
        url: `${baseName}/companies/${locationId}`,
        method: "GET",
      }),
    }),

    createCompany: builder.mutation<
      Response<ICompanyProps>,
      ICreateCompayPayload
    >({
      query: (payload) => ({
        url: `${baseName}/update`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: [
        { type: tagTypes.ALL_COMPANIES },
        { type: tagTypes.ALL_UNPAGINATED_COMPANIES },
      ],
    }),
    updateCompany: builder.mutation<
      Response<ICompanyProps>,
      IEditCompayPayload
    >({
      query: (payload) => ({
        url: `${baseName}/update`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: [
        { type: tagTypes.ALL_COMPANIES },
        { type: tagTypes.ALL_UNPAGINATED_COMPANIES },
      ],
    }),
    deleteCompany: builder.mutation<Response, string>({
      query: (id) => ({
        url: `${baseName}/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: tagTypes.ALL_COMPANIES },
        { type: tagTypes.ALL_UNPAGINATED_COMPANIES },
      ],
    }),
  }),
});

export const {
  useGetAllCompaniesQuery,
  useGetAllUnpaginatedCompaniesQuery,
  useGetAllCompaniesByLocationIdQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = authApi;
