"use client";

import React, { useContext } from "react";
import { NetworkError, PageHeader, PageLoader } from "@/components";
import { UserContext } from "@/layouts/appLayout";
import { ILeaveStats } from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { useGetEmployeeLeaveQuery } from "@/redux/api/leave";

import { StatsCard } from "../../../employee-management/all-employee/[employeeId]/(employee-info)/leave/components";
import { EmployeeLeaveTable } from "./../components/EmployeeLeavesTable";

const Page = () => {
  const user = useContext(UserContext);
  const {
    data: employeeLeave,
    isLoading: isLoadingEmployeeLeave,
    error,
    isFetching,
    refetch,
  } = useGetEmployeeLeaveQuery({
    employeeId: user?.user?.employeeId as string,
  });
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
    {
      title: "Pending Requests",
      values: employeeLeave?.data?.pendingRequests,
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

  return (
    <div>
      <div className="flex flex-col gap-4">
        <PageHeader
          title="Leave/Time Off"
          subtitle="Manage your leave applications and view your leave details"
        />
        <div className="mb-6 grid grid-cols-4 gap-5">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>
        {/* {!leaves ? (
          <div className="flex min-h-[500px] w-full items-center border pt-2">
            <EmptyPageState
              title="No Leave Applications Yet"
              text="Submit your first leave application to start tracking your leave history."
              buttonGroup={
                <Link href={AuthRouteConfig.STAFF_LEAVE_APPLY}>
                  <Button
                    className="mx-auto my-6"
                    onClick={() => dispatch(resetLeaveApplication())}
                  >
                    Apply for Leave
                  </Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div>
            <TMTable<ILeave>
              title="Leave Applications"
              columns={columns}
              data={leaves!}
              loading={false}
            />
          </div>
        )} */}

        <EmployeeLeaveTable />
      </div>
    </div>
  );
};

export default Page;
