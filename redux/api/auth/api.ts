import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";

import {
  ICreateUserLoginPayload,
  ILoginPayload,
  ILoginUserResponse,
  IResetPasswordPayload,
  IVerifyUserResponse,
} from "./interface";

const baseName = "/authentication";
const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    verifyIfUser: builder.query<Response<IVerifyUserResponse>, string>({
      query: (email) => ({
        url: `${baseName}/verify-email?email=${email}`,
        method: "GET",
      }),
    }),
    login: builder.mutation<Response<ILoginUserResponse>, ILoginPayload>({
      query: (payload) => ({
        url: `${baseName}/login`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [
        { type: tagTypes.GET_DASHBOARD },
        { type: tagTypes.GET_USER },
      ],
    }),
    sendResetPassword: builder.mutation<Response, string>({
      query: (email) => ({
        url: `${baseName}/send-reset-password-mail`,
        method: "POST",
        params: { email },
      }),
    }),
    resetPassword: builder.mutation<Response, IResetPasswordPayload>({
      query: (payload) => ({
        url: `${baseName}/reset-password`,
        method: "POST",
        data: payload,
      }),
    }),
    createUserLogin: builder.mutation<Response, ICreateUserLoginPayload>({
      query: (payload) => ({
        url: `${baseName}/verify-user`,
        method: "POST",
        data: payload,
      }),
    }),
    toggleUserActivationStatus: builder.mutation<
      Response<string>,
      {
        userId: string;
      }
    >({
      query: (payload) => ({
        url: `${baseName}/toggle-user-activation-status`,
        method: "PUT",
        params: payload,
      }),
      invalidatesTags: [{ type: tagTypes.GET_EMPLOYEE_ENROLLMENT_LIST }],
    }),
  }),
});

export const {
  useVerifyIfUserQuery,
  useLazyVerifyIfUserQuery,
  useLoginMutation,
  useSendResetPasswordMutation,
  useResetPasswordMutation,
  useCreateUserLoginMutation,
  useToggleUserActivationStatusMutation,
} = authApi;
