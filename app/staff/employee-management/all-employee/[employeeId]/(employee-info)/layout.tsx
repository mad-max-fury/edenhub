"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { NetworkError, PageLoader, TabUnderline } from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import {
  IGetEmployeeEnrollmentRes,
  useGetEmployeeEnrollmentQuery,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";

import { EmployeeInfoPageHeader } from "./components";

type Props = {
  params: {
    employeeId: string;
  };
  children: React.ReactNode;
};

const pageTabs = [
  {
    label: "Profile",
    query: "profile",
  },
  {
    label: "Reporters",
    query: "reporters",
  },
  {
    label: "Performance",
    query: "performance",
  },
  {
    label: "Documents",
    query: "documents",
  },
  {
    label: "Leave",
    query: "leave",
  },
];
const Layout = ({ params, children }: Props) => {
  const { employeeId } = params;
  const pathName = usePathname();
  const { push } = useRouter();
  const pathSplit = pathName.split("/");
  const baseLayoutRoute = pathSplit.slice(0, -1).join("/");
  const activeTab = pathSplit[pathSplit.length - 1] ?? "profile";
  const { data, isLoading, error, refetch, isFetching } =
    useGetEmployeeEnrollmentQuery(employeeId);

  const handleTabChange = (query: string) => {
    return push(baseLayoutRoute + "/" + query);
  };

  if (isLoading) return <PageLoader />;
  if (error)
    return (
      <NetworkError
        error={error as IApiError}
        isFetching={isFetching}
        refetch={refetch}
      />
    );

  const CRUMBS = [
    {
      name: "All Employee",
      path: AuthRouteConfig.EMPLOYEE_MANAGEMEN_ALL_EMPLOYEE,
    },
    {
      name: data?.data?.employeeBioData?.basicInformation.fullname ?? "--",
      path:
        AuthRouteConfig.EMPLOYEE_MANAGEMEN_ALL_EMPLOYEE +
        "/" +
        employeeId +
        "/profile",
    },
  ];

  return (
    <div className="flex w-full max-w-[1128px] flex-col">
      <EmployeeInfoPageHeader
        data={data?.data as IGetEmployeeEnrollmentRes}
        crumbs={CRUMBS}
      />
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

export default Layout;
