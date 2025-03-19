import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";

import { IPaginationQuery } from "../interface";
import {
  IAddUserToRoleProps,
  ICreateRoleProps,
  ICreatUserClaimProps,
  IEditRoleProps,
  IMenuClaimsProps,
  IPaginatedRolesResponse,
  IPermissionsProps,
  IRolesProps,
} from "./interface";

const baseName = "/roleClaims";
const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllRoles: builder.query<
      Response<IPaginatedRolesResponse>,
      IPaginationQuery
    >({
      query: (params) => ({
        url: `${baseName}/roles`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.ALL_ROLES }],
    }),
    getAllUnpaginatedRoles: builder.query<Response<IRolesProps[]>, void>({
      query: () => ({
        url: `${baseName}/roles-unpaginated`,
        method: "GET",
      }),
    }),
    createRole: builder.mutation<Response<IRolesProps>, ICreateRoleProps>({
      query: (payload) => ({
        url: `${baseName}/create-role`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [{ type: tagTypes.ALL_ROLES }],
    }),
    updateRole: builder.mutation<Response<IRolesProps>, IEditRoleProps>({
      query: (payload) => {
        return {
          url: `${baseName}/update-role-claims`,
          method: "POST",
          data: payload,
        };
      },
      invalidatesTags: [
        { type: tagTypes.ALL_ROLES },
        { type: tagTypes.ALL_ROLE_CLAIMS },
      ],
    }),
    deleteRole: builder.mutation<Response, IPermissionsProps>({
      query: (payload) => ({
        url: `${baseName}/role`,
        method: "DELETE",
        data: payload,
      }),
      invalidatesTags: [{ type: tagTypes.ALL_ROLES }],
    }),
    getAllAssginableMenuCLaims: builder.query<
      Response<IMenuClaimsProps[]>,
      void
    >({
      query: () => ({
        url: `${baseName}/all-menu-claims`,
        method: "GET",
      }),
    }),
    getAllAssginableClaims: builder.query<Response<IPermissionsProps[]>, void>({
      query: () => ({
        url: `${baseName}/permissions`,
        method: "GET",
      }),
    }),
    getRoleClaims: builder.query<
      Response<IMenuClaimsProps[]>,
      { role: string }
    >({
      query: (params) => ({
        url: `${baseName}/get-role-claims`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.ALL_ROLE_CLAIMS }],
    }),
    addUserToRole: builder.mutation<Response<IRolesProps>, IAddUserToRoleProps>(
      {
        query: (params) => ({
          url: `${baseName}/add-user-to-role`,
          method: "POST",
          params,
        }),
        invalidatesTags: [{ type: tagTypes.ALL_USERS }],
      },
    ),
    getAllUserMenuClaims: builder.query<
      Response<IMenuClaimsProps[]>,
      { userId: string }
    >({
      query: (params) => ({
        url: `${baseName}/all-user-menu-claims`,
        method: "GET",
        params,
      }),
    }),
    updateUserClaims: builder.mutation<Response, ICreatUserClaimProps>({
      query: (payload) => ({
        url: `${baseName}/update-user-claims/${payload.userId}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: [
        { type: tagTypes.ALL_USERS },
        { type: tagTypes.ALL_ROLE_CLAIMS },
      ],
    }),
  }),
});

export const {
  useGetAllRolesQuery,
  useGetAllUnpaginatedRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetAllAssginableMenuCLaimsQuery,
  useGetAllAssginableClaimsQuery,
  useGetRoleClaimsQuery,
  useAddUserToRoleMutation,
  useGetAllUserMenuClaimsQuery,
  useUpdateUserClaimsMutation,
} = authApi;
