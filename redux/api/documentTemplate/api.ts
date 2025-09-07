import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";

import { IPaginationQuery } from "../interface";
import {
  ICreateDocumntTemplatePayload,
  IDocumentTemplateProps,
  IPaginatedDocumntTemplateResponse,
} from "./interface";

const baseName = "/documentTemplate";
const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addOrUpdateDocumentTemplate: builder.mutation<
      Response<string>,
      ICreateDocumntTemplatePayload
    >({
      query: (params) => ({
        url: `${baseName}/add-or-update-document-template`,
        method: "POST",
        data: params,
      }),
      invalidatesTags: [{ type: tagTypes.DOCUMENT_TEMPLATE }],
    }),
    getDocumentTemplateById: builder.query<
      Response<IDocumentTemplateProps>,
      number
    >({
      query: (id) => ({
        url: `${baseName}/get-document-template`,
        method: "GET",
        params: {
          id,
        },
      }),
      providesTags: [{ type: tagTypes.DOCUMENT_TEMPLATE }],
    }),
    getAllDocumentTemplate: builder.query<
      Response<IPaginatedDocumntTemplateResponse>,
      IPaginationQuery
    >({
      query: (params) => ({
        url: `${baseName}/get-all-document-template`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.DOCUMENT_TEMPLATE }],
    }),
    getAllUnpaginatedDocumentTemplate: builder.query<
      Response<IDocumentTemplateProps[]>,
      void
    >({
      query: () => ({
        url: `${baseName}/get-unpaginated-document-template`,
        method: "GET",
      }),
      providesTags: [{ type: tagTypes.UNPAGINATED_DOCUMENT_TEMPLATE }],
    }),
    deleteDocumentTemplate: builder.mutation<Response, string>({
      query: (id) => ({
        url: `${baseName}/delete-document-template`,
        method: "DELETE",
        params: {
          id,
        },
      }),
      invalidatesTags: [{ type: tagTypes.DOCUMENT_TEMPLATE }],
    }),
  }),
});

export const {
  useAddOrUpdateDocumentTemplateMutation,
  useGetDocumentTemplateByIdQuery,
  useGetAllDocumentTemplateQuery,
  useGetAllUnpaginatedDocumentTemplateQuery,
  useDeleteDocumentTemplateMutation,
} = authApi;
