"use client";

import React from "react";
import { AuthRouteConfig } from "@/constants/routes";
import AppLayout from "@/layouts/appLayout";

const pageTabs = [
  {
    label: "All Employee",
    query: AuthRouteConfig.EMPLOYEE_MANAGEMEN_ALL_EMPLOYEE,
    title: "All Employee",
  },
  {
    label: "Enrollment",
    query: AuthRouteConfig.EMPLOYEE_MANAGEMENT_ENROLLMENT,
    title: "Enrollment",
  },
  // {
  //   label: "Document Templates",
  //   query: AuthRouteConfig.EMPLOYEE_MANAGEMENT_DOCUMENT_TEMPLATES,
  //   title: "Document Templates",
  // },
];

interface IStaffRootLayout {
  children: React.ReactNode;
}

const StaffRootLayout = ({ children }: IStaffRootLayout) => {
  return <AppLayout pageTabs={pageTabs}>{children}</AppLayout>;
};

export default StaffRootLayout;
