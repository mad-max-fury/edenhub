import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";

import { IEmployeeDashboard, IHRDashboardProps } from "./interface";

const baseName = "/dashboard";
const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeDashboard: builder.query<Response<IEmployeeDashboard>, void>({
      query: () => ({
        url: `${baseName}/employee-dashboard`,
        method: "GET",
      }),
      providesTags: [{ type: tagTypes.GET_DASHBOARD }],
    }),
    getHRDashboard: builder.query<Response<IHRDashboardProps>, void>({
      query: () => ({
        url: `${baseName}/hr-dashboard`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetEmployeeDashboardQuery, useGetHRDashboardQuery } = authApi;
