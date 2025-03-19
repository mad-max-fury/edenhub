"use client";

import React from "react";
import AppLayout from "@/layouts/appLayout";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return <AppLayout moduleTitle="Profile">{children}</AppLayout>;
};

export default Layout;
