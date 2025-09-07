import { combineReducers } from "@reduxjs/toolkit";

import documentTemplateReducer from "./api/documentTemplate/document.slice";
import leaveApplicationFormReducer from "./api/leave/leaveApplicationForm.slice";
import { baseApi } from "./baseApi";

const reducers = {
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
