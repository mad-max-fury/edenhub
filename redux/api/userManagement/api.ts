import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";

import {
  IAllUsersQuery,
  IPaginatedUsersResponse,
  IUserResponse,
} from "./interface";

const baseName = "/userManagement";
const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaffProfile: builder.query<Response<IUserResponse>, void>({
      query: () => ({
        url: `${baseName}/staff`,
        method: "GET",
      }),
      providesTags: [{ type: tagTypes.GET_USER }],
    }),
    getAllUsers: builder.query<
      Response<IPaginatedUsersResponse>,
      IAllUsersQuery
    >({
      query: (params) => ({
        url: `${baseName}/all-users`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.ALL_USERS }],
    }),
    getStaffProfileById: builder.query<
      Response<IUserResponse>,
      {
        userId: string;
      }
    >({
      query: (params) => ({
        url: `${baseName}/staff`,
        method: "GET",
        params,
      }),
    }),
  }),
});

export const {
  useGetStaffProfileQuery,
  useGetAllUsersQuery,
  useLazyGetAllUsersQuery,
  useGetStaffProfileByIdQuery,
} = authApi;
