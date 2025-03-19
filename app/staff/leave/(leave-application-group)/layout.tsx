"use client";

import React from "react";
import AppLayout from "@/layouts/appLayout";

interface IStaffRootLayout {
  children: React.ReactNode;
}

const StaffRootLayout = ({ children }: IStaffRootLayout) => {
  return <AppLayout moduleTitle="Leave Application">{children}</AppLayout>;
};

export default StaffRootLayout;
