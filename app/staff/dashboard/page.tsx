"use client";

import { useContext } from "react";
import { NetworkError, PageLoader, Typography } from "@/components";
import { CURRENT_YEAR } from "@/constants/data";
import { UserContext } from "@/layouts/appLayout";
import {
  useGetAppraisalCycleQuery,
  useGetAppraisalResultQuery,
  useGetEmployeeDashboardQuery,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { daysToBirthday, daysToWorkAnniversary } from "@/utils/helpers";

import {
  DirectReports,
  InfoCard,
  InfoSection,
  PerformanceChartContainer,
  PerformanceResult,
  UpcomingBirthdayTable,
} from "./components";

const Page = () => {
  const user = useContext(UserContext);

  const { data, isLoading, error, refetch, isFetching } =
    useGetEmployeeDashboardQuery();
  const { data: cycle, isLoading: isLoadingCycle } =
    useGetAppraisalCycleQuery(CURRENT_YEAR);

  const currentCycle = cycle?.data?.[cycle.data.length - 1];
  const { data: result, isLoading: isLoadingResult } =
    useGetAppraisalResultQuery(
      {
        appraisalId: currentCycle?.id ?? "",
        employeeId: user?.user?.employeeId ?? "",
      },
      {
        skip: !(currentCycle?.id && user?.user?.employeeId),
      },
    );

  const userData = data?.data;
  if (isLoading || isLoadingCycle || isLoadingResult) return <PageLoader />;
  if (error)
    return (
      <NetworkError
        error={error as IApiError}
        refetch={refetch}
        isFetching={isFetching}
      />
    );
  return (
    <div>
      <Typography variant="c-xxl" fontWeight="medium" color="N900">
        {`Hello, ${userData?.firstname}`}
      </Typography>
      <Typography
        variant="p-m"
        fontWeight="regular"
        color="N700"
        className="mb-6 mt-2 sm:mb-0 sm:mt-2"
      >
        Welcome and good to have you back.
      </Typography>
      <div className="mt-9 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6">
          {userData && <InfoSection userData={userData} />}
        </div>
        <div className="col-span-12 lg:col-span-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="h-[288px]">
              <PerformanceResult
                title={currentCycle?.name ?? ""}
                score={result?.data?.finalResult?.result?.finalResult ?? 0}
              />
            </div>
            <div className="flex h-[288px] flex-col gap-6">
              {userData && (
                <div className="grid h-full grid-cols-2 gap-6">
                  <InfoCard
                    title="Birthday"
                    value={daysToBirthday(userData?.birthDay)}
                    subtitle={
                      daysToBirthday(userData?.birthDay) !== "Today"
                        ? "Days to go"
                        : ""
                    }
                  />
                  <InfoCard
                    title="Work Ann."
                    value={daysToWorkAnniversary(userData?.hiredDate)}
                    subtitle={
                      daysToWorkAnniversary(userData?.hiredDate) !== "Today"
                        ? "Days to go"
                        : ""
                    }
                  />
                </div>
              )}
              <div className="h-full">
                <InfoCard
                  title="Leave"
                  value={`${userData?.employeeLeave?.availableLeaveDays?.annualLeave}/${userData?.employeeLeave?.yearlyLeaveEntitlement?.annualLeave}`}
                  subtitle="days"
                />
              </div>
            </div>
          </div>
          <div className="mt-6 h-[273px]">
            <PerformanceChartContainer />
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-12 gap-6">
        {userData && (
          <div className="col-span-12 lg:col-span-6">
            <UpcomingBirthdayTable data={userData?.upcomingBirthDays} />
          </div>
        )}
        <div className="col-span-12 lg:col-span-6">
          <DirectReports
            reviewId={currentCycle?.id ?? ""}
            empId={user?.user?.employeeId ?? ""}
            year={CURRENT_YEAR}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
