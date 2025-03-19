"use client";

import { ConfirmationModal } from "@/components";
import { BasicInformation } from "@/redux/api";

export const AcceptForm = ({
  showApprovalModal,
  setShowApprovalModal,
  approvalAction,
  basicInformation,
  formType,
  isLaoding,
}: {
  showApprovalModal: boolean;
  setShowApprovalModal: (value: boolean) => void;
  approvalAction: () => void;
  basicInformation: BasicInformation;
  formType: string;
  isLaoding: boolean;
}) => {
  return (
    <ConfirmationModal
      isOpen={showApprovalModal}
      closeModal={() => setShowApprovalModal(false)}
      handleClick={approvalAction}
      formTitle={`Approve ${formType} `}
      message={
        <p>
          Are you sure you want to approve{" "}
          <b className="text-R400">{basicInformation?.fullname}</b>'s{" "}
          <b>{formType}</b>? This action cannot be undone.
        </p>
      }
      isLoading={isLaoding}
      type="confirm"
      buttonLabel="Yes, Approve"
    />
  );
};
