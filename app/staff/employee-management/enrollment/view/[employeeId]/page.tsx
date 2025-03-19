"use client";

import React from "react";
import { notFound } from "next/navigation";
import { Jumbotron, NetworkError, PageLoader, Typography } from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import {
  BasicInformation,
  useGetEmployeeEnrollmentQuery,
  useGetOnboardingTaskQuery,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";

import { EmployeeProfileHeader } from "../components";
import OnBoardingFormTask from "../components/onBoardingFormTask";

type Props = {
  params: {
    employeeId: string;
  };
};

const Page = ({ params: { employeeId } }: Props) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetOnboardingTaskQuery(employeeId);
  const { data: employeeData } = useGetEmployeeEnrollmentQuery(employeeId);

  if (employeeId.length === 0 && !data && !employeeData) notFound();
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

  const forms = data?.data ?? [];
  const basicInformation = employeeData?.data.employeeBioData.basicInformation;

  const CRUMBS = [
    {
      name: "Enrollment",
      path: AuthRouteConfig.EMPLOYEE_MANAGEMENT_ENROLLMENT,
    },
    {
      name: basicInformation?.fullname ?? "",
      path: `${AuthRouteConfig.EMPLOYEE_MANAGEMENT_ENROLLMENT}/view/${employeeId}`,
    },
  ];
  const completedForms = forms.filter((form) => form.completed);
  const completedFormsLength = completedForms.length ?? 0;

  return (
    <div className="mx-auto flex w-full max-w-[870px] flex-col">
      <EmployeeProfileHeader
        basicInformation={basicInformation as BasicInformation}
        crumbs={CRUMBS}
      />
      <div className="ml-auto mt-4 flex w-full max-w-[744px]">
        <Jumbotron
          headerContainer={
            <div className="flex justify-between">
              <Typography variant="h-m" color="text-default">
                Onboarding Tasks
              </Typography>
              <div>
                {completedFormsLength} / {forms.length}
              </div>
            </div>
          }
        >
          {forms.map((form, index) => {
            const requirement = {
              label: form.title,
              value: form.taskId,
            };

            const formDetails = form?.formDetails;

            return (
              <OnBoardingFormTask
                key={index}
                item={requirement}
                status={
                  // @ts-expect-error
                  formDetails?.approved === "Approved"
                    ? "Approved"
                    : // @ts-expect-error
                      formDetails?.approved === "Rejected"
                      ? "Rejected"
                      : // @ts-expect-error
                        formDetails?.approved === "Pending"
                        ? "Pending"
                        : "Incomplete"
                }
                isCompleted={form?.completed}
              />
            );
          })}
        </Jumbotron>
      </div>
    </div>
  );
};

export default Page;
