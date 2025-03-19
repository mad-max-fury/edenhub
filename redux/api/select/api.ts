import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";



import { IBank, ISelectResponse } from "./interface";


const baseName = "/select";
const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllGenders: builder.query<Response<ISelectResponse[]>, void>({
      query: () => ({
        url: `${baseName}/genders`,
        method: "GET",
      }),
    }),
    getAllMaritalStatuses: builder.query<Response<ISelectResponse[]>, void>({
      query: () => ({
        url: `${baseName}/marital-statuses`,
        method: "GET",
      }),
    }),
    getStatuses: builder.query<Response<ISelectResponse[]>, void>({
      query: () => ({
        url: `${baseName}/employee-enrollment-statuses`,
        method: "GET",
      }),
    }),
    getEmploymentTypes: builder.query<Response<ISelectResponse[]>, void>({
      query: () => ({
        url: `${baseName}/employment-types`,
        method: "GET",
      }),
    }),
    getRequiredDocsTypes: builder.query<Response<ISelectResponse[]>, void>({
      query: () => ({
        url: `${baseName}/required-documents`,
        method: "GET",
      }),
    }),
    getRequiredFormTypes: builder.query<Response<ISelectResponse[]>, void>({
      query: () => ({
        url: `${baseName}/required-forms`,
        method: "GET",
      }),
    }),
    getAllReligions: builder.query<Response<ISelectResponse[]>, void>({
      query: () => ({
        url: `${baseName}/religions`,
        method: "GET",
      }),
    }),
    getAllRelationships: builder.query<Response<ISelectResponse[]>, void>({
      query: () => ({
        url: `${baseName}/relationships`,
        method: "GET",
      }),
    }),
    getAllDependants: builder.query<Response<ISelectResponse[]>, void>({
      query: () => ({
        url: `${baseName}/dependents`,
        method: "GET",
      }),
    }),
    getAllQualifications: builder.query<Response<ISelectResponse[]>, void>({
      query: () => ({
        url: `${baseName}/qualificatons`,
        method: "GET",
      }),
    }),
    getAllBanks: builder.query<Response<IBank[]>, void>({
      query: () => ({
        url: `${baseName}/get-banks`,
        method: "GET",
      }),
    }),
    getAllPensionFundAdministrators: builder.query<
      Response<ISelectResponse[]>,
      void
    >({
      query: () => ({
        url: `${baseName}/pension-fund-administrators`,
        method: "GET",
      }),
    }),
    getAllYears: builder.query<Response<ISelectResponse[]>, void>({
      query: () => ({
        url: `${baseName}/years`,
        method: "GET",
      }),
    }),
    getLeaveCategory: builder.query<Response<ISelectResponse[]>, void>({
      query: () => ({
        url: `${baseName}/leave-types`,
        method: "GET",
      }),
    }),
    getLeaveDaysOptions: builder.query<Response<ISelectResponse[]>, void>({
      query: () => ({
        url: `${baseName}/leave-days-options`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllGendersQuery,
  useGetAllMaritalStatusesQuery,
  useGetStatusesQuery,
  useGetEmploymentTypesQuery,
  useGetRequiredDocsTypesQuery,
  useGetRequiredFormTypesQuery,
  useGetAllReligionsQuery,
  useGetAllRelationshipsQuery,
  useGetAllDependantsQuery,
  useGetAllQualificationsQuery,
  useGetAllBanksQuery,
  useGetAllPensionFundAdministratorsQuery,
  useGetAllYearsQuery,
  useGetLeaveCategoryQuery,
  useGetLeaveDaysOptionsQuery
} = authApi;