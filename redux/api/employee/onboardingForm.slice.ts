import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  IAttestationProps,
  IDocumentResponse,
  IIDCardProps,
} from "./interface";

interface FormState {
  idCardForm: IIDCardProps | null;
  attestation: IAttestationProps | null;
  referenceForm: IAttestationProps | null;
  document: IDocumentResponse | null;
}

const initialState: FormState = {
  idCardForm: null,
  attestation: null,
  referenceForm: null,
  document: null,
};

const onboardingForm = createSlice({
  name: "id-card",
  initialState,
  reducers: {
    initIDCardForm: (state, action: PayloadAction<IIDCardProps>) => {
      state.idCardForm = action.payload;
    },
    setAttestationState: (state, action: PayloadAction<IAttestationProps>) => {
      state.attestation = action.payload;
    },
    setReferenceFormState: (
      state,
      action: PayloadAction<IAttestationProps>,
    ) => {
      state.attestation = action.payload;
    },
    setInitDocumentState: (state, action: PayloadAction<IDocumentResponse>) => {
      state.document = action.payload;
    },
  },
});

export const { initIDCardForm, setAttestationState, setInitDocumentState } =
  onboardingForm.actions;
export default onboardingForm.reducer;
