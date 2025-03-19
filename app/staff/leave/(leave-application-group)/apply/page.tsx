"use client";

import React, { useContext } from "react";
import {
  Avatar,
  NetworkError,
  PageHeader,
  PageLoader,
  Typography,
} from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { UserContext } from "@/layouts/appLayout";
import { IApiError } from "@/redux/api/genericInterface";
import {
  ILeaveProps,
  useGetAllUnpaginatedLeaveTypesQuery,
  useGetEmployeeLeaveQuery,
} from "@/redux/api/leave";

import { Breadcrumbs } from "@/components/breadCrumbs/breadCrumbs";

import { ApplyForLeaveForm } from "./components";

const CRUMBS = [
  { name: "Leave", path: AuthRouteConfig.STAFF_LEAVE_OVERVIEW },
  {
    name: "Leave Application Form",
    path: AuthRouteConfig.STAFF_LEAVE_APPLY,
  },
];
const ApplyForLeave = () => {
  const user = useContext(UserContext);

  const {
    data: employeeLeave,
    isLoading: isLoadingEmployeeLeave,
    refetch,
    isFetching,
  } = useGetEmployeeLeaveQuery({
    employeeId: user?.user?.employeeId as string,
  });

  const { data, error, isLoading } = useGetAllUnpaginatedLeaveTypesQuery();

  const fullname = `${user?.user?.firstname} ${user?.user?.lastname}`;
  if (isLoading || isLoadingEmployeeLeave) return <PageLoader />;
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
      <div className="ml-auto mt-6 flex w-full max-w-[865px] items-center gap-6">
        <Avatar
          fullname={fullname as string}
          size={"xxl"}
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
          </div>
          <hr />
        </div>
      </div>
      <div className="sticky top-[100px] ml-auto w-full max-w-[744px]">
        <ApplyForLeaveForm
          availableLeaveDays={
            employeeLeave?.data?.availableLeaveDays.annualLeave as number
          }
          totalLeaveDays={
            employeeLeave?.data?.yearlyLeaveEntitlement.annualLeave as number
          }
          leaveTypes={(data?.data as ILeaveProps[]) ?? []}
        />
      </div>
    </div>
  );
};

export default ApplyForLeave;
