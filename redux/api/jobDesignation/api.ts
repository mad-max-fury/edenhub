import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";

import { IPaginationQuery } from "../interface";
import {
  ICreateJobDesignationPayload,
  IEditJobDesignationPayload,
  IJobDesignationProps,
  IPaginatedJobDeignationsResponse,
} from "./interface";

const baseName = "/jobDesignation";
const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllJobDesignations: builder.query<
      Response<IPaginatedJobDeignationsResponse>,
      IPaginationQuery
    >({
      query: (params) => ({
        url: `${baseName}/all`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.ALL_JOB_DESIGNATIONS }],
    }),
    getAllUnpaginatedJobDesignations: builder.query<
      Response<IJobDesignationProps[]>,
      void
    >({
      query: () => ({
        url: `${baseName}/unpaginated`,
        method: "GET",
      }),
      providesTags: [{ type: tagTypes.ALL_UNPAGINATED_JOB_DESIGNATIONS }],
    }),
    createJobDesignation: builder.mutation<
      Response<IJobDesignationProps>,
      ICreateJobDesignationPayload
    >({
      query: (payload) => ({
        url: `${baseName}/update`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: [
        { type: tagTypes.ALL_JOB_DESIGNATIONS },
        { type: tagTypes.ALL_UNPAGINATED_JOB_DESIGNATIONS },
      ],
    }),
    updateJobDesignation: builder.mutation<
      Response<IJobDesignationProps>,
      IEditJobDesignationPayload
    >({
      query: (payload) => ({
        url: `${baseName}/update`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: [
        { type: tagTypes.ALL_UNPAGINATED_JOB_DESIGNATIONS },
        { type: tagTypes.ALL_JOB_DESIGNATIONS },
      ],
    }),
    deleteJobDesignation: builder.mutation<Response, string>({
      query: (id) => ({
        url: `${baseName}/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: tagTypes.ALL_JOB_DESIGNATIONS },
        { type: tagTypes.ALL_UNPAGINATED_JOB_DESIGNATIONS },
      ],
    }),
    getJobDesignationExcelTemplate: builder.mutation<Blob, void>({
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
    importJobDesignation: builder.mutation<
      Response<IJobDesignationProps>,
      FormData
    >({
      query: (payload) => ({
        url: `${baseName}/upload`,
        method: "POST",
        data: payload,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: [
        { type: tagTypes.ALL_JOB_DESIGNATIONS },
        { type: tagTypes.ALL_UNPAGINATED_JOB_DESIGNATIONS },
      ],
    }),
  }),
});

export const {
  useGetAllJobDesignationsQuery,
  useGetAllUnpaginatedJobDesignationsQuery,
  useCreateJobDesignationMutation,
  useUpdateJobDesignationMutation,
  useDeleteJobDesignationMutation,
  useGetJobDesignationExcelTemplateMutation,
  useImportJobDesignationMutation,
} = authApi;
