"use client";

import React, { useCallback, useContext, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CloseXIcon, HamburgerMainIcon } from "@/assets/svgs";
import { apiKey, appraisalAppUrl, appraisalBaseApiUrl } from "@/config";
import { UserContext } from "@/layouts/appLayout";
import { cn } from "@/utils/helpers";
import axios from "axios";

import { Drawer } from "../drawer/drawer";
import { AppLogo } from "../logo/logo";
import { notify } from "../notifications/notify";
import { Typography } from "../typography";

interface MenuItem {
  title: string;
  path: string | (() => void);
}
interface Menu {
  title: string;
  items: MenuItem[];
}
export const SideBar = ({ title = "MODULES", items = [] }: Menu) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const user = useContext(UserContext);

  const handleOpenDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const handleCloseDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${appraisalBaseApiUrl}/v1/Auth/login-from-main?username=${user?.user?.username}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": `${apiKey}`,
          },
        },
      );
      if (response?.status === 200) {
        const dummyLink = document.createElement("a");
        dummyLink.href = `${appraisalAppUrl}/link?email=${user?.user?.username}&identifier=${apiKey}`;
        dummyLink.target = "_blank";
        document.body.appendChild(dummyLink);
        dummyLink.click();
        handleCloseDrawer();
      }
    } catch (err) {
      notify.error({
        message: "Access Denied",
        subtitle: "You cannot access this resource!!",
      });
    } finally {
      setLoading(false);
    }
  }, [user?.user?.username, handleCloseDrawer]);

  const itemsIncludingReroute = useMemo(
    () => [
      ...items,
      {
        title: loading ? "Processing..." : "Self Appraisals",
        path: fetchData,
      },
    ],
    [loading, items, fetchData],
  );

  return (
    <>
      <button onClick={handleOpenDrawer}>
        <HamburgerMainIcon />
      </button>
      <Drawer
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        anchor="left"
        selector="drawer-root" // portal id selector
        header={
          <div className="flex items-center gap-1">
            <CloseXIcon
              onClick={handleCloseDrawer}
              className={
                "cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.4] hover:opacity-90"
              }
            />
            <AppLogo remain />
          </div>
        }
      >
        <div className={"flex h-full w-full flex-col"}>
          <Typography variant={"h-xs"} fontWeight={"bold"} color={"N200"}>
            {title}
          </Typography>

          <div className="mt-4 flex w-full flex-col gap-2">
            {itemsIncludingReroute.map((item, index) => (
              <NavLinkBtn key={index} {...item} />
            ))}
          </div>
        </div>
      </Drawer>
    </>
  );
};

const NavLinkBtn = ({ title, path }: MenuItem) => {
  const pathName = usePathname();
  const findActiveLink = (root: string) =>
    pathName?.split("/")[2] === root?.split("/")[2];
  const isFunction = typeof path === "function";
  return isFunction ? (
    <button
      onClick={path}
      className={cn(
        "rounded-[2px] p-[8px_12px] text-N900 transition-all duration-300 ease-in-out",
        "bg-transparent hover:bg-N10 hover:text-B300",
      )}
    >
      <Typography
        variant="p-m"
        className="text-[inherit] transition-all duration-300 ease-in-out"
      >
        {title}
      </Typography>
    </button>
  ) : (
    <Link
      href={path ?? ""}
      className={cn(
        "rounded-[2px] p-[8px_12px] text-N900 transition-all duration-300 ease-in-out",
        findActiveLink(path)
          ? "bg-N20 text-B400 hover:bg-N30"
          : "bg-transparent hover:bg-N10 hover:text-B300",
      )}
    >
      <Typography
        variant="p-m"
        className="text-[inherit] transition-all duration-300 ease-in-out"
      >
        {title}
      </Typography>
    </Link>
  );
};
