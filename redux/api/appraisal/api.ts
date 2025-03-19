import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";

import {
  IAppraisalCycleResponse,
  IAppraisalResultResponse,
  ICompanyYearlyResultProps,
  IDirectReportsQuery,
  IEmployeeYearlyResultResponse,
  IHODOrSupervisorQuery,
  IHODOrSupervisorResponse,
  IPaginatedDirectReportsResponse,
} from "./interface";

const baseName = "/appraisal";
const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAppraisalCycle: builder.query<
      Response<IAppraisalCycleResponse[]>,
      number
    >({
      query: (year) => ({
        url: `${baseName}/appraisal-cycles/${year}`,
        method: "GET",
      }),
    }),
    getAppraisalResult: builder.query<
      Response<IAppraisalResultResponse>,
      { appraisalId: string; employeeId: string }
    >({
      query: (params) => ({
        url: `${baseName}/get-appraisal-result`,
        method: "GET",
        params,
      }),
    }),
    getAppraiserOrHOD: builder.query<
      Response<IHODOrSupervisorResponse[]>,
      IHODOrSupervisorQuery
    >({
      query: (params) => ({
        url: `${baseName}/get-appraiser-or-hod`,
        method: "GET",
        params,
      }),
    }),
    getDirectReports: builder.query<
      Response<IPaginatedDirectReportsResponse>,
      IDirectReportsQuery
    >({
      query: (params) => ({
        url: `${baseName}/direct-reports`,
        method: "GET",
        params,
      }),
    }),
    getEmployeeYearlyAppraisalReult: builder.query<
      Response<IHODOrSupervisorResponse[]>,
      IDirectReportsQuery
    >({
      query: (params) => ({
        url: `${baseName}/direct-reports`,
        method: "GET",
        params,
      }),
    }),
    getCompanyYearlyAppraisalResults: builder.query<
      Response<ICompanyYearlyResultProps[]>,
      { year: number }
    >({
      query: (params) => ({
        url: `${baseName}/company-yearly-result`,
        method: "GET",
        params,
      }),
    }),
    getEmployeeYearlyAppraisalResults: builder.query<
      Response<IEmployeeYearlyResultResponse>,
      { year: number; employeeId: string }
    >({
      query: (params) => ({
        url: `${baseName}/get-yearly-appraisal-result`,
        method: "GET",
        params,
      }),
    }),
  }),
});

export const {
  useGetAppraisalCycleQuery,
  useGetAppraisalResultQuery,
  useGetAppraiserOrHODQuery,
  useGetDirectReportsQuery,
  useGetCompanyYearlyAppraisalResultsQuery,
  useGetEmployeeYearlyAppraisalResultsQuery,
} = authApi;
