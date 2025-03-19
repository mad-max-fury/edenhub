import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";

import { IPaginationQuery } from "../interface";
import {
  IAddMenuToClaimPayload,
  ICreateMenuPayload,
  IDeleteMenuClaimsPayload,
  IEditMenuPayload,
  IMenuClaimsQuery,
  IMenuProps,
  IPaginatedMenuClaimsResponse,
  IPaginatedMenusResponse,
} from "./interface";

const baseName = "/menus";
const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMenus: builder.query<
      Response<IPaginatedMenusResponse>,
      IPaginationQuery
    >({
      query: (params) => ({
        url: `${baseName}/menus`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.ALL_MENUS }],
    }),
    getAllUnpaginatedMenus: builder.query<Response<IMenuProps[]>, void>({
      query: () => ({
        url: `${baseName}/unpaginated`,
        method: "GET",
      }),
      providesTags: [{ type: tagTypes.ALL_UNPAGINATED_MENUS }],
    }),
    createMenu: builder.mutation<Response<IMenuProps>, ICreateMenuPayload>({
      query: (payload) => ({
        url: `${baseName}/create-menu`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [
        { type: tagTypes.ALL_MENUS },
        { type: tagTypes.ALL_UNPAGINATED_MENUS },
      ],
    }),
    updateMenu: builder.mutation<Response<IMenuProps>, IEditMenuPayload>({
      query: (payload) => ({
        url: `${baseName}/${payload.menuId}`,
        method: "PUT",
        data: { name: payload.name },
      }),
      invalidatesTags: [
        { type: tagTypes.ALL_UNPAGINATED_MENUS },
        { type: tagTypes.ALL_MENUS },
      ],
    }),
    deleteMenu: builder.mutation<Response, string>({
      query: (id) => ({
        url: `${baseName}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: tagTypes.ALL_MENUS },
        { type: tagTypes.ALL_UNPAGINATED_MENUS },
      ],
    }),
    getAllMenuClaims: builder.query<
      Response<IPaginatedMenuClaimsResponse>,
      IMenuClaimsQuery
    >({
      query: (params) => ({
        url: `${baseName}/menu-claims`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.ALL_MENU_CLAIMS }],
    }),
    addClaimToMenu: builder.mutation<Response, IAddMenuToClaimPayload>({
      query: (payload) => ({
        url: `${baseName}/add-claims-to-menu`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [{ type: tagTypes.ALL_MENU_CLAIMS }],
    }),
    deleteMenuClaim: builder.mutation<Response, IDeleteMenuClaimsPayload>({
      query: (params) => ({
        url: `${baseName}/remove-claim-from-menu`,
        method: "DELETE",
        params,
      }),
      invalidatesTags: [{ type: tagTypes.ALL_MENU_CLAIMS }],
    }),
  }),
});

export const {
  useGetAllMenusQuery,
  useLazyGetAllUnpaginatedMenusQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
  useGetAllMenuClaimsQuery,
  useAddClaimToMenuMutation,
  useDeleteMenuClaimMutation,
} = authApi;
