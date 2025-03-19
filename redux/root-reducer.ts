import { combineReducers } from "@reduxjs/toolkit";

import documentTemplateReducer from "./api/documentTemplate/document.slice";
import bioDataFormReducer from "./api/employee/bioDataForm.slice";
import enrollmentFormReducer from "./api/employee/enrollmentForm.slice";
import onboardingFormReducer from "./api/employee/onboardingForm.slice";
import leaveApplicationFormReducer from "./api/leave/leaveApplicationForm.slice";
import { baseApi } from "./baseApi";

const reducers = {
  employeeEnrollmentForm: enrollmentFormReducer,
  bioDataForm: bioDataFormReducer,
  onboardingForm: onboardingFormReducer,
  documentTemplateForm: documentTemplateReducer,
  leaveApplicationForm: leaveApplicationFormReducer,
  [baseApi.reducerPath]: baseApi.reducer,
};

export const whitelist = [
  "employeeEnrollmentForm",
  "bioDataForm",
  "onboardingForm",
  "documentTemplateForm",
  "leaveApplicationForm",
];
export const combineReducer = combineReducers<typeof reducers>(reducers);
