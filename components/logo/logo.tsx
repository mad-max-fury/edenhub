"use client";

import React from "react";
import Image from "next/image";
import {
  logoIconMiniBlack,
  logoIconMiniWhite,
  logoTextVerticalBlack,
  logoTextVerticalWhite,
  logoTextHorizontalBlack,
  logoTextHorizontalWhite,
  logoTextHorinzontalYellow,
} from "@/assets/images";

import { cn } from "@/utils/helpers";
import useMediaQuery from "@/hooks/useMediaQuery";

type LogoVariant =
  | "iconMiniBlack"
  | "iconMiniWhite"
  | "textVerticalBlack"
  | "textVerticalWhite"
  | "textHorizontalBlack"
  | "textHorizontalWhite"
  | "textHorizontalYellow";

type LogoSize = "sm" | "md" | "lg" | "xlg";

interface IProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  onClick?: () => void;
  responsive?: boolean;
}

export const AppLogo = ({
  variant = "iconMiniBlack",
  size = "md",
  className,
  onClick,
  responsive = false,
}: IProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const logoMap = {
    iconMiniBlack: logoIconMiniBlack,
    iconMiniWhite: logoIconMiniWhite,
    textVerticalBlack: logoTextVerticalBlack,
    textVerticalWhite: logoTextVerticalWhite,
    textHorizontalBlack: logoTextHorizontalBlack,
    textHorizontalWhite: logoTextHorizontalWhite,
    textHorizontalYellow: logoTextHorinzontalYellow,
  };

  const sizeClasses = {
    sm: "h-[24px]",
    md: "h-[32px]",
    lg: "h-[40px]",
    xlg: "h-[60px]",
  };

  const displayVariant =
    responsive && isMobile
      ? variant.includes("White")
        ? "iconMiniWhite"
        : "iconMiniBlack"
      : variant;

  return (
    <div className="w-fit">
      <Image
        src={logoMap[displayVariant]}
        alt="Logo"
        placeholder="blur"
        onClick={onClick}
        className={cn(
          "object-contain w-fit aspect-auto",
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
};
