"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCookie } from "cookies-next";
import { cn } from "@/utils/helpers";
import { cookieValues } from "@/constants/data";
import { AppLogo } from "../logo/logo";
import { UserDropDown } from "../userDropDown/userDropDown";
import { SideBar } from "../sideBar/sideBar";
import { CartButton } from "../cart/CartButton";
import { GlobalSearchDropdown } from "../globalSearch/globalSearch";
import { useGetMeQuery } from "@/redux/api/auth";

const pathToMatch = "/";

export const GlobalMenu = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const isLoggedIn = !!getCookie(cookieValues.token);
  const { data: me } = useGetMeQuery(undefined, { skip: !isLoggedIn });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    handleScroll();
    if (pathname === pathToMatch) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setIsScrolled(false);
    }
  }, [pathname]);

  return (
    <nav
      className={cn(
        "left-0 right-0 top-0 isolate z-30 flex items-center  justify-between px-[clamp(12px,_3vw,_24px)] transition-colors duration-300 ease-in-out py-5",
        pathname === pathToMatch ? "fixed" : "sticky",
        pathname === pathToMatch && (isScrolled ? "bg-N0" : "bg-transparent"),
        pathname !== pathToMatch && "bg-N0",
      )}
    >
      <div className="flex items-center z-[1] justify-between mx-auto w-full max-w-screen-2xl ">
        <SideBar />

        <Link href={pathToMatch} aria-label="Eden Wood home">
          <AppLogo
            responsive
            size={"lg"}
            variant={
              pathname !== pathToMatch
                ? "textHorizontalBlack"
                : isScrolled && pathname === pathToMatch
                  ? "textHorizontalBlack"
                  : "textHorizontalWhite"
            }
          />
        </Link>

        <div className="z-[-1] isolate flex items-center gap-2">
          <GlobalSearchDropdown />
          <UserDropDown user={me?.data} />
          <CartButton />
        </div>
      </div>
    </nav>
  );
};
