"use client";

import React, { useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  ButtonDropdown,
  ConfirmationModal,
  notify,
  PageHeader,
  Typography,
} from "@/components";
import {
  BasicInformation,
  useTriggerEmployeeEmploymentMutation,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import {
  EnrollmentDocumentStatus,
  EnrollmentStatusType,
} from "@/redux/api/interface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { getEnrollmentBadgeVariant } from "@/utils/helpers";

import { Breadcrumbs, Crumb } from "@/components/breadCrumbs/breadCrumbs";

const getDocBadgeVariant = (status: EnrollmentDocumentStatus) => {
  switch (status) {
    case "Pending":
      return "yellow";
    case "Approved":
      return "green";
    case "Rejected":
      return "red";
    default:
      return "blue";
  }
};

interface EmployeeProfileHeaderProps {
  basicInformation: BasicInformation;
  crumbs: Crumb[];
  variant?: "onboarding" | "formView";
  formType?: string;
  date?: string;
  formStatus?: EnrollmentDocumentStatus;
  enrollmentStatus?: EnrollmentStatusType;
  customBadge?: React.ReactNode;
  // status?:
  setShowApprovalModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowRejectModal?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EmployeeProfileHeader: React.FC<EmployeeProfileHeaderProps> = ({
  basicInformation,
  crumbs,
  variant = "onboarding",
  formType = "Bio Data",
  date = "2022-01-01",
  formStatus,
  enrollmentStatus = "Pending",
  setShowApprovalModal,
  setShowRejectModal,
  customBadge,
}) => {
  const [showSendReminderModal, setShowSendReminderModal] = useState(false);

  const status: EnrollmentStatusType = "Pending";

  const [triggerEmployeeEnrollment, { isLoading: isSendingRemainder }] =
    useTriggerEmployeeEmploymentMutation();

  const reminderAction = () => {
    if (basicInformation?.employeeId) {
      triggerEmployeeEnrollment({
        employeeId: basicInformation.employeeId,
        remainder: true,
      })
        .unwrap()
        .then(() => {
          notify.success({
            message: `Reminder Sent Successfully`,
            subtitle: `You have successfully reminded ${basicInformation.fullname} about their enrollment`,
          });
          setShowSendReminderModal(false);
        })
        .catch((err: IApiError) => {
          notify.error({
            message: "Remainder failed",
            subtitle: getErrorMessage(err),
          });
        });
    }
  };

  const renderModals = () => (
    <>
      <ConfirmationModal
        isOpen={showSendReminderModal}
        closeModal={() => setShowSendReminderModal(false)}
        handleClick={reminderAction}
        formTitle="Send Enrollment Reminder"
        message={
          <p>
            Are you sure you want to remind{" "}
            <span className="text-R400">{basicInformation?.firstname}</span>{" "}
            about their enrollment? This will send an email notification to the
            user. Do you wish to proceed?
          </p>
        }
        isLoading={isSendingRemainder}
        type="confirm"
        buttonLabel="Yes, Proceed"
      />
    </>
  );

  return (
    <>
      <div className="absolute">{renderModals()}</div>
      <div className="ml-auto mt-6 flex w-full max-w-[875px] items-center gap-4">
        <Avatar
          src={basicInformation?.profilePicture}
          fullname={basicInformation?.fullname}
          size="xxl"
        />
        <div className="ml-auto max-w-[744px] flex-1">
          <div className="mb-1">
            <Breadcrumbs crumbs={crumbs} />
          </div>
          <div className="mb-1">
            <PageHeader
              title={basicInformation?.fullname}
              buttonGroup={
                variant === "onboarding" ? (
                  <ButtonDropdown
                    colored
                    buttonGroup={[
                      {
                        name: "Send Reminder",
                        onClick: () => setShowSendReminderModal(true),
                      },
                    ]}
                  />
                ) : (
                  formStatus && (
                    <div className="flex items-center gap-2">
                      {formStatus === "Approved" ? (
                        <Button variant="primary">Approved</Button>
                      ) : (
                        <Button
                          variant="primary"
                          onClick={() => setShowApprovalModal?.(true)}
                        >
                          Approve
                        </Button>
                      )}
                      {formStatus === "Rejected" ? (
                        <Button variant={"danger"}>Rejected</Button>
                      ) : (
                        <Button
                          variant="secondary"
                          onClick={() => setShowRejectModal?.(true)}
                        >
                          Reject
                        </Button>
                      )}
                    </div>
                  )
                )
              }
            />
          </div>
          {variant === "onboarding" ? (
            <div className="mb-2 flex items-center gap-2">
              <Typography variant="p-s" color="N500">
                Onboarding
              </Typography>
              <Badge
                variant={getEnrollmentBadgeVariant(
                  enrollmentStatus ?? "Continue",
                )}
                text={status ?? "Continue"}
              />
            </div>
          ) : (
            <div className="mb-2 flex items-center gap-2">
              <Typography variant="p-s" color="N500">
                {formType}
              </Typography>
              {customBadge ?? (
                <Badge
                  variant={
                    formStatus && getDocBadgeVariant(formStatus ?? "Continue")
                  }
                  text={formStatus ?? "Continue"}
                />
              )}
              <div className="ml-2 flex items-center border-l border-solid border-N500 pl-2">
                <Typography variant="p-s" color="N500">
                  Submitted: {new Date(date).toDateString()}
                </Typography>
              </div>
            </div>
          )}
          <hr />
        </div>
      </div>
    </>
  );
};
