"use client";

import React, { useContext, useState } from "react";
import {
  EmployeeLeaveTable,
  NetworkError,
  PageHeader,
  PageLoader,
  SMSelectDropDown,
} from "@/components";
import { CURRENT_YEAR } from "@/constants/data";
import { UserContext } from "@/layouts/appLayout";
import { ILeaveStats, useGetEmployeeLeaveQuery } from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { useGetAllYearsQuery } from "@/redux/api/select";
import {
  findValueAndLabel,
  FindValueAndLabelProps,
  formatSelectItems,
} from "@/utils/helpers";

import { StatsCard } from "@/app/staff/employee-management/all-employee/[employeeId]/(employee-info)/leave/components";

const Page = () => {
  const userData = useContext(UserContext);
  const employeeId = userData?.user?.employeeId ?? "";
  const [year, setYear] = useState(CURRENT_YEAR);

  const {
    data: employeeLeave,
    isLoading: isLoadingEmployeeLeave,
    error,
    isFetching,
    refetch,
  } = useGetEmployeeLeaveQuery({
    yearId: year,
    employeeId: employeeId ?? "",
  });

  const { data: years } = useGetAllYearsQuery();

  const stats: Array<{
    title: string;
    values?: ILeaveStats;
  }> = [
    {
      title: "Yearly Leave Entitlement",
      values: employeeLeave?.data?.yearlyLeaveEntitlement,
    },
    {
      title: "Available Leave Days",
      values: employeeLeave?.data?.availableLeaveDays,
    },
    {
      title: "Approved Requests",
      values: employeeLeave?.data?.approvedRequests,
    },
  ];

  if (isLoadingEmployeeLeave) return <PageLoader />;
  if (error)
    return (
      <NetworkError
        error={error as IApiError}
        isFetching={isFetching}
        refetch={refetch}
      />
    );
  const options = formatSelectItems<FindValueAndLabelProps>(
    // @ts-expect-error: fix error
    years?.data,
    "name",
    "id",
  ) as FindValueAndLabelProps[];

  return (
    <div>
      <PageHeader
        title="Leave"
        buttonGroup={
          <div>
            <SMSelectDropDown
              options={options}
              searchable={false}
              defaultValue={findValueAndLabel(CURRENT_YEAR, options)}
              onChange={(value) => {
                setYear(value.value as number);
              }}
            />
          </div>
        }
      />
      <div className="pt-4">
        <div className="flex w-full flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
            {stats.map((stat) => (
              <StatsCard key={stat.title} {...stat} />
            ))}
          </div>
          <EmployeeLeaveTable employeeId={employeeId} year={String(year)} />
        </div>
      </div>
    </div>
  );
};

export default Page;
