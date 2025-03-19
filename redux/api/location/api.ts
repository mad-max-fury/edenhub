import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";

import { IPaginationQuery } from "../interface";
import {
  ICreateLocationPayload,
  IEditLocationPayload,
  ILocationProps,
  IPaginatedLocationsResponse,
} from "./interface";

const baseName = "/location";
const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllLocations: builder.query<
      Response<IPaginatedLocationsResponse>,
      IPaginationQuery
    >({
      query: (params) => ({
        url: `${baseName}/all`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.ALL_LOCATIONS }],
    }),
    getAllUnPaginatedLocations: builder.query<Response<ILocationProps[]>, void>(
      {
        query: () => ({
          url: `${baseName}/unpaginated`,
          method: "GET",
        }),
        providesTags: [{ type: tagTypes.ALL_LOCATIONS }],
      },
    ),
    createLocation: builder.mutation<
      Response<ILocationProps>,
      ICreateLocationPayload
    >({
      query: (payload) => ({
        url: `${baseName}/update`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: [{ type: tagTypes.ALL_LOCATIONS }],
    }),
    updateLocation: builder.mutation<
      Response<ILocationProps>,
      IEditLocationPayload
    >({
      query: (payload) => ({
        url: `${baseName}/update`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: [{ type: tagTypes.ALL_LOCATIONS }],
    }),
    deleteLocation: builder.mutation<Response, string>({
      query: (id) => ({
        url: `${baseName}/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: tagTypes.ALL_LOCATIONS }],
    }),
  }),
});

export const {
  useGetAllLocationsQuery,
  useGetAllUnPaginatedLocationsQuery,
  useCreateLocationMutation,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
} = authApi;
