"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { SquareIcon } from "@/assets/svgs";
import { NetworkError, PageLoader, Tab } from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import AppLayout from "@/layouts/appLayout";
import {
  useGetStaffProfileQuery,
  useGetSupervisorAndHODStatusQuery,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";

const baseTabs: Tab[] = [
  {
    label: "Overview",
    query: AuthRouteConfig.STAFF_LEAVE_OVERVIEW,
    title: "Overview",
  },
];

interface IStaffRootLayout {
  children: React.ReactNode;
}

const getActiveDropDown = (path: string, tabs: Tab[]) => {
  const tabIndex = tabs.findIndex((tab) =>
    tab.dropdown?.items.some((item) => path.startsWith(item.path)),
  );

  if (tabIndex === -1) return { item: null, tabIndex: -1 };

  const activeItem = tabs[tabIndex].dropdown?.items.find((item) =>
    path.startsWith(item.path),
  );
  return { item: activeItem, tabIndex };
};

const StaffRootLayout = ({ children }: IStaffRootLayout) => {
  const path = usePathname();
  const { data, error, isLoading, refetch, isFetching } =
    useGetStaffProfileQuery();

  const { data: status, isLoading: isLoadingSupervisor } =
    useGetSupervisorAndHODStatusQuery(
      { employeeId: data?.data?.employeeId ?? "" },
      { skip: !data?.data?.employeeId },
    );

  if (isLoading || isLoadingSupervisor) return <PageLoader />;
  if (error)
    return (
      <NetworkError
        error={error as IApiError}
        refetch={refetch}
        isFetching={isFetching}
      />
    );

  const dynamicTabs: Tab[] = [...baseTabs];

  if (status?.data.supervisor || status?.data?.hod) {
    const directReportsDropdown = [];

    if (status?.data.supervisor) {
      directReportsDropdown.push({
        title: "My Direct Reports",
        subTitle: "Approve supervisee’s leave applications",
        path: AuthRouteConfig.STAFF_LEAVE_MY_DIRECT_REPORT,
        icon: <SquareIcon />,
        iconBgColor: "text-[#FFC400]",
      });
    }

    if (status?.data?.hod) {
      directReportsDropdown.push({
        title: "My Team",
        subTitle: "Approve your team’s leave applications",
        path: AuthRouteConfig.STAFF_LEAVE_MY_TEAMS,
        icon: <SquareIcon />,
        iconBgColor: "text-[#5243AA]",
      });
    }

    if (directReportsDropdown.length > 0) {
      dynamicTabs.push({
        label: directReportsDropdown[0].title,
        query: AuthRouteConfig.STAFF_LEAVE_MY_DIRECT_REPORT,
        title: directReportsDropdown[0].title,
        dropdown: {
          title: "PAGES",
          items: directReportsDropdown,
        },
      });
    }
  }

  const { item: activeDropdownItem, tabIndex } = getActiveDropDown(
    path,
    dynamicTabs,
  );

  if (activeDropdownItem && tabIndex !== -1) {
    dynamicTabs[tabIndex] = {
      ...dynamicTabs[tabIndex],
      label: activeDropdownItem.title,
      title: activeDropdownItem.title,
      query: activeDropdownItem.path,
    };
  }

  return <AppLayout pageTabs={dynamicTabs}>{children}</AppLayout>;
};

export default StaffRootLayout;
