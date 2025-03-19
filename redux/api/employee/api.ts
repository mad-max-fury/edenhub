import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";

import { IUpdateInfoFormData } from "@/app/onboarding/update-info/components/UpdateInfoForm";
import {
  IBasicInformationFormData,
  IEmploymentDetailsFormData,
} from "@/app/staff/employee-management/enrollment/enroll/components";

import {
  IAcademicBackgroundPayload,
  IApproveOrReject,
  IAttestationPayload,
  IBankDetailsResponse,
  IDependantsApiPayload,
  IEmergencyContactPayload,
  IEmployeeDocuments,
  IEmployeeIntegrationFormPayload,
  IFormTemplateResponse,
  IGetEmployeeDirectoryRequest,
  IGetEmployeeDirectoryResponse,
  IGetEmployeeEmploymentInfoResponse,
  IGetEmployeeEnrollmentListRequest,
  IGetEmployeeEnrollmentListResponse,
  IGetEmployeeEnrollmentRes,
  INextOfKinPayload,
  IOnboardingTask,
  IProfessionalQualificatioPayload,
  IStaffCountResponse,
  ITaxAndPensionsPayload,
  ITrainingCertificationPayload,
  IUpdaterStaffIDProps,
  IWorkHistoryApiPayload,
} from "./interface";

