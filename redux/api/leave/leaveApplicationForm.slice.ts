import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ApplyForLeaveFormData } from "@/app/staff/leave/(leave-application-group)/apply/components/ApplyForLeaveForm";

export interface ModifiedApplyForLeaveFormData
  extends Omit<
    ApplyForLeaveFormData,
    "medicalCertificate" | "sickCertificate" | "examinationTimeTable"
  > {
  medicalCertificate?: string;
  sickCertificate?: string;
  examinationTimeTable?: string;
}

interface LeaveApplicationState {
  leaveApplication: ModifiedApplyForLeaveFormData | null;
}

const initialState: LeaveApplicationState = {
  leaveApplication: null,
};

const leaveApplicationSlice = createSlice({
  name: "leaveApplication",
  initialState,
  reducers: {
    setLeaveApplication: (
      state,
      action: PayloadAction<ModifiedApplyForLeaveFormData>,
    ) => {
      state.leaveApplication = action.payload;
    },
    resetLeaveApplication: (state) => {
      state.leaveApplication = null;
    },
  },
});

export const { setLeaveApplication, resetLeaveApplication } =
  leaveApplicationSlice.actions;
export default leaveApplicationSlice.reducer;
