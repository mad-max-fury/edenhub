"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Button,
  Jumbotron,
  Modal,
  notify,
  PageHeader,
  RowView,
  TextField,
  Typography,
} from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { UserContext } from "@/layouts/appLayout";
import { RootState } from "@/redux";
import { IApiError } from "@/redux/api/genericInterface";
import {
  ICreateEmployeeLeavePayload,
  useCreateEmpoyeeLeaveMutation,
} from "@/redux/api/leave";
import base64ToFile from "@/utils/decodeImageFromBase64";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { formatDate, objectToFormData } from "@/utils/helpers";
import { useSelector } from "react-redux";

import { Breadcrumbs } from "@/components/breadCrumbs/breadCrumbs";

const CRUMBS = [
  { name: "Leave", path: AuthRouteConfig.STAFF_LEAVE_OVERVIEW },
  {
    name: "Leave Application Form",
    path: AuthRouteConfig.STAFF_LEAVE_APPLY,
  },
  {
    name: "Preview",
    path: AuthRouteConfig.STAFF_LEAVE_APPLY_PREVIEW,
  },
];

const LeaveApplicationPreview = () => {
  const router = useRouter();
  const user = useContext(UserContext);
  const { leaveApplication } = useSelector(
    (state: RootState) => state.leaveApplicationForm,
  );
  const [createEmployeeLeave, { isLoading }] = useCreateEmpoyeeLeaveMutation();
  const fullname = `${user?.user?.firstname} ${user?.user?.lastname}`;
  const [openSign, setOpenSign] = useState(false);
  const [name, setName] = useState("");

  const onSubmit = async () => {
    if (leaveApplication) {
      const {
        medicalCertificate,
        sickCertificate,
        examinationTimeTable,
        reliefStaffId,
        leaveId,
        supervisorId,
        hodId,
        payLeaveAllowance,
        ...rest
      } = leaveApplication;
      const medicCert = medicalCertificate
        ? {
            medicalCertificate: await base64ToFile(
              medicalCertificate,
              "medicalCertificate",
            ),
          }
        : {};
      const sickCert = sickCertificate
        ? {
            examinationTimeTable: await base64ToFile(
              sickCertificate,
              "sickCertificate",
            ),
          }
        : {};
      const examCert = examinationTimeTable
        ? {
            sickCertificate: await base64ToFile(
              examinationTimeTable,
              "examinationTimeTable",
            ),
          }
        : {};
      const apiData: ICreateEmployeeLeavePayload = {
        ...rest,
        ...medicCert,
        ...sickCert,
        ...examCert,
        employeeId: user?.user?.employeeId ?? "",
        reliefStaffId: reliefStaffId?.value,
        leaveId: leaveId?.value,
        supervisorId: supervisorId?.value,
        hodId: hodId?.value,
        payLeaveAllowance: payLeaveAllowance?.toLocaleLowerCase() === "true",
      };

      createEmployeeLeave(
        objectToFormData<ICreateEmployeeLeavePayload>(apiData),
      )
        .unwrap()
        .then(() => {
          notify.success({
            message: `Submitted successfully`,
            subtitle: `You have successfully submitted your leave application for approval`,
          });
          router.push(AuthRouteConfig.STAFF_LEAVE_OVERVIEW);
        })
        .catch((err: IApiError) => {
          notify.error({
            message: "Failed to submit leave",
            subtitle: getErrorMessage(err),
          });
        });
    } else {
      notify.error({
        message: "No Leave Application Found",
        subtitle: "Please fill leave application form to proceed.",
      });
      router.push(AuthRouteConfig.STAFF_LEAVE_APPLY);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-[36px]">
      <div className="ml-auto mt-6 flex w-full max-w-[865px] items-center gap-6">
        <Avatar
          fullname={fullname as string}
          size={"xxl"}
          src={user?.user?.profilePicture}
          colorStyles={{ textColor: "N0", bgColor: "R400" }}
        />
        <div className="ml-auto flex max-w-[744px] flex-1 flex-col">
          <div className="flex w-full items-center justify-between">
            <div>
              <Breadcrumbs crumbs={CRUMBS} />
              <div className="my-1.5">
                <PageHeader title={fullname} />
              </div>
              <Typography variant="p-s" gutterBottom color="N500" className="">
                LEAVE APPLICATION FORM
              </Typography>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Button onClick={() => setOpenSign(!openSign)}>Sign</Button>
              <Link href={AuthRouteConfig.STAFF_LEAVE_APPLY}>
                <Button variant={"secondary"}>Back</Button>
              </Link>
            </div>
          </div>
          <hr />
        </div>
      </div>
      <div className="sticky top-[100px] ml-auto w-full max-w-[744px]">
        <Jumbotron headerText="Leave Application Form">
          <div className="flex flex-col gap-[18px] px-4">
            <RowView
              name={"Total leave being taken"}
              value={String(leaveApplication?.totalLeaveTaking)}
            />
            <RowView
              name={"Relief staff"}
              value={leaveApplication?.reliefStaffId?.label}
            />
            <RowView
              name={"Leave duration"}
              value={
                <Typography variant="h-s" color={"text-light"}>
                  {formatDate(leaveApplication?.from ?? "")} -{" "}
                  {formatDate(leaveApplication?.to ?? "")}
                </Typography>
              }
            />{" "}
            <RowView
              name={"Contact address during leave"}
              value={leaveApplication?.leaveContactAddress}
            />{" "}
            <RowView
              name={"Phone number during leave"}
              value={leaveApplication?.leavePhoneNumber}
            />{" "}
            <RowView
              name={"Alternative contact person while on leave"}
              value={leaveApplication?.alternateContactPerson}
            />{" "}
            <RowView
              name={"Address"}
              value={leaveApplication?.alternateContactPersonAddress}
            />
            <RowView
              name={"Phone number "}
              value={leaveApplication?.alternateContactPersonPhoneNumber}
            />{" "}
            <RowView
              name={"Email address of contact person"}
              value={
                leaveApplication?.alternateContactPersonEmail !== ""
                  ? leaveApplication?.alternateContactPersonEmail
                  : "-"
              }
            />{" "}
            <RowView
              name={"Type of leave"}
              value={leaveApplication?.leaveId.label}
            />{" "}
            <RowView
              name={"Pay leave allowance"}
              value={
                leaveApplication?.payLeaveAllowance.toLocaleLowerCase() ===
                "true"
                  ? "Yes"
                  : "No"
              }
            />{" "}
            <RowView
              name={"Supervisor"}
              value={leaveApplication?.supervisorId?.label}
            />{" "}
            <RowView name={"H.O.D"} value={leaveApplication?.hodId?.label} />
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

      <Modal
        isOpen={openSign}
        closeModal={() => setOpenSign(false)}
        title="Sign Leave Application Form"
        mobileLayoutType="full"
      >
        <form>
          <fieldset className="flex flex-col gap-4 px-6 py-6">
            <Typography variant="p-m" color="N700">
              Please type in your First name to sign and submit
            </Typography>
            <TextField
              inputType="input"
              type="test"
              placeholder="Enter first name"
              label={"First Name"}
              flexStyle="row"
              name="firstName"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </fieldset>
          <hr />
          <div className="px-6 py-6">
            <Typography variant="p-m" color="N700">
              By signing this document with an electronic signature, I agree
              that such signature will be as valid as handwritten signatures to
              the extent allowed by local law.
            </Typography>
          </div>
          <hr />
          <div className="flex items-center justify-end gap-2 px-6 pb-4 pt-4">
            <Button
              disabled={
                !(name?.toLowerCase() === user?.user?.firstname?.toLowerCase())
              }
              loading={isLoading}
              onClick={onSubmit}
              type="button"
            >
              Submit
            </Button>
            <Button variant={"secondary"}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LeaveApplicationPreview;