const baseName = "/employee";
const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addOrUpdateEmployeeEnrollment: builder.mutation<
      Response<string>,
      IBasicInformationFormData & {
        employeeId?: string;
      }
    >({
      query: (payload) => ({
        url: `${baseName}/add-or-update-employee-enrollment`,
        method: "POST",
        data: payload,
      }),
    }),
    addOrUpdateEmployeeEmployementType: builder.mutation<
      Response<string>,
      {
        employeeId: string;
        employmentTypeId: string;
      }
    >({
      query: (payload) => ({
        url: `${baseName}/add-or-update-employee-employment-type`,
        method: "POST",
        data: payload,
      }),
    }),
    addEnrollmentReviewer: builder.mutation<
      Response<string>,
      { employeeId: string; reviewerUserId: string }
    >({
      query: (payload) => ({
        url: `${baseName}/add-or-update-enrollment-reviewer`,
        method: "PUT",
        data: payload,
      }),
    }),
    addOrUpdateEmployeeEmployementDetail: builder.mutation<
      Response<string>,
      IEmploymentDetailsFormData & {
        employeeId: string;
      }
    >({
      query: (payload) => ({
        url: `${baseName}/add-or-update-employee-employment-detail`,
        method: "POST",
        data: payload,
      }),
    }),
    addOrUpdateOldEmployeeEmployementDetail: builder.mutation<
      Response<string>,
      IUpdateInfoFormData & {
        employeeId: string;
        oldUser: boolean;
      }
    >({
      query: (payload) => ({
        url: `${baseName}/add-or-update-old-employee-employment-detail`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [
        { type: tagTypes.GET_EMPLOYEE_ONBOARDING_TASK_LIST },
        { type: tagTypes.ONBOARDING_TASKS },
      ],
    }),
    addOrUpdateEmployeeEmployementOnboardingSetup: builder.mutation<
      Response<string>,
      {
        employeeId: string;
        requiredDocument: { requiredDocumentId: number }[];
        requiredForm: { requiredFormId: number }[];
      }
    >({
      query: (payload) => ({
        url: `${baseName}/add-or-update-employee-employment-onboarding-setup`,
        method: "POST",
        data: payload,
      }),
    }),
    triggerEmployeeEmployment: builder.mutation<
      Response<string>,
      {
        employeeId: string;
        remainder?: boolean;
      }
    >({
      query: (params) => ({
        url: `${baseName}/trigger-employee-enrollment`,
        method: "POST",
        params: params,
      }),
    }),
    getEmployeeEnrollmentList: builder.query<
      Response<IGetEmployeeEnrollmentListResponse>,
      IGetEmployeeEnrollmentListRequest
    >({
      query: (params) => ({
        url: `${baseName}/get-employee-enrollment-list`,
        method: "GET",
        params,
      }),
      keepUnusedDataFor: 5,
      providesTags: [{ type: tagTypes.GET_EMPLOYEE_ENROLLMENT_LIST }],
    }),
    getEmployeeDirectory: builder.query<
      Response<IGetEmployeeDirectoryResponse>,
      IGetEmployeeDirectoryRequest
    >({
      query: (params) => ({
        url: `${baseName}/employee-directory`,
        method: "GET",
        params,
      }),
      keepUnusedDataFor: 5,
      providesTags: [{ type: tagTypes.GET_EMPLOYEE_DIRECTORY }],
    }),
    getEmployeeEmploymentInfo: builder.query<
      Response<IGetEmployeeEmploymentInfoResponse>,
      {
        employeeId: string;
      }
    >({
      query: ({ employeeId }) => ({
        url: `${baseName}/employee-profile-information/${employeeId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
      providesTags: [{ type: tagTypes.GET_EMPLOYEE_INFO }],
    }),
    getEmployeeEnrollment: builder.query<
      Response<IGetEmployeeEnrollmentRes>,
      string
    >({
      query: (employeeId) => ({
        url: `${baseName}/get-employee-enrollment`,
        method: "GET",
        params: { employeeId },
      }),
      providesTags: [{ type: tagTypes.GET_EMPLOYEE_ENROLLMENT_LIST }],
    }),
    deleteEmployee: builder.mutation<Response, string>({
      query: (id) => ({
        url: `${baseName}/delete-employee/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: tagTypes.GET_EMPLOYEE_ENROLLMENT_LIST }],
    }),
    withdrawEmployee: builder.mutation<Response, string>({
      query: (id) => ({
        url: `${baseName}/withdraw-employee-enrollment`,
        method: "POST",
        params: {
          employeeId: id,
        },
      }),
      invalidatesTags: [{ type: tagTypes.GET_EMPLOYEE_ENROLLMENT_LIST }],
    }),
    getOnboardingTask: builder.query<Response<IOnboardingTask[]>, string>({
      query: (empId) => ({
        url: `${baseName}/onboarding-tasks?EmployeeId=${empId}`,
        method: "GET",
      }),
      providesTags: [
        { type: tagTypes.GET_EMPLOYEE_ONBOARDING_TASK_LIST },
        { type: tagTypes.ONBOARDING_TASKS },
      ],
    }),
    getOnboardingTaskForOldUser: builder.query<
      Response<IOnboardingTask[]>,
      string
    >({
      query: (empId) => ({
        url: `${baseName}/onboarding-tasks?EmployeeId=${empId}&OldUser=true`,
        method: "GET",
      }),
      providesTags: [
        { type: tagTypes.GET_EMPLOYEE_ONBOARDING_TASK_LIST },
        { type: tagTypes.ONBOARDING_TASKS },
      ],
    }),
    acceptOrRejectEmployeeForm: builder.mutation<
      Response,
      { payload: IApproveOrReject; path: string }
    >({
      query: ({ payload, path = "accept-or-reject-employee-bio-data" }) => ({
        url: `${baseName}/${path}`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [
        { type: tagTypes.GET_EMPLOYEE_ENROLLMENT_LIST },
        { type: tagTypes.GET_EMPLOYEE_INFO },
        { type: tagTypes.GET_EMPLOYEE_ONBOARDING_TASK_LIST },
        { type: tagTypes.ONBOARDING_TASKS },
      ],
    }),
    updateEmployeePersonalData: builder.mutation<Response<string>, FormData>({
      query: (payload) => ({
        url: `${baseName}/update-employee-personal-data`,
        method: "PUT",
        data: payload,
        headers: { "Content-Type": "multipart/form-data" },
      }),
    }),
    updateEmployeeDependant: builder.mutation<
      Response<string>,
      IDependantsApiPayload
    >({
      query: (payload) => ({
        url: `${baseName}/add-or-update-employee-dependent`,
        method: "POST",
        data: payload,
      }),
    }),
    updateBankDetails: builder.mutation<Response<string>, IBankDetailsResponse>(
      {
        query: (payload) => ({
          url: `${baseName}/add-or-update-employee-bank-details`,
          method: "POST",
          data: payload,
        }),
      },
    ),
    updateEmployeeEmergencyContact: builder.mutation<
      Response<string>,
      IEmergencyContactPayload
    >({
      query: (payload) => ({
        url: `${baseName}/add-or-update-employee-emergency-contact`,
        method: "POST",
        data: payload,
      }),
    }),
    updateEmployeeNextOfKin: builder.mutation<
      Response<string>,
      INextOfKinPayload
    >({
      query: (payload) => ({
        url: `${baseName}/add-or-update-employee-next-of-kin`,
        method: "POST",
        data: payload,
      }),
    }),
    updateEmployeeEmploymentHistory: builder.mutation<
      Response<string>,
      IWorkHistoryApiPayload
    >({
      query: (payload) => ({
        url: `${baseName}/add-or-update-employee-employment-history`,
        method: "POST",
        data: payload,
      }),
    }),
    updateEmployeeAcademicBackground: builder.mutation<
      Response<string>,
      IAcademicBackgroundPayload
    >({
      query: (payload) => ({
        url: `${baseName}/add-or-update-employee-academic-background`,
        method: "POST",
        data: payload,
      }),
    }),
    updateEmployeeProfessionalQualification: builder.mutation<
      Response<string>,
      IProfessionalQualificatioPayload
    >({
      query: (payload) => ({
        url: `${baseName}/add-or-update-employee-professional-qualification`,
        method: "POST",
        data: payload,
      }),
    }),
    updateEmployeeTrainingCertification: builder.mutation<
      Response<string>,
      ITrainingCertificationPayload
    >({
      query: (payload) => ({
        url: `${baseName}/add-or-update-employee-training-certificate`,
        method: "POST",
        data: payload,
      }),
    }),
    updateEmployeeTaxAndPensions: builder.mutation<
      Response<string>,
      ITaxAndPensionsPayload
    >({
      query: (payload) => ({
        url: `${baseName}/add-or-update-employee-tax-and-pension`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [
        { type: tagTypes.ONBOARDING_TASKS },
        { type: tagTypes.GET_USER },
      ],
    }),
    updateOldEmployeeTaxAndPensions: builder.mutation<
      Response<string>,
      ITaxAndPensionsPayload
    >({
      query: (payload) => ({
        url: `${baseName}/add-or-update-employee-tax-and-pension`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [{ type: tagTypes.ONBOARDING_TASKS }],
    }),
    updateEmployeeIDCardForm: builder.mutation<Response<string>, FormData>({
      query: (payload) => ({
        url: `${baseName}/add-or-update-employee-passport-and-signature?employeeId=${payload.get("employeeId")}`,
        method: "PUT",
        data: payload,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: [{ type: tagTypes.ONBOARDING_TASKS }],
    }),
    updateEmployeeAttestationForm: builder.mutation<
      Response<string>,
      IAttestationPayload
    >({
      query: (payload) => ({
        url: `${baseName}/sign-employee-attestation`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [{ type: tagTypes.ONBOARDING_TASKS }],
    }),
    updateEmployeeIntegrationForm: builder.mutation<
      Response<string>,
      IEmployeeIntegrationFormPayload
    >({
      query: (payload) => ({
        url: `${baseName}/add-or-update-integration-form`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [{ type: tagTypes.ONBOARDING_TASKS }],
    }),
    updateEmployeeReferenceForm: builder.mutation<Response<string>, FormData>({
      query: (payload) => ({
        url: `${baseName}/add-or-update-employee-reference-form?employeeId=${payload.get("employeeId")}`,
        method: "POST",
        data: payload,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: [{ type: tagTypes.ONBOARDING_TASKS }],
    }),
    updateEmployeeGuarantorsForm: builder.mutation<Response<string>, FormData>({
      query: (payload) => ({
        url: `${baseName}/add-or-update-guarantor-form?employeeId=${payload.get("employeeId")}`,
        method: "POST",
        data: payload,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: [{ type: tagTypes.ONBOARDING_TASKS }],
    }),
    updateEmployeeDocuments: builder.mutation<Response<string>, FormData>({
      query: (payload) => ({
        url: `${baseName}/add-or-update-employee-document?employeeId=${payload.get("employeeId")}&requiredDocumentId=${payload.get("requiredDocumentId")}`,
        method: "POST",
        data: payload,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: [{ type: tagTypes.ONBOARDING_TASKS }],
    }),
    getStaffCount: builder.query<
      Response<IStaffCountResponse>,
      { companyId: string }
    >({
      query: (params) => ({
        url: `${baseName}/employment-type-count`,
        method: "GET",
        params,
      }),
    }),
    getFormTemplateUrl: builder.query<Response<IFormTemplateResponse>, string>({
      query: (id) => ({
        url: `${baseName}/form-url/${id}`,
        method: "GET",
      }),
    }),
    getEmployeeDocuments: builder.query<Response<IEmployeeDocuments>, string>({
      query: (id) => ({
        url: `${baseName}/get-employee-documents`,
        method: "GET",
        params: { employeeId: id },
      }),
    }),
    updateStaffID: builder.mutation<Response<string>, IUpdaterStaffIDProps>({
      query: (payload) => ({
        url: `${baseName}/update-employee-staff-id`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: [{ type: tagTypes.ALL_USERS }],
    }),
  }),
});

export const {
  useGetEmployeeEnrollmentListQuery,
  useLazyGetEmployeeEnrollmentQuery,
  useGetEmployeeEnrollmentQuery,
  useAddOrUpdateEmployeeEnrollmentMutation,
  useAddOrUpdateEmployeeEmployementTypeMutation,
  useAddOrUpdateEmployeeEmployementDetailMutation,
  useAddOrUpdateEmployeeEmployementOnboardingSetupMutation,
  useTriggerEmployeeEmploymentMutation,
  useWithdrawEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetOnboardingTaskQuery,
  useGetOnboardingTaskForOldUserQuery,
  useUpdateEmployeePersonalDataMutation,
  useGetEmployeeDirectoryQuery,
  useGetEmployeeEmploymentInfoQuery,
  useAcceptOrRejectEmployeeFormMutation,
  useUpdateEmployeeDependantMutation,
  useUpdateBankDetailsMutation,
  useUpdateEmployeeEmergencyContactMutation,
  useUpdateEmployeeNextOfKinMutation,
  useUpdateEmployeeEmploymentHistoryMutation,
  useUpdateEmployeeAcademicBackgroundMutation,
  useUpdateEmployeeProfessionalQualificationMutation,
  useUpdateEmployeeTrainingCertificationMutation,
  useUpdateEmployeeTaxAndPensionsMutation,
  useUpdateEmployeeIDCardFormMutation,
  useUpdateEmployeeAttestationFormMutation,
  useUpdateEmployeeIntegrationFormMutation,
  useUpdateEmployeeReferenceFormMutation,
  useUpdateEmployeeGuarantorsFormMutation,
  useUpdateEmployeeDocumentsMutation,
  useAddOrUpdateOldEmployeeEmployementDetailMutation,
  useUpdateOldEmployeeTaxAndPensionsMutation,
  useAddEnrollmentReviewerMutation,
  useGetStaffCountQuery,
  useLazyGetFormTemplateUrlQuery,
  useGetEmployeeDocumentsQuery,
  useUpdateStaffIDMutation,
} = authApi;
