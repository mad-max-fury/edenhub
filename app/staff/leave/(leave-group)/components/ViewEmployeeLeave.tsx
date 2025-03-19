"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Badge,
  Button,
  ConfirmationModal,
  Jumbotron,
  Modal,
  NetworkError,
  notify,
  PageHeader,
  PageLoader,
  RowView,
  Typography,
} from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import {
  useApproveOrRejectLeaveApplictionMutation,
  useGetLeaveApplicationDetailsQuery,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import {
  formatDate,
  getLeaveApprovalStatusBadgeVariant,
} from "@/utils/helpers";

import { Breadcrumbs } from "@/components/breadCrumbs/breadCrumbs";

import { RejectLeaveApplication } from "./RejectLeaveApplication";

interface IComponentProps {
  id: string;
  staff: "hod" | "supervisor";
}
export const ViewEmployeeLeave = ({ id, staff }: IComponentProps) => {
  const [open, setOpen] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const { data, isLoading, isFetching, refetch, error } =
    useGetLeaveApplicationDetailsQuery({
      leaveId: id,
    });
  const [approveOrReject, { isLoading: isUpdating }] =
    useApproveOrRejectLeaveApplictionMutation();
  const history = useRouter();

  const leaveDetails = data?.data;

  const CRUMBS = [
    {
      name: staff === "hod" ? "My Team" : "My Direct Reports",
      path:
        staff === "hod"
          ? AuthRouteConfig.STAFF_LEAVE_MY_TEAMS
          : AuthRouteConfig.STAFF_LEAVE_MY_DIRECT_REPORT,
    },
    {
      name: leaveDetails?.employeeName ?? "",
      path: AuthRouteConfig.STAFF_LEAVE_MY_DIRECT_REPORT,
    },
  ];
  const approveAction = () => {
    approveOrReject({ leaveId: leaveDetails?.leaveId ?? "", status: true })
      .unwrap()
      .then(() => {
        notify.success({
          message: `Approved Successfully`,
          subtitle: `You have successfully approved ${leaveDetails?.employeeName}'s leave!`,
        });
        setOpen(false);
        history.push(AuthRouteConfig.STAFF_LEAVE_MY_DIRECT_REPORT);
      })
      .catch((err: IApiError) => {
        notify.error({
          message: "Approval failed",
          subtitle: getErrorMessage(err),
        });
      });
  };
  if (isLoading) return <PageLoader />;
  if (error)
    return (
      <NetworkError
        error={error as IApiError}
        isFetching={isFetching}
        refetch={refetch}
      />
    );
  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-[36px]">
      <ConfirmationModal
        isOpen={open}
        closeModal={() => setOpen(false)}
        handleClick={approveAction}
        formTitle="Confirm Approval"
        message={
          <p>
            Are you sure you want to approve this leave application? This action
            cannot be undone.
          </p>
        }
        isLoading={isUpdating}
        type="confirm"
        buttonLabel="Submit"
      />
      <Modal
        isOpen={openReject}
        closeModal={() => setOpenReject(false)}
        title="Reject Leave Request"
        mobileLayoutType="full"
      >
        <RejectLeaveApplication
          editData={leaveDetails ?? null}
          closeModal={() => setOpenReject(false)}
        />
      </Modal>
      <div className="ml-auto mt-6 flex w-full max-w-[865px] items-center gap-6">
        <Avatar
          fullname={leaveDetails?.employeeName ?? ""}
          size={"xxl"}
          src={leaveDetails?.profilePicture ?? ""}
          colorStyles={{ textColor: "N0", bgColor: "R400" }}
        />
        <div className="ml-auto flex max-w-[744px] flex-1 flex-col">
          <div className="flex w-full items-center justify-between">
            <div>
              <Breadcrumbs crumbs={CRUMBS} />
              <div className="my-1.5">
                <PageHeader title={leaveDetails?.employeeName} />
              </div>
              <div className="mb-3 flex items-center gap-2">
                <Typography
                  variant="p-s"
                  gutterBottom
                  color="N500"
                  className="mb-0"
                >
                  {`Type of Leave: ${leaveDetails?.leaveType}`}
                </Typography>
                <Badge
                  variant={getLeaveApprovalStatusBadgeVariant(
                    leaveDetails?.approval ?? "Pending",
                  )}
                  text={leaveDetails?.approval ?? "Pending"}
                />
              </div>
            </div>
          </div>
          <hr />
        </div>
      </div>
      <div className="sticky top-[100px] ml-auto w-full max-w-[744px]">
        <Jumbotron
          headerText="Leave Application Form"
          footerContent={
            leaveDetails?.approval === "Pending" && staff !== "hod" ? (
              <div className="flex items-center gap-2">
                <Button
                  disabled={isLoading}
                  variant="secondary"
                  onClick={() => setOpenReject(true)}
                >
                  Reject
                </Button>
                <Button variant="primary" onClick={() => setOpen(true)}>
                  Approve
                </Button>
              </div>
            ) : null
          }
        >
          <div className="flex flex-col gap-[18px] px-4">
            <RowView
              align="start"
              name={"Total leave being taken"}
              value={
                leaveDetails?.numberOfDays &&
                `${leaveDetails?.numberOfDays} ${leaveDetails?.numberOfDays < 1 ? "day" : "days"}`
              }
            />
            <RowView
              align="start"
              name={"Relief staff"}
              value={leaveDetails?.reliefStaff ?? "-"}
            />
            <RowView
              align="start"
              name={"Leave duration"}
              value={
                <Typography variant="h-s" color={"text-light"}>
                  {formatDate(leaveDetails?.from ?? "")} -{" "}
                  {formatDate(leaveDetails?.to ?? "")}
                </Typography>
              }
            />{" "}
            <RowView
              align="start"
              name={"Contact address during leave"}
              value={leaveDetails?.leaveContactAddress}
            />{" "}
            <RowView
              align="start"
              name={"Phone number during leave"}
              value={leaveDetails?.leavePhoneNumber}
            />{" "}
            <RowView
              align="start"
              name={"Alternative contact person while on leave"}
              value={leaveDetails?.alternateContactPerson}
            />{" "}
            <RowView
              align="start"
              name={"Address"}
              value={leaveDetails?.alternateContactPersonAddress}
            />
            <RowView
              align="start"
              name={"Phone number "}
              value={leaveDetails?.leavePhoneNumber}
            />{" "}
            <RowView
              align="start"
              name={"Email address of contact person"}
              value={
                leaveDetails?.alternateContactPersonEmail !== null
                  ? leaveDetails?.alternateContactPersonEmail
                  : "-"
              }
            />{" "}
            <RowView
              align="start"
              name={"Type of leave"}
              value={leaveDetails?.leaveType}
            />{" "}
            <RowView
              align="start"
              name={"Pay leave allowance"}
              value={leaveDetails?.payLeaveAllowance ? "Yes" : "No"}
            />{" "}
            <RowView
              align="start"
              name={"Supervisor"}
              value={leaveDetails?.supervisor}
            />
            <RowView align="start" name={"H.O.D"} value={leaveDetails?.hod} />
            {/* <RowView
            name={"Marriage Certificate"}
            value={
              <div className="max-w-[349px]">
                <DocumentViewer
                  name="Marriage.png"
                  link={personalData?.marriageCertificate ?? ""}
                />
              </div>
            }
          /> */}
          </div>
        </Jumbotron>
      </div>
    </div>
  );
};
