"use client";

import React, { useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { NetworkError, PageLoader, TabUnderline } from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { UserContext } from "@/layouts/appLayout";
import {
  IGetEmployeeEnrollmentRes,
  useGetEmployeeEnrollmentQuery,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";

import { EmployeeInfoPageHeader } from "./components";

type Props = {
  children: React.ReactNode;
};

const pageTabs = [
  {
    label: "Profile",
    query: AuthRouteConfig.PROFILE,
  },
  {
    label: "Reporters",
    query: AuthRouteConfig.PROFILE + "/" + "reporters",
  },
  {
    label: "Performance",
    query: AuthRouteConfig.PROFILE + "/" + "performance",
  },
  {
    label: "Documents",
    query: AuthRouteConfig.PROFILE + "/" + "documents",
  },
  {
    label: "Leave",
    query: AuthRouteConfig.PROFILE + "/" + "leave",
  },
];
const LayoutResolver = ({ children }: Props) => {
  const userData = useContext(UserContext);
  const employeeId = userData?.user?.employeeId ?? "";
  const pathName = usePathname();
  const { push } = useRouter();
  const activeTab = pathName ?? AuthRouteConfig.PROFILE;
  const { data, isLoading, error, refetch, isFetching } =
    useGetEmployeeEnrollmentQuery(employeeId);

  const handleTabChange = (query: string) => {
    return push(query);
  };

  if (isLoading) return <PageLoader />;
  if (error)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <NetworkError
          error={error as IApiError}
          isFetching={isFetching}
          refetch={refetch}
        />
      </div>
    );

  return (
    <div className="flex w-full max-w-[1128px] flex-col">
      <EmployeeInfoPageHeader data={data?.data as IGetEmployeeEnrollmentRes} />
      <div className="ml-auto mt-8 w-full max-w-[935px]">
        <TabUnderline
          tabs={pageTabs}
          activeTab={activeTab}
          onChange={(t) => handleTabChange(t)}
          showShadow={false}
        />
      </div>
      <hr className="bg-[#091e4240]" />
      <div className="w-full pt-8">{children}</div>
    </div>
  );
};

export default LayoutResolver;
