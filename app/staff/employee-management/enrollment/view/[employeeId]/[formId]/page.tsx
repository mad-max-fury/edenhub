"use client";

import React, { useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { NetworkError, notify, PageLoader } from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import {
  BasicInformation,
  IApproveOrReject,
  IBioDataProps,
  IGetEmployeeEnrollmentRes,
  useAcceptOrRejectEmployeeFormMutation,
  useGetEmployeeEnrollmentQuery,
  useGetOnboardingTaskQuery,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { EnrollmentDocumentStatus } from "@/redux/api/interface";
import { getErrorMessage } from "@/utils/getErrorMessges";

import { EmployeeProfileHeader } from "../../components";
import { BioDataFormView } from "./components";
import { AcceptForm } from "./components/actionModals/AcceptDocument";
import { RejectForm } from "./components/actionModals/rejectDocument";
import AttestionView from "./components/attestattionView/AttestationView";
import { DocumentView } from "./components/documentsView/DocumentsView";
import GuarantorFormView from "./components/guarantorView/GuarantorFormView";
import IdCardView from "./components/idCardView/IdCardView";
import IntegrationFormView from "./components/integrationView/Integration";
import ReferenceFormView from "./components/referenceFormView/ReferenceForm";

type Props = {
  params: {
    employeeId: string;
    formId: string | number;
  };
};

const Page = ({ params: { employeeId, formId } }: Props) => {
  formId = Number(formId);
  const {
    data: onboardingTaskData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetOnboardingTaskQuery(employeeId);

  const { data } = useGetEmployeeEnrollmentQuery(employeeId);
  const [acceptOrRejectEmployeeForm, { isLoading: isAcceptingOrRejecting }] =
    useAcceptOrRejectEmployeeFormMutation();

  const forms = onboardingTaskData?.data ?? [];

  const activeForm = forms.find((form) => form.taskId === formId);
  const router = useRouter();
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  if (isLoading || isFetching) {
    return <PageLoader />;
  }

  if (error)
    return (
      <NetworkError
        error={error as IApiError}
        isFetching={isFetching}
        refetch={refetch}
      />
    );

  const CRUMBS = [
    {
      name: "Enrollment",
      path: AuthRouteConfig.EMPLOYEE_MANAGEMENT_ENROLLMENT,
    },
    {
      name: data?.data?.employeeBioData?.basicInformation.fullname ?? "",
      path: `${AuthRouteConfig.EMPLOYEE_MANAGEMENT_ENROLLMENT}/view/${employeeId}`,
    },
    {
      name: activeForm?.title ?? "",
      path: `${AuthRouteConfig.EMPLOYEE_MANAGEMENT_ENROLLMENT}/view/${employeeId}/${formId}`,
    },
  ];

  const handleAcceptEmployeeForm = async (
    payload: IApproveOrReject,
    path: string,
  ) => {
    try {
      await acceptOrRejectEmployeeForm({
        path,
        payload,
      }).unwrap();
      notify.success({
        message: `${activeForm?.title} approved`,
        subtitle: `You have successfully approved ${activeForm?.title}'`,
      });

      setShowApprovalModal(false);
      router.push(
        `${AuthRouteConfig.EMPLOYEE_MANAGEMENT_ENROLLMENT}/view/${employeeId}`,
      );
    } catch (error) {
      notify.error({
        message: `Failed to approve ${activeForm?.title} `,
        subtitle: getErrorMessage(error as IApiError),
      });
    }
  };
  const handleRejectEmployeeForm = async (
    payload: IApproveOrReject,
    path: string,
  ) => {
    try {
      await acceptOrRejectEmployeeForm({
        path,
        payload,
      }).unwrap();
      notify.success({
        message: `${activeForm?.title} rejected`,
        subtitle: `You have successfully rejected ${activeForm?.title}'`,
      });

      setShowRejectModal(false);

      router.push(
        `${AuthRouteConfig.EMPLOYEE_MANAGEMENT_ENROLLMENT}/view/${employeeId}`,
      );
    } catch (error) {
      notify.error({
        message: `Failed to reject ${activeForm?.title} `,
        subtitle: getErrorMessage(error as IApiError),
      });
    }
  };

  const basicInfoData = data?.data.employeeBioData
    .basicInformation as BasicInformation;

  const formToRender = (formType: string) => {
    switch (formType) {
      case "Bio Data Form":
        return (
          <>
            <BioDataFormView
              bioData={activeForm?.formDetails as IBioDataProps}
            />
            <AcceptForm
              showApprovalModal={showApprovalModal}
              setShowApprovalModal={setShowApprovalModal}
              approvalAction={() =>
                handleAcceptEmployeeForm(
                  { employeeId, status: true },
                  "accept-or-reject-employee-bio-data",
                )
              }
              basicInformation={basicInfoData}
              formType={activeForm?.title as string}
              isLaoding={isAcceptingOrRejecting}
            />

            <RejectForm
              showRejectModal={showRejectModal}
              setShowRejectModal={setShowRejectModal}
              rejectAction={(data) =>
                handleRejectEmployeeForm(
                  { employeeId, status: false, comment: data?.comment },
                  "accept-or-reject-employee-bio-data",
                )
              }
              basicInformation={basicInfoData}
              formType={activeForm?.title as string}
              isLaoding={isAcceptingOrRejecting}
            />
          </>
        );
      case "ID Card Form":
        return (
          <>
            <IdCardView
              idCardData={activeForm?.formDetails}
              employeeData={data?.data as IGetEmployeeEnrollmentRes}
            />
            <AcceptForm
              showApprovalModal={showApprovalModal}
              setShowApprovalModal={setShowApprovalModal}
              approvalAction={() =>
                handleAcceptEmployeeForm(
                  { employeeId, status: true },
                  "accept-or-reject-employee-id-card",
                )
              }
              basicInformation={basicInfoData}
              formType={activeForm?.title as string}
              isLaoding={isAcceptingOrRejecting}
            />

            <RejectForm
              showRejectModal={showRejectModal}
              setShowRejectModal={setShowRejectModal}
              rejectAction={(data) =>
                handleRejectEmployeeForm(
                  { employeeId, status: false, comment: data?.comment },
                  "accept-or-reject-employee-id-card",
                )
              }
              basicInformation={basicInfoData}
              formType={activeForm?.title as string}
              isLaoding={isAcceptingOrRejecting}
            />
          </>
        );
      case "Employee Attestation Form":
        return (
          <>
            <AttestionView
              idCardData={activeForm?.formDetails}
              employeeData={data?.data as IGetEmployeeEnrollmentRes}
            />
            <AcceptForm
              showApprovalModal={showApprovalModal}
              setShowApprovalModal={setShowApprovalModal}
              approvalAction={() =>
                handleAcceptEmployeeForm(
                  { employeeId, status: true },
                  "accept-or-reject-employee-attestation-form",
                )
              }
              basicInformation={basicInfoData}
              formType={activeForm?.title as string}
              isLaoding={isAcceptingOrRejecting}
            />

            <RejectForm
              showRejectModal={showRejectModal}
              setShowRejectModal={setShowRejectModal}
              rejectAction={(data) =>
                handleRejectEmployeeForm(
                  { employeeId, status: false, comment: data?.comment },
                  "accept-or-reject-employee-attestation-form",
                )
              }
              basicInformation={basicInfoData}
              formType={activeForm?.title as string}
              isLaoding={isAcceptingOrRejecting}
            />
          </>
        );
      case "Reference Form":
        return (
          <>
            <ReferenceFormView
              idCardData={activeForm?.formDetails}
              employeeData={data?.data as IGetEmployeeEnrollmentRes}
            />
            <AcceptForm
              showApprovalModal={showApprovalModal}
              setShowApprovalModal={setShowApprovalModal}
              approvalAction={() =>
                handleAcceptEmployeeForm(
                  { employeeId, status: true },
                  "accept-or-reject-employee-reference-form",
                )
              }
              basicInformation={basicInfoData}
              formType={activeForm?.title as string}
              isLaoding={isAcceptingOrRejecting}
            />

            <RejectForm
              showRejectModal={showRejectModal}
              setShowRejectModal={setShowRejectModal}
              rejectAction={(data) =>
                handleRejectEmployeeForm(
                  { employeeId, status: false, comment: data?.comment },
                  "accept-or-reject-employee-reference-form",
                )
              }
              basicInformation={basicInfoData}
              formType={activeForm?.title as string}
              isLaoding={isAcceptingOrRejecting}
            />
          </>
        );
      case "Guarantor Form":
        return (
          <>
            <GuarantorFormView
              idCardData={activeForm?.formDetails}
              employeeData={data?.data as IGetEmployeeEnrollmentRes}
            />
            <AcceptForm
              showApprovalModal={showApprovalModal}
              setShowApprovalModal={setShowApprovalModal}
              approvalAction={() =>
                handleAcceptEmployeeForm(
                  { employeeId, status: true },
                  "accept-or-reject-employee-guarantor-form",
                )
              }
              basicInformation={basicInfoData}
              formType={activeForm?.title as string}
              isLaoding={isAcceptingOrRejecting}
            />

            <RejectForm
              showRejectModal={showRejectModal}
              setShowRejectModal={setShowRejectModal}
              rejectAction={(data) =>
                handleRejectEmployeeForm(
                  { employeeId, status: false, comment: data?.comment },
                  "accept-or-reject-employee-guarantor-form",
                )
              }
              basicInformation={basicInfoData}
              formType={activeForm?.title as string}
              isLaoding={isAcceptingOrRejecting}
            />
          </>
        );
      case "Integration Form":
        return (
          <>
            <IntegrationFormView
              integrationData={activeForm?.formDetails}
              employeeData={data?.data as IGetEmployeeEnrollmentRes}
            />
            <AcceptForm
              showApprovalModal={showApprovalModal}
              setShowApprovalModal={setShowApprovalModal}
              approvalAction={() =>
                handleAcceptEmployeeForm(
                  { employeeId, status: true },
                  "accept-or-reject-employee-integration-form",
                )
              }
              basicInformation={basicInfoData}
              formType={activeForm?.title as string}
              isLaoding={isAcceptingOrRejecting}
            />

            <RejectForm
              showRejectModal={showRejectModal}
              setShowRejectModal={setShowRejectModal}
              rejectAction={(data) =>
                handleRejectEmployeeForm(
                  { employeeId, status: false, comment: data?.comment },
                  "accept-or-reject-employee-integration-form",
                )
              }
              basicInformation={basicInfoData}
              formType={activeForm?.title as string}
              isLaoding={isAcceptingOrRejecting}
            />
          </>
        );
      case "Documents":
        return (
          <>
            <DocumentView docs={activeForm?.formDetails} />;
            <AcceptForm
              showApprovalModal={showApprovalModal}
              setShowApprovalModal={setShowApprovalModal}
              approvalAction={() =>
                handleAcceptEmployeeForm(
                  { employeeId, status: true },
                  "accept-or-reject-employee-document",
                )
              }
              basicInformation={basicInfoData}
              formType={activeForm?.title as string}
              isLaoding={isAcceptingOrRejecting}
            />
            <RejectForm
              showRejectModal={showRejectModal}
              setShowRejectModal={setShowRejectModal}
              rejectAction={(data) =>
                handleRejectEmployeeForm(
                  { employeeId, status: false, comment: data?.comment },
                  "accept-or-reject-employee-document",
                )
              }
              basicInformation={basicInfoData}
              formType={activeForm?.title as string}
              isLaoding={isAcceptingOrRejecting}
            />
          </>
        );
      default:
        return notFound();
    }
  };

  return (
    <div className="mx-auto flex w-full flex-col gap-[clamp(30px,4vw,54px)]">
      <EmployeeProfileHeader
        basicInformation={basicInfoData}
        crumbs={CRUMBS}
        variant={"formView"}
        formType={activeForm?.title}
        // @ts-expect-error
        date={activeForm?.formDetails?.dateSubmitted as string}
        formStatus={
          // @ts-expect-error
          activeForm?.formDetails.approved as EnrollmentDocumentStatus
        }
        setShowApprovalModal={setShowApprovalModal}
        setShowRejectModal={setShowRejectModal}
      />
      {formToRender(activeForm?.title as string)}
    </div>
  );
};

export default Page;
