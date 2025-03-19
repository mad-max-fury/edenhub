import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";

import { IPaginationQuery } from "../interface";
import {
  ICreateJobTitlePayload,
  IEditJobTitlePayload,
  IJobTitleProps,
  IPaginatedJobTitlesResponse,
} from "./interface";

const baseName = "/jobTitle";
const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllJobTitles: builder.query<
      Response<IPaginatedJobTitlesResponse>,
      IPaginationQuery
    >({
      query: (params) => ({
        url: `${baseName}/all`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.ALL_JOB_TITLES }],
    }),
    getAllUnpaginatedJobTitles: builder.query<Response<IJobTitleProps[]>, void>(
      {
        query: () => ({
          url: `${baseName}/unpaginated`,
          method: "GET",
        }),
        providesTags: [{ type: tagTypes.ALL_UNPAGINATED_JOB_TITLES }],
      },
    ),
    createJobTitle: builder.mutation<
      Response<IJobTitleProps>,
      ICreateJobTitlePayload
    >({
      query: (payload) => ({
        url: `${baseName}/update`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: [
        { type: tagTypes.ALL_JOB_TITLES },
        { type: tagTypes.ALL_UNPAGINATED_JOB_TITLES },
      ],
    }),
    updateJobTitle: builder.mutation<
      Response<IJobTitleProps>,
      IEditJobTitlePayload
    >({
      query: (payload) => ({
        url: `${baseName}/update`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: [
        { type: tagTypes.ALL_UNPAGINATED_JOB_TITLES },
        { type: tagTypes.ALL_JOB_TITLES },
      ],
    }),
    deleteJobTitle: builder.mutation<Response, string>({
      query: (id) => ({
        url: `${baseName}/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: tagTypes.ALL_JOB_TITLES },
        { type: tagTypes.ALL_UNPAGINATED_JOB_TITLES },
      ],
    }),
    getJobTitleExcelTemplate: builder.mutation<Blob, void>({
      query: () => ({
        url: `${baseName}/excel`,
        method: "GET",
        responseType: "blob", // This tells axios or fetch that we expect a binary blob.
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Correct MIME type for Excel files
        },
      }),
    }),
    importJobTitle: builder.mutation<Response<IJobTitleProps>, FormData>({
      query: (payload) => ({
        url: `${baseName}/upload`,
        method: "POST",
        data: payload,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: [
        { type: tagTypes.ALL_JOB_TITLES },
        { type: tagTypes.ALL_UNPAGINATED_JOB_TITLES },
      ],
    }),
  }),
});

export const {
  useGetAllJobTitlesQuery,
  useGetAllUnpaginatedJobTitlesQuery,
  useCreateJobTitleMutation,
  useUpdateJobTitleMutation,
  useDeleteJobTitleMutation,
  useGetJobTitleExcelTemplateMutation,
  useImportJobTitleMutation,
} = authApi;
