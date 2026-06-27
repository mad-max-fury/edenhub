import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";

import {
  IForgotPasswordPayload,
  ILoginPayload,
  ILoginResponse,
  IResetPasswordPayload,
  ISignupPayload,
  IUser,
} from "./interface";

const baseName = "/auth";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<Response<IUser>, ISignupPayload>({
      query: (data) => ({
        url: `${baseName}/signup`,
        method: "POST",
        data,
      }),
    }),

    login: builder.mutation<Response<ILoginResponse>, ILoginPayload>({
      query: (data) => ({
        url: `${baseName}/login`,
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: tagTypes.GET_USER }],
    }),

    forgotPassword: builder.mutation<Response, IForgotPasswordPayload>({
      query: (data) => ({
        url: `${baseName}/forgot-password`,
        method: "POST",
        data,
      }),
    }),

    resetPassword: builder.mutation<Response, IResetPasswordPayload>({
      query: (data) => ({
        url: `${baseName}/reset-password`,
        method: "PATCH",
        data,
      }),
    }),

    getMe: builder.query<Response<IUser>, void>({
      query: () => ({
        url: `${baseName}/me`,
        method: "GET",
      }),
      providesTags: [{ type: tagTypes.GET_USER }],
    }),

    updateMe: builder.mutation<
      Response<IUser>,
      Partial<{
        firstName: string;
        lastName: string;
        phoneNumber: string;
        profilePicture: string;
        city: string;
        state: string;
        country: string;
      }>
    >({
      query: (data) => ({
        url: `${baseName}/me`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [{ type: tagTypes.GET_USER }],
    }),

    changePassword: builder.mutation<
      Response,
      { currentPassword: string; newPassword: string; confirmPassword: string }
    >({
      query: (data) => ({
        url: "/user/change-password",
        method: "PATCH",
        data,
      }),
    }),

    requestAccountDeletion: builder.mutation<Response<{ deletionRequestedAt: string }>, { reason?: string }>({
      query: (data) => ({ url: `${baseName}/me/delete`, method: "POST", data }),
      invalidatesTags: [{ type: tagTypes.GET_USER }],
    }),

    cancelAccountDeletion: builder.mutation<Response<{ cancelled: boolean }>, void>({
      query: () => ({ url: `${baseName}/me/delete/cancel`, method: "PATCH" }),
      invalidatesTags: [{ type: tagTypes.GET_USER }],
    }),

    verify2FA: builder.mutation<Response<ILoginResponse>, { email: string; code: string }>({
      query: (data) => ({ url: `${baseName}/2fa/verify`, method: "POST", data }),
    }),

    enableEmail2FA: builder.mutation<Response<{ enabled: boolean; method: string }>, void>({
      query: () => ({ url: `${baseName}/2fa/enable-email`, method: "POST" }),
      invalidatesTags: [{ type: tagTypes.GET_USER }],
    }),

    googleVerify: builder.mutation<Response<ILoginResponse>, { code: string }>({
      query: (data) => ({ url: `${baseName}/google/verify`, method: "POST", data }),
    }),

    setup2FA: builder.mutation<Response<{ secret: string; qrCodeUrl: string }>, void>({
      query: () => ({ url: `${baseName}/2fa/setup`, method: "POST" }),
    }),

    enable2FA: builder.mutation<Response<{ enabled: boolean }>, { token: string }>({
      query: (data) => ({ url: `${baseName}/2fa/enable`, method: "POST", data }),
      invalidatesTags: [{ type: tagTypes.GET_USER }],
    }),

    disable2FA: builder.mutation<Response<{ enabled: boolean }>, { token?: string }>({
      query: (data) => ({ url: `${baseName}/2fa/disable`, method: "POST", data }),
      invalidatesTags: [{ type: tagTypes.GET_USER }],
    }),

    getDeletionStatus: builder.query<Response<{
      requested: boolean;
      requestedAt?: string;
      reason?: string;
      scheduledDeletionDate?: string;
      daysRemaining?: number;
    }>, void>({
      query: () => ({ url: `${baseName}/me/delete/status`, method: "GET" }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useChangePasswordMutation,
  useRequestAccountDeletionMutation,
  useCancelAccountDeletionMutation,
  useGetDeletionStatusQuery,
  useVerify2FAMutation,
  useEnableEmail2FAMutation,
  useGoogleVerifyMutation,
  useSetup2FAMutation,
  useEnable2FAMutation,
  useDisable2FAMutation,
} = authApi;
