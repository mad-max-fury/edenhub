import React from "react";

import { Button } from "../buttons";
import { Modal } from "../modal/modal";

interface IConfirmationProps {
  isOpen: boolean;
  closeModal: () => void;
  formTitle: string;
  message: React.ReactElement;
  buttonLabel: string;
  handleClick: () => void;
  type: "delete" | "confirm";
  isLoading: boolean;
}
export const ConfirmationModal = ({
  isOpen = false,
  closeModal = () => {},
  formTitle,
  message,
  buttonLabel,
  handleClick = () => {},
  type,
  isLoading,
}: IConfirmationProps) => {
  return (
    <div>
      <Modal
        isOpen={isOpen}
        closeModal={closeModal}
        title={formTitle}
        mobileLayoutType="normal"
      >
        <div className="flex h-full flex-col justify-between">
          <div className="p-6">{message}</div>
          <div className="flex justify-end gap-2 border-t border-solid border-N40 bg-N0 px-6 py-4">
            <Button
              variant={"secondary"}
              type="button"
              className="msm:w-full"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              variant={type === "delete" ? "danger" : "primary"}
              className="msm:w-full"
              onClick={handleClick}
              loading={isLoading}
            >
              {buttonLabel}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
