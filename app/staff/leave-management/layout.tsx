"use client";

import React from "react";
import { AuthRouteConfig } from "@/constants/routes";
import AppLayout from "@/layouts/appLayout";

const pageTabs = [
  {
    label: "Leave Requests",
    query: AuthRouteConfig.STAFF_LEAVE_REQUESTS,
    title: "Leave Requests",
  },
  {
    label: "Leave Types",
    query: AuthRouteConfig.STAFF_LEAVE_TYPES,
    title: "Leave Types",
  },
];

interface IStaffRootLayout {
  children: React.ReactNode;
}

const StaffRootLayout = ({ children }: IStaffRootLayout) => {
  return <AppLayout pageTabs={pageTabs}>{children}</AppLayout>;
};

export default StaffRootLayout;
