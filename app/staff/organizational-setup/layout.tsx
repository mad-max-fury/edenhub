"use client";

import React from "react";
import { AuthRouteConfig } from "@/constants/routes";
import AppLayout from "@/layouts/appLayout";

const pageTabs = [
  {
    label: "Companies",
    query: AuthRouteConfig.ORGANIZATIONAL_SETUP_COMPANIES,
    title: "Companies",
  },
  {
    label: "Locations",
    query: AuthRouteConfig.ORGANIZATIONAL_SETUP_LOCATIONS,
    title: "Locations",
  },
  {
    label: "Business Units",
    query: AuthRouteConfig.ORGANIZATIONAL_SETUP_BUSINESS_UNITS,
    title: "Business Units",
  },
  {
    label: "Departments",
    query: AuthRouteConfig.ORGANIZATIONAL_SETUP_DEPARTMENTS,
    title: "Departments",
  },
  {
    label: "Job Designations",
    query: AuthRouteConfig.ORGANIZATIONAL_SETUP_JOB_DESIGNATION,
    title: "Job Designations",
  },
  {
    label: "Job Titles",
    query: AuthRouteConfig.ORGANIZATIONAL_SETUP_JOB_TITLES,
    title: "Job Titles",
  },
  {
    label: "Settings",
    query: AuthRouteConfig.ORGANIZATIONAL_SETUP_SETTINGS,
    title: "Settings",
  },
];

interface IStaffRootLayout {
  children: React.ReactNode;
}

const StaffRootLayout = ({ children }: IStaffRootLayout) => {
  return <AppLayout pageTabs={pageTabs}>{children}</AppLayout>;
};

export default StaffRootLayout;
