import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  ICreateDocumntTemplatePayload,
  IDocumentTemplateProps,
} from "./interface";

interface IFormState {
  documentTemplate: ICreateDocumntTemplatePayload | null;
}

const initialState: IFormState = {
  documentTemplate: null,
};

const documentTemplateFormSlice = createSlice({
  name: "documentTemplateForm",
  initialState,
  reducers: {
    setDocumentTemplateForm(
      state,
      action: PayloadAction<ICreateDocumntTemplatePayload>,
    ) {
      state.documentTemplate = action.payload;
    },
    clearDocumentTemplateForm(state) {
      state.documentTemplate = null;
    },
    initDocumentTemplateData: (
      state,
      action: PayloadAction<IDocumentTemplateProps>,
    ) => {
      state.documentTemplate = { ...action.payload };
    },
  },
});

export const {
  setDocumentTemplateForm,
  clearDocumentTemplateForm,
  initDocumentTemplateData,
} = documentTemplateFormSlice.actions;
export default documentTemplateFormSlice.reducer;
