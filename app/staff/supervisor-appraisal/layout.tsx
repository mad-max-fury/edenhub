"use client";

import React from "react";
import { AuthRouteConfig } from "@/constants/routes";
import AppLayout from "@/layouts/appLayout";

const pageTabs = [
  {
    label: "Review Supervisor",
    query: AuthRouteConfig.STAFF_SUPERVISOR_APPRAISAL,
    title: "Performance",
  },
];

interface IStaffRootLayout {
  children: React.ReactNode;
}

const StaffRootLayout = ({ children }: IStaffRootLayout) => {
  return <AppLayout pageTabs={pageTabs}>{children}</AppLayout>;
};

export default StaffRootLayout;
