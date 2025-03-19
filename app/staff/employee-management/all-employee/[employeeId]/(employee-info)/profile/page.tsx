"use client";

import React from "react";
import { NetworkError, PageLoader } from "@/components";
import {
  IGetEmployeeEnrollmentRes,
  useGetEmployeeEnrollmentQuery,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { mapEmployeeEnrollmentToBioData } from "@/utils/constructorFunction";

import { BioDataFormView } from "@/app/staff/employee-management/enrollment/view/[employeeId]/[formId]/components";

type Props = {
  params: {
    employeeId: string;
  };
};

const Page = ({ params: { employeeId } }: Props) => {
  const { data, isLoading, error, refetch, isFetching } =
    useGetEmployeeEnrollmentQuery(employeeId);

  if (isLoading || isFetching) {
    return <PageLoader />;
  }

  if (error)
    return (
      <NetworkError
        refetch={refetch}
        error={error as IApiError}
        isFetching={isFetching}
      />
    );

  return (
    <div className="w-full">
      <BioDataFormView
        bioData={mapEmployeeEnrollmentToBioData(
          data?.data as IGetEmployeeEnrollmentRes,
        )}
        staffId={data?.data?.employeeBioData?.staffId ?? ""}
      />
    </div>
  );
};

export default Page;
