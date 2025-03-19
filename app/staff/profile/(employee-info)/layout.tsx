"use client";

import React from "react";

import LayoutResolver from "./layoutResolver";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
      <LayoutResolver>{children}</LayoutResolver>
  );
};

export default Layout;
