import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";

import { IPaginationQuery } from "../interface";
import {
  ICreateDepartmentPayload,
  IDepartmentProps,
  IEditDepartmentPayload,
  IPaginatedDepartmentsResponse,
} from "./interface";

const baseName = "/department";
const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllDepartments: builder.query<
      Response<IPaginatedDepartmentsResponse>,
      IPaginationQuery
    >({
      query: (params) => ({
        url: `${baseName}/all`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.ALL_DEPARTMENTS }],
    }),
    getAllUnpaginatedDepartments: builder.query<
      Response<IDepartmentProps[]>,
      {
        businessUnitId?: string;
      }
    >({
      query: (params) => ({
        url: `${baseName}/unpaginated`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.ALL_UNPAGINATED_DEPARTMENTS }],
    }),
    createDepartment: builder.mutation<
      Response<IDepartmentProps>,
      ICreateDepartmentPayload
    >({
      query: (payload) => ({
        url: `${baseName}/update`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: [
        { type: tagTypes.ALL_DEPARTMENTS },
        { type: tagTypes.ALL_UNPAGINATED_DEPARTMENTS },
      ],
    }),
    updateDepartment: builder.mutation<
      Response<IDepartmentProps>,
      IEditDepartmentPayload
    >({
      query: (payload) => ({
        url: `${baseName}/update`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: [
        { type: tagTypes.ALL_UNPAGINATED_DEPARTMENTS },
        { type: tagTypes.ALL_DEPARTMENTS },
      ],
    }),
    deleteDepartment: builder.mutation<Response, string>({
      query: (id) => ({
        url: `${baseName}/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: tagTypes.ALL_DEPARTMENTS },
        { type: tagTypes.ALL_UNPAGINATED_DEPARTMENTS },
      ],
    }),
    getDepartmentExcelTemplate: builder.mutation<Blob, void>({
      query: () => ({
        url: `${baseName}/excel`,
        method: "GET",
        responseType: "blob", 
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
        },
      }),
    }),
    importDepartment: builder.mutation<Response<IDepartmentProps>, FormData>({
      query: (payload) => ({
        url: `${baseName}/upload`,
        method: "POST",
        data: payload,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: [
        { type: tagTypes.ALL_DEPARTMENTS },
        { type: tagTypes.ALL_UNPAGINATED_DEPARTMENTS },
      ],
    })
  }),
});

export const {
  useGetAllDepartmentsQuery,
  useGetAllUnpaginatedDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDepartmentExcelTemplateMutation,
  useImportDepartmentMutation,
} = authApi;
