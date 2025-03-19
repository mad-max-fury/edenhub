"use client";

import React from "react";
import Image from "next/image";
import { logoTextAdmin, logoTextEmployee } from "@/assets/images";
import { LogoMini } from "@/assets/svgs";
import { cn } from "@/utils/helpers";

interface IProps {
  isAdmin?: boolean;
  remain?: boolean;
}
export const AppLogo = ({ isAdmin = false, remain = false }: IProps) => {
  return (
    <>
      <LogoMini className={cn("hidden mmd:block", remain && "mmd:hidden")} />
      <Image
        src={isAdmin ? logoTextAdmin : logoTextEmployee}
        alt="logo"
        placeholder="blur"
        className={cn(
          "h-[24px] object-contain mmd:hidden",
          isAdmin ? "w-[212px]" : "w-[144px]",
          remain && "mmd:block",
        )}
      />
    </>
  );
};
