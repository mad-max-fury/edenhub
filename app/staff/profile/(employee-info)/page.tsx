"use client";

import React, { useContext } from "react";
import { NetworkError, PageLoader } from "@/components";
import { UserContext } from "@/layouts/appLayout";
import {
  IGetEmployeeEnrollmentRes,
  useGetEmployeeEnrollmentQuery,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { mapEmployeeEnrollmentToBioData } from "@/utils/constructorFunction";

import { BioDataFormView } from "@/app/staff/employee-management/enrollment/view/[employeeId]/[formId]/components";

const Page = () => {
  const userData = useContext(UserContext);
  const employeeId = userData?.user?.employeeId ?? "";
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
