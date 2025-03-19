"use client";

import React from "react";
import AppLayout from "@/layouts/appLayout";

interface IStaffRootLayout {
  children: React.ReactNode;
}

const StaffRootLayout = ({ children }: IStaffRootLayout) => {
  return <AppLayout moduleTitle="No Access">{children}</AppLayout>;
};

export default StaffRootLayout;
