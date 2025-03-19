"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { NoAuthorizationFound } from "@/components";
import { LOCAL_STORAGE_VALUES } from "@/constants/data";
import { AuthRouteConfig } from "@/constants/routes";
import { IVerifyUserResponse } from "@/redux/api";

import { OldUserMenu } from "./components/Menu";

type Props = {
  children: React.ReactNode;
};

const OldUserLayout = ({ children }: Props) => {
  const path = usePathname();
  const activeTab = path.split("/")[path.split("/").length - 1];
  const user = React.useMemo(() => {
    try {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_VALUES.RE_OLD_USER);
      return storedUser
        ? (JSON.parse(storedUser) as IVerifyUserResponse)
        : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      return null;
    }
  }, []);
  if (!user?.employeeId) {
    return (
      <NoAuthorizationFound
        btnText="Go back to login"
        link={AuthRouteConfig.LOGIN}
      />
    );
  }
  return (
    <main>
      <OldUserMenu
        currentTab={activeTab.split("-").join(" ").toLocaleUpperCase()}
      >
        {children}
      </OldUserMenu>
    </main>
  );
};

export default OldUserLayout;
