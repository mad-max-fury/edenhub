"use client";

import React from "react";
import {
  Avatar,
  PageHeader,
  PageLoader,
  Typography,
} from "@/components";
import { LOCAL_STORAGE_VALUES } from "@/constants/data";
import { AuthRouteConfig } from "@/constants/routes";
import {
  IVerifyUserResponse,
  useGetAllUnpaginatedJobDesignationsQuery,
  useGetAllUnpaginatedJobTitlesQuery,
} from "@/redux/api";
import { useGetAllUnPaginatedLocationsQuery } from "@/redux/api/location";
import {
  ISelectResponse,
  useGetEmploymentTypesQuery,
} from "@/redux/api/select";
import { formatSelectItems } from "@/utils/helpers";

import { Breadcrumbs } from "@/components/breadCrumbs/breadCrumbs";

import { UpdateInfoForm } from "./components";

const CRUMBS = [
  { name: "Dashboard", path: AuthRouteConfig.OLD_STAFF_ONBOARDING },
  {
    name: "Information Update",
    path: AuthRouteConfig.OLD_STAFF_ONBOARDING_INFO_UPDATE,
  },
];
const UpdateInfoPage = () => {
  const {
    data: employmentTypesData,
    isLoading: isLoadingEmploymentTypes,
  } = useGetEmploymentTypesQuery();

  const {
    data: jobTitles,
    isLoading: isLoadingJobTitles,
  } = useGetAllUnpaginatedJobTitlesQuery();

  const {
    data: jobDesignation,
    isLoading: isLoadingJobDesignations,
  } = useGetAllUnpaginatedJobDesignationsQuery();

  const {
    data: workLocations,
    isLoading: isLoadingWorkLocations,
  } = useGetAllUnPaginatedLocationsQuery();

  const user = React.useMemo(() => {
    try {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_VALUES.RE_OLD_USER);
      return storedUser
        ? (JSON.parse(storedUser) as IVerifyUserResponse)
        : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      return null;
    }
  }, []);
  const fullname = user?.fullName;

  const employmentTypesOptions = formatSelectItems<ISelectResponse>(
    employmentTypesData?.data ?? [],
    "name",
    "id",
  );
  const jobTitleOptions = formatSelectItems<ISelectResponse>(
    jobTitles?.data ?? [],
    "name",
    "id",
  );
  const jobDesignationOptions = formatSelectItems<ISelectResponse>(
    jobDesignation?.data ?? [],
    "name",
    "id",
  );
  const workLocationOptions = formatSelectItems<ISelectResponse>(
    workLocations?.data ?? [],
    "name",
    "id",
  );

  const isLoading =
    isLoadingEmploymentTypes ||
    isLoadingJobDesignations ||
    isLoadingJobTitles ||
    isLoadingWorkLocations;

  if (isLoading) return <PageLoader />;

  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-[36px]">
      <div className="ml-auto mt-6 flex w-full max-w-[865px] items-center gap-6">
        <Avatar
          fullname={fullname as string}
          size={"xxl"}
          colorStyles={{ textColor: "N0", bgColor: "R400" }}
        />
        <div className="ml-auto flex max-w-[744px] flex-1 flex-col">
          <Breadcrumbs crumbs={CRUMBS} />
          <div className="my-1.5">
            <PageHeader title={fullname} />
          </div>
          <Typography variant="p-s" gutterBottom color="N500" className="">
            INFORMATION UPDATE FORM
          </Typography>
          <hr />
        </div>
      </div>
      <div className="sticky top-[100px] ml-auto w-full max-w-[744px]">
        <UpdateInfoForm
          jobTitleOptions={jobTitleOptions}
          jobDesignationOptions={jobDesignationOptions}
          employmentTypesOptions={employmentTypesOptions}
          workLocationOptions={workLocationOptions}
          user={user as IVerifyUserResponse}
        />
      </div>
    </div>
  );
};

export default UpdateInfoPage;
