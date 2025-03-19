"use client";

import React from "react";
import { AuthRouteConfig } from "@/constants/routes";
import AppLayout from "@/layouts/appLayout";

const pageTabs = [
  {
    label: "Users",
    query: AuthRouteConfig.USER_MANAGEMENT_USERS,
    title: "Users",
  },
  {
    label: "Roles",
    query: AuthRouteConfig.USER_MANAGEMENT_ROLES,
    title: "Roles",
  },
  {
    label: "Manage Menus",
    query: AuthRouteConfig.USER_MANAGEMENT_MANAGE_MENU,
    title: "Manage Menus",
  },
];

interface IStaffRootLayout {
  children: React.ReactNode;
}

const StaffRootLayout = ({ children }: IStaffRootLayout) => {
  return <AppLayout pageTabs={pageTabs}>{children}</AppLayout>;
};

export default StaffRootLayout;
