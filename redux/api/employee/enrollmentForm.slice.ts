import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  IBasicInformationFormData,
  IEmploymentDetailsFormData,
  IEmploymentTypeFormData,
  IEnrollmentReviwerFormData,
  IOnboardingSetupFormData,
} from "@/app/staff/employee-management/enrollment/enroll/components";

import { OnboardingDocEnum, OnboardingEnum } from "../interface";
import {
  IGetEmployeeEnrollmentRes,
  RequiredDocument,
  RequiredForm,
} from "./interface";

interface FormState {
  basicInformation: IBasicInformationFormData | null;
  employmentDetailsFormData: IEmploymentDetailsFormData | null;
  employmentTypeFormData: IEmploymentTypeFormData | null;
  onboardingSetupFormData: IOnboardingSetupFormData | null;
  enrollmentReviewerFormData: IEnrollmentReviwerFormData | null;
  employeeId: string | null;
}

const initialState: FormState = {
  employeeId: null,
  basicInformation: null,
  employmentDetailsFormData: null,
  employmentTypeFormData: null,
  enrollmentReviewerFormData: null,
  onboardingSetupFormData: {
    requiredDocument: [OnboardingDocEnum.CV.toString()],
    requiredForm: [
      OnboardingEnum.BIO_DATA.toString(),
      OnboardingEnum.DOCUMENTS.toString(),
      OnboardingEnum.INTEGRATION.toString(),
      OnboardingEnum.ID_CARD.toString(),
    ],
  },
};

const enrollmentFormSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setBasicInformation: (
      state,
      action: PayloadAction<IBasicInformationFormData>,
    ) => {
      state.basicInformation = action.payload;
    },
    setEmploymentDetails: (
      state,
      action: PayloadAction<IEmploymentDetailsFormData>,
    ) => {
      state.employmentDetailsFormData = action.payload;
    },
    setEmploymentType: (
      state,
      action: PayloadAction<IEmploymentTypeFormData>,
    ) => {
      state.employmentTypeFormData = action.payload;
    },
    setOnboardingSetup: (
      state,
      action: PayloadAction<IOnboardingSetupFormData>,
    ) => {
      state.onboardingSetupFormData = action.payload;
    },
    setEmployeeId: (state, action: PayloadAction<string>) => {
      state.employeeId = action.payload;
    },
    setEnrollmentReviewer: (
      state,
      action: PayloadAction<IEnrollmentReviwerFormData>,
    ) => {
      state.enrollmentReviewerFormData = action.payload;
    },
    setEnrollmentData: (
      state,
      action: PayloadAction<IGetEmployeeEnrollmentRes>,
    ) => {
      const {
        employeeBioData,
        employmentDetails,
        employmentType,
        requiredDocuments,
        requiredForms,
      } = action.payload;

      if (employeeBioData?.basicInformation) {
        state.basicInformation = {
          firstName: employeeBioData.basicInformation.firstname || "",
          lastName: employeeBioData.basicInformation.lastname || "",
          middleName: employeeBioData.basicInformation.middlename || undefined,
          email: employeeBioData.basicInformation.email || "",
        };
      }
      if (employmentDetails) {
        state.employmentDetailsFormData = {
          jobTitleId: employmentDetails.jobTitleId || "",
          jobDesignationId: employmentDetails.jobDesignationId || "",
          companyId: employmentDetails.companyId || "",
          locationId: employmentDetails.workLocationId || "",
          businessUnitId: employmentDetails.businessUnitId || "",
          departmentId: employmentDetails.departmentId || "",
          hireDate: employmentDetails.hireDate || "",
        };
      }
      if (employmentType) {
        state.employmentTypeFormData = {
          employmentType: employmentType.employmentTypeId || "",
        };
      }
      state.onboardingSetupFormData = {
        requiredDocument: requiredDocuments
          ? [
              ...(state.onboardingSetupFormData?.requiredDocument as string[]),
              ...requiredDocuments.map(
                (doc: RequiredDocument) => doc.requiredDocumentId,
              ),
            ]
          : [],
        requiredForm: requiredForms
          ? [
              ...(state.onboardingSetupFormData?.requiredForm as string[]),
              ...requiredForms.map((form: RequiredForm) => form.requiredFormId),
            ]
          : [],
      };
    },

    resetState: (state) => {
      state.basicInformation = null;
      state.employmentDetailsFormData = null;
      state.employmentTypeFormData = null;
      state.enrollmentReviewerFormData = null;
      state.onboardingSetupFormData = {
        requiredDocument: [OnboardingDocEnum.CV.toString()],
        requiredForm: [
          OnboardingEnum.BIO_DATA.toString(),
          OnboardingEnum.DOCUMENTS.toString(),
          OnboardingEnum.INTEGRATION.toString(),
          OnboardingEnum.ID_CARD.toString(),
        ],
      };
      state.employeeId = null;
    },
  },
});

export const {
  setBasicInformation,
  setEmploymentDetails,
  setEmploymentType,
  setOnboardingSetup,
  setEmployeeId,
  setEnrollmentData,
  setEnrollmentReviewer,
  resetState,
} = enrollmentFormSlice.actions;
export default enrollmentFormSlice.reducer;
