import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";

import { IEmployeeLeaveProps } from "../dashboard";
import { IGetEmployeeLeavesRequest } from "../employee";
import { IPaginationQuery } from "../interface";
import {
  IApproveOrRejectLeavePayload,
  ICreateLeavePayload,
  IGetEmployeeLeaveItem,
  ILeaveProps,
  IPaginatedEmployeeLeavesResponse,
  IPaginatedLeaveTypesResponse,
  ISupervisorOrHODReposonse,
} from "./interface";

const baseName = "/leave";
const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createLeaveType: builder.mutation<
      Response<string>,
      Omit<ICreateLeavePayload, "leaveDaysOptionId"> & {
        leaveDaysOptionId: string;
      }
    >({
      query: (params) => ({
        url: `${baseName}/create-leave`,
        method: "POST",
        data: params,
      }),
      invalidatesTags: [{ type: tagTypes.LEAVE_TYPE }],
    }),
    updateLeaveType: builder.mutation<
      Response<string>,
      Omit<ICreateLeavePayload, "leaveDaysOptionId"> & {
        leaveDaysOptionId: string;
      }
    >({
      query: (params) => ({
        url: `${baseName}/update-leave`,
        method: "POST",
        data: params,
      }),
      invalidatesTags: [{ type: tagTypes.LEAVE_TYPE }],
    }),
    toggleLeaveType: builder.mutation<Response, string>({
      query: (id) => ({
        url: `${baseName}/toggle-leave`,
        method: "POST",
        params: {
          leaveId: id,
        },
      }),
      invalidatesTags: [{ type: tagTypes.LEAVE_TYPE }],
    }),
    getAllLeaveTypes: builder.query<
      Response<IPaginatedLeaveTypesResponse>,
      IPaginationQuery
    >({
      query: (params) => ({
        url: `${baseName}/paginated-leave`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.LEAVE_TYPE }],
    }),
    getLeaveDays: builder.query<
      Response<number>,
      {
        leaveTypeId: number;
        startDate: string;
        endDate: string;
      }
    >({
      query: (params) => ({
        url: `${baseName}/leave-days`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.LEAVE_DAYS }],
    }),
    getAllUnpaginatedLeaveTypes: builder.query<Response<ILeaveProps[]>, void>({
      query: () => ({
        url: `${baseName}/unpaginated-leave`,
        method: "GET",
      }),
      providesTags: [{ type: tagTypes.UNPAGINATED_LEAVE_TYPE }],
    }),
    deleteLeaveType: builder.mutation<Response, string>({
      query: (id) => ({
        url: `${baseName}/delete-leave`,
        method: "DELETE",
        params: {
          leaveId: id,
        },
      }),
      invalidatesTags: [{ type: tagTypes.LEAVE_TYPE }],
    }),
    getEmployeeLeave: builder.query<
      Response<IEmployeeLeaveProps>,
      {
        employeeId: string;
        yearId?: number;
      }
    >({
      query: (params) => ({
        url: `${baseName}/employee-leave`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.EMPLOYEE_LEAVE }],
    }),
    createEmpoyeeLeave: builder.mutation<Response<string>, FormData>({
      query: (params) => ({
        url: `${baseName}/create-employee-leave`,
        method: "POST",
        data: params,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: [
        { type: tagTypes.EMPLOYEE_LEAVE },
        { type: tagTypes.EMPLOYEE_LEAVE_APPLICATIONS },
      ],
    }),
    getEmployeeLeaveApplications: builder.query<
      Response<IPaginatedEmployeeLeavesResponse>,
      IGetEmployeeLeavesRequest
    >({
      query: (params) => ({
        url: `${baseName}/employee-leave-applications`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.EMPLOYEE_LEAVE_APPLICATIONS }],
    }),
    getLeaveApplicationDetails: builder.query<
      Response<IGetEmployeeLeaveItem>,
      {
        leaveId: string;
      }
    >({
      query: (params) => ({
        url: `${baseName}/get-leave-application-details`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.EMPLOYEE_LEAVE_DETAILS }],
    }),
    deleteEmployeeLeaveApplications: builder.mutation<Response, string>({
      query: (id) => ({
        url: `${baseName}/delete-employee-leave`,
        method: "DELETE",
        params: {
          leaveId: id,
        },
      }),
      invalidatesTags: [
        { type: tagTypes.EMPLOYEE_LEAVE },
        { type: tagTypes.EMPLOYEE_LEAVE_APPLICATIONS },
      ],
    }),
    getSupervisorAndHODStatus: builder.query<
      Response<ISupervisorOrHODReposonse>,
      {
        employeeId: string;
      }
    >({
      query: (params) => ({
        url: `${baseName}/check-hod-and-supervisor-status`,
        method: "GET",
        params,
      }),
    }),
    getDirectReportsLeaveApplications: builder.query<
      Response<IPaginatedEmployeeLeavesResponse>,
      IGetEmployeeLeavesRequest
    >({
      query: (params) => ({
        url: `${baseName}/supervisor-direct-leave-applications`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.DIRECT_REPORTS_LEAVE_APPLICATIONS }],
    }),
    getTeamLeaveApplications: builder.query<
      Response<IPaginatedEmployeeLeavesResponse>,
      IGetEmployeeLeavesRequest
    >({
      query: (params) => ({
        url: `${baseName}/hod-direct-leave-applications`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.TEAM_LEAVE_APPLICATIONS }],
    }),
    approveOrRejectLeaveAppliction: builder.mutation<
      Response,
      IApproveOrRejectLeavePayload
    >({
      query: (payload) => ({
        url: `${baseName}/approve-or-reject-employee-leave`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [
        { type: tagTypes.DIRECT_REPORTS_LEAVE_APPLICATIONS },
        { type: tagTypes.TEAM_LEAVE_APPLICATIONS },
        { type: tagTypes.EMPLOYEE_LEAVE_DETAILS },
      ],
    }),
  }),
});

export const {
  useCreateLeaveTypeMutation,
  useUpdateLeaveTypeMutation,
  useToggleLeaveTypeMutation,
  useGetAllLeaveTypesQuery,
  useGetAllUnpaginatedLeaveTypesQuery,
  useDeleteLeaveTypeMutation,
  useGetEmployeeLeaveQuery,
  useCreateEmpoyeeLeaveMutation,
  useGetEmployeeLeaveApplicationsQuery,
  useDeleteEmployeeLeaveApplicationsMutation,
  useGetLeaveApplicationDetailsQuery,
  useLazyGetLeaveApplicationDetailsQuery,
  useGetSupervisorAndHODStatusQuery,
  useGetDirectReportsLeaveApplicationsQuery,
  useGetTeamLeaveApplicationsQuery,
  useApproveOrRejectLeaveApplictionMutation,
  useGetLeaveDaysQuery,
} = authApi;
