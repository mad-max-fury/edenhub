"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AppLogo, Typography, UserDropDown } from "@/components";
import { LOCAL_STORAGE_VALUES } from "@/constants/data";
import { AuthRouteConfig } from "@/constants/routes";
import { IVerifyUserResponse } from "@/redux/api";
import { cn } from "@/utils/helpers";

type IProps = {
  children?: React.ReactNode;
  currentTab: string;
};

export const OldUserMenu = ({ children, currentTab }: IProps) => {
  const isAdmin = false;
  const router = useRouter();

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

  const handleOldUserLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_VALUES.RE_OLD_USER);
    router.push(AuthRouteConfig.HOME);
  };

  return (
    <>
      <nav
        className={cn(
          "sticky left-0 right-0 top-0 isolate z-30 flex h-[clamp(64px,_4vw,_72px)] items-center justify-between bg-N0 px-[clamp(12px,_3vw,_24px)] page-tab-box-shadow",
        )}
      >
        <div className="flex h-[40px] items-center">
          <span className="flex h-full w-fit items-center gap-4">
            <AppLogo isAdmin={isAdmin} />
          </span>
          <div className="mx-4 h-[24px] w-[1px] bg-N50" />
          <Typography variant="h-xs" fontWeight="regular" color="N900">
            {currentTab}
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <UserDropDown
            oldUser
            user={user}
            olduserLogout={handleOldUserLogout}
          />
        </div>
      </nav>

      <div className="container mx-auto mt-12 h-[calc(100dvh_-_clamp(64px,_4vw,_72px))] mmd:px-6">
        {children}
      </div>
    </>
  );
};
