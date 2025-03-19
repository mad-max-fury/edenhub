"use client";

import React, { useContext } from "react";
import { notFound } from "next/navigation";
import { Badge, NetworkError, PageLoader } from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { UserContext } from "@/layouts/appLayout";
import {
  BasicInformation,
  IBioDataProps,
  IGetEmployeeEnrollmentRes,
  useGetEmployeeEnrollmentQuery,
  useGetOnboardingTaskQuery,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";

import { BioDataFormView } from "@/app/staff/employee-management/enrollment/view/[employeeId]/[formId]/components";
import AttestionView from "@/app/staff/employee-management/enrollment/view/[employeeId]/[formId]/components/attestattionView/AttestationView";
import { DocumentView } from "@/app/staff/employee-management/enrollment/view/[employeeId]/[formId]/components/documentsView/DocumentsView";
import GuarantorFormView from "@/app/staff/employee-management/enrollment/view/[employeeId]/[formId]/components/guarantorView/GuarantorFormView";
import IdCardView from "@/app/staff/employee-management/enrollment/view/[employeeId]/[formId]/components/idCardView/IdCardView";
import IntegrationFormView from "@/app/staff/employee-management/enrollment/view/[employeeId]/[formId]/components/integrationView/Integration";
import ReferenceFormView from "@/app/staff/employee-management/enrollment/view/[employeeId]/[formId]/components/referenceFormView/ReferenceForm";
import { EmployeeProfileHeader } from "@/app/staff/employee-management/enrollment/view/components";

type Props = {
  params: {
    formId: string | number;
  };
};

const CRUMBS = [
  {
    name: "Dashboard",
    path: AuthRouteConfig.STAFF_ONBOARDING,
  },
  {
    name: "ded",
    path: AuthRouteConfig.STAFF_ONBOARDING,
  },
];
const Page = ({ params: { formId } }: Props) => {
  const user = useContext(UserContext);
  const employeeId = user?.user?.employeeId;
  formId = Number(formId);
  const {
    data: onboardingTaskData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useGetOnboardingTaskQuery(employeeId as string, { skip: !employeeId });

  const { data, isLoading: isLoadingEmployee } = useGetEmployeeEnrollmentQuery(
    employeeId as string,
    {
      skip: !employeeId,
    },
  );

  const forms = onboardingTaskData?.data ?? [];

  const activeForm = forms.find((form) => form.taskId === formId);

  const basicInfoData = data?.data.employeeBioData
    .basicInformation as BasicInformation;
  const formToRender = (formType: string) => {
    switch (formType) {
      case "Bio Data Form":
        return (
          <BioDataFormView bioData={activeForm?.formDetails as IBioDataProps} />
        );
      case "ID Card Form":
        return (
          <IdCardView
            idCardData={activeForm?.formDetails}
            employeeData={data?.data as IGetEmployeeEnrollmentRes}
          />
        );
      case "Employee Attestation Form":
        return (
          <>
            <AttestionView
              idCardData={activeForm?.formDetails}
              employeeData={data?.data as IGetEmployeeEnrollmentRes}
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
          </>
        );
      case "Guarantor Form":
        return (
          <>
            <GuarantorFormView
              idCardData={activeForm?.formDetails}
              employeeData={data?.data as IGetEmployeeEnrollmentRes}
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
          </>
        );
      case "Documents":
        return (
          <>
            <DocumentView docs={activeForm?.formDetails} />;
          </>
        );
      default:
        return notFound();
    }
  };
  if (isLoading || isLoadingEmployee) {
    return <PageLoader />;
  }

  if (error)
    return (
      <NetworkError
        error={error as IApiError}
        refetch={refetch}
        isFetching={isFetching}
      />
    );
  return (
    <div className="mx-auto flex w-full flex-col gap-[clamp(30px,4vw,54px)]">
      <EmployeeProfileHeader
        basicInformation={basicInfoData}
        crumbs={CRUMBS}
        variant={"formView"}
        formType={activeForm?.title}
        customBadge={
          <Badge
            variant={
              activeForm?.approved === "Pending"
                ? "yellow"
                : activeForm?.approved === "Approved"
                  ? "green"
                  : "red"
            }
            text={
              activeForm?.approved === "Pending"
                ? "Pending Review"
                : activeForm?.approved
            }
          />
        }
        // @ts-expect-error: not needed
        date={activeForm?.formDetails?.dateSubmitted as string}
      />
      {employeeId &&
        !isLoadingEmployee &&
        formToRender(activeForm?.title as string)}
    </div>
  );
};

export default Page;
