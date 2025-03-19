"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthRouteConfig } from "@/constants/routes";
import { UserContext } from "@/layouts/appLayout";
import { cn } from "@/utils/helpers";

import { GlobalStaffSearch } from "../globalSearch/globalSearch";
import { AppLogo } from "../logo/logo";
import { SideBar } from "../sideBar/sideBar";
import { Tab, TabPopover } from "../tabs";
import { Typography } from "../typography";
import { UserDropDown } from "../userDropDown/userDropDown";

type IProps = {
  children?: React.ReactNode;
  pageTabs?: Tab[];
  pathName?: string;
  moduleTitle?: string;
};
const sideBarItems = [
  {
    title: "Dashboard",
    path: AuthRouteConfig.DASHBOARD,
    pageTitle: "Dashboard",
  },
  {
    title: "Organizational Setup",
    path: AuthRouteConfig.ORGANIZATIONAL_SETUP_COMPANIES,
    pageTitle: "Organizational Setup",
  },
  {
    title: "User Management",
    path: AuthRouteConfig.USER_MANAGEMENT_USERS,
    pageTitle: "User Management",
  },
  {
    title: "Onboarding",
    path: AuthRouteConfig.STAFF_ONBOARDING,
    pageTitle: "Onboarding",
  },
  {
    title: "Employee Management",
    path: AuthRouteConfig.EMPLOYEE_MANAGEMEN_ALL_EMPLOYEE,
    pageTitle: "Employee Management",
  },
  {
    title: "HR Analytics",
    path: AuthRouteConfig.HR_ANALYTICS,
    pageTitle: "HR Analytics",
  },
  {
    title: "Leave/Time Off",
    path: AuthRouteConfig.STAFF_LEAVE_OVERVIEW,
    pageTitle: "Leave/Time Off",
  },
  {
    title: "Leave Management",
    path: AuthRouteConfig.STAFF_LEAVE_REQUESTS,
    pageTitle: "Leave Management",
  },
  {
    title: "Supervisor Appraisal",
    path: AuthRouteConfig.STAFF_SUPERVISOR_APPRAISAL,
    pageTitle: "Supervisor Appraisal",
  },
];
export const GlobalMenu = ({
  children,
  pageTabs,
  pathName,
  moduleTitle,
}: IProps) => {
  const isAdmin = true;
  const [isSidenav, setIsSideNav] = useState(false);
  const user = useContext(UserContext);

  const menuItems = user?.user?.menus.map((item) => item.menu);
  useEffect(() => setIsSideNav(true), []);

  const sideMenus = useMemo(() => {
    return sideBarItems.filter((item) =>
      item.title ? [...(menuItems ?? [])]?.includes(item.title) : true,
    );
  }, [menuItems]);

  return (
    <>
      <nav
        className={cn(
          "sticky left-0 right-0 top-0 isolate z-30 flex h-[clamp(64px,_4vw,_72px)] items-center justify-between bg-N0 px-[clamp(12px,_3vw,_24px)]",
          (pageTabs?.length as number) > 0 ? "" : "page-tab-box-shadow",
        )}
      >
        <div className="z-[1] flex h-[40px] items-center">
          <span className="flex h-full w-fit items-center gap-4">
            {isSidenav && <SideBar title="MODULES" items={sideMenus} />}
            <AppLogo />
          </span>
          <div className="mx-4 h-[24px] w-[1px] bg-N50" />
          <Typography variant="h-xs" fontWeight="regular" color="N900">
            {moduleTitle ??
              pageTabs?.find((tab) => pathName?.startsWith(tab.query))?.title ??
              sideMenus.find((tab) => pathName?.startsWith(tab.path))
                ?.pageTitle ??
              "Module Title"}
          </Typography>
        </div>
        <div className="z-[-1] flex items-center gap-2">
          {isAdmin && <GlobalStaffSearch />}
          {/* <AppNotification /> */}
          <UserDropDown />
        </div>
      </nav>
      {pageTabs && children ? (
        <TabPopover tabs={pageTabs ?? []} activeTab={pathName ?? ""}>
          {children}
        </TabPopover>
      ) : !pageTabs && children ? (
        <div className="container mx-auto mt-12 h-[calc(100dvh_-_clamp(64px,_4vw,_72px))] pb-8 mmd:px-6">
          {children}
        </div>
      ) : null}
    </>
  );
};
