"use client";

import { NetworkError, PageLoader, Typography } from "@/components";
import {
  useGetAllUnpaginatedCompaniesQuery,
  useGetHRDashboardQuery,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { ISelectResponse } from "@/redux/api/select";
import { formatSelectItems } from "@/utils/helpers";

import { UpcomingBirthdayTable } from "../dashboard/components";
import {
  Analytics,
  LatestEnrollmentTable,
  LeaveApplicationsTable,
  PerformanceChartContainer,
  StaffDistributionContainer,
  UpcomingWorkAnniversaryTable,
} from "./components";

const Page = () => {
  const { data, isLoading, error, isFetching, refetch } =
    useGetHRDashboardQuery();
  const { data: companies, isLoading: isLoadingCompanies } =
    useGetAllUnpaginatedCompaniesQuery();
  const userData = data?.data;
  const allCompanies = formatSelectItems<ISelectResponse>(
    companies?.data ?? [],
    "name",
    "id",
  );
  if (isLoading || isLoadingCompanies) return <PageLoader />;
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
      {userData && (
        <>
          <Typography variant="c-xxl" fontWeight="medium" color="N900">
            HR Analytics
          </Typography>
          <Analytics data={userData} />
          <div className="mt-6 grid grid-cols-12 gap-6">
            <div className="col-span-12 h-[376px] lg:col-span-6">
              <PerformanceChartContainer />
            </div>
            <div className="col-span-12 h-fit lg:col-span-6 lg:h-[376px]">
              <StaffDistributionContainer allCompanies={allCompanies} />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-6">
              <LatestEnrollmentTable data={userData?.latestEnrollments} />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <UpcomingBirthdayTable data={userData?.upcomingBirthDays} />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-6">
              <UpcomingWorkAnniversaryTable
                data={userData?.upcomingWorkAnniversaries}
              />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <LeaveApplicationsTable />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
