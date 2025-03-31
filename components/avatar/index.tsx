"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { EditBlueIcon } from "@/assets/svgs";
import {
  checkIfFilesAreTooBig,
  checkIfImagesAreCorrectType,
  cn,
  getInitials,
} from "@/utils/helpers";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";

import { notify } from "../notifications/notify";
import { Typography } from "../typography";
import { number } from "yup";

const bgColorInitials = ["B", "R", "Y", "G", "P", "T"];
const textColorInitials = ["N"];

const textColorClasses = {
  // Light Brown
  LB50: "text-LB50",
  LB75: "text-LB75",
  LB100: "text-LB100",
  LB200: "text-LB200",
  LB300: "text-LB300",
  LB400: "text-LB400",
  LB500: "text-LB500",
  // Brown
  BR50: "text-BR50",
  BR75: "text-BR75",
  BR100: "text-BR100",
  BR200: "text-BR200",
  BR300: "text-BR300",
  BR400: "text-BR400",
  BR500: "text-BR500",
  // Blue
  B50: "text-B50",
  B75: "text-B75",
  B100: "text-B100",
  B200: "text-B200",
  B300: "text-B300",
  B400: "text-B400",
  B500: "text-B500",

  // Red
  R50: "text-R50",
  R75: "text-R75",
  R100: "text-R100",
  R200: "text-R200",
  R300: "text-R300",
  R400: "text-R400",
  R500: "text-R500",

  // Yellow
  Y50: "text-Y50",
  Y75: "text-Y75",
  Y100: "text-Y100",
  Y200: "text-Y200",
  Y300: "text-Y300",
  Y400: "text-Y400",
  Y500: "text-Y500",

  // Green
  G50: "text-G50",
  G75: "text-G75",
  G100: "text-G100",
  G200: "text-G200",
  G300: "text-G300",
  G400: "text-G400",
  G500: "text-G500",

  // Purple
  P50: "text-P50",
  P75: "text-P75",
  P100: "text-P100",
  P200: "text-P200",
  P300: "text-P300",
  P400: "text-P400",
  P500: "text-P500",

  // Teal
  T50: "text-T50",
  T75: "text-T75",
  T100: "text-T100",
  T200: "text-T200",
  T300: "text-T300",
  T400: "text-T400",
  T500: "text-T500",

  // Neutral (Light)
  N0: "text-N0",
  N10: "text-N10",
  N20: "text-N20",
  N30: "text-N30",
  N40: "text-N40",
  N50: "text-N50",

  // Neutral (Mid)
  N60: "text-N60",
  N70: "text-N70",
  N80: "text-N80",
  N90: "text-N90",
  N100: "text-N100",
  N200: "text-N200",
  N300: "text-N300",
  N400: "text-N400",

  // Neutral (Dark)
  N500: "text-N500",
  N600: "text-N600",
  N700: "text-N700",
  N800: "text-N800",
  N900: "text-N900",

  //Text Colors
  "text-default": "text-text-default",
  "text-light": "text-text-light",
};
const bgColorClasses = {
  // Blue
  B50: "bg-B50",
  B75: "bg-B75",
  B100: "bg-B100",
  B200: "bg-B200",
  B300: "bg-B300",
  B400: "bg-B400",
  B500: "bg-B500",

  // Red
  R50: "bg-R50",
  R75: "bg-R75",
  R100: "bg-R100",
  R200: "bg-R200",
  R300: "bg-R300",
  R400: "bg-R400",
  R500: "bg-R500",

  // Yellow
  Y50: "bg-Y50",
  Y75: "bg-Y75",
  Y100: "bg-Y100",
  Y200: "bg-Y200",
  Y300: "bg-Y300",
  Y400: "bg-Y400",
  Y500: "bg-Y500",

  // Green
  G50: "bg-G50",
  G75: "bg-G75",
  G100: "bg-G100",
  G200: "bg-G200",
  G300: "bg-G300",
  G400: "bg-G400",
  G500: "bg-G500",

  // Purple
  P50: "bg-P50",
  P75: "bg-P75",
  P100: "bg-P100",
  P200: "bg-P200",
  P300: "bg-P300",
  P400: "bg-P400",
  P500: "bg-P500",

  // Teal
  T50: "bg-T50",
  T75: "bg-T75",
  T100: "bg-T100",
  T200: "bg-T200",
  T300: "bg-T300",
  T400: "bg-T400",
  T500: "bg-T500",

  // Neutral (Light)
  N0: "bg-N0",
  N10: "bg-N10",
  N20: "bg-N20",
  N30: "bg-N30",
  N40: "bg-N40",
  N50: "bg-N50",

  // Neutral (Mid)
  N60: "bg-N60",
  N70: "bg-N70",
  N80: "bg-N80",
  N90: "bg-N90",
  N100: "bg-N100",
  N200: "bg-N200",
  N300: "bg-N300",
  N400: "bg-N400",

  // Neutral (Dark)
  N500: "text-N500",
  N600: "text-N600",
  N700: "text-N700",
  N800: "text-N800",
  N900: "text-N900",

  //Text Colors
  "text-default": "text-text-default",
  "text-light": "text-text-light",
};
const getRandomColor = (
  strArray: string[],
  minWeight: number = 300,
  maxWeight: number = 500
) => {
  const colorKeys = Object.keys(bgColorClasses).filter(
    (key) =>
      strArray.includes(key[0]) &&
      parseInt(key.slice(1)) >= minWeight &&
      parseInt(key.slice(1)) <= maxWeight
  );
  const randomIndex = Math.floor(Math.random() * colorKeys.length);
  return colorKeys[randomIndex] as keyof typeof bgColorClasses;
};
interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  className?: string;
  fullname: string;
  colorStyles?: {
    bgColor: keyof typeof bgColorClasses;
    textColor: keyof typeof textColorClasses;
  };
  upload?: boolean;
  onFileUpload?: (file: File) => void;
  onFileDelete?: () => void;
}

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
  xxl: 105,
};

const textClasses = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  xxl: "text-4xl",
  xxxl: "text-4xl",
};

const sizeClasses = {
  xs: "!w-6 !h-6 text-xs",
  sm: "!w-8 !h-8 text-sm",
  md: "!w-12 !h-12 text-base",
  lg: "!w-16 !h-16 text-lg",
  xl: "!w-24 !h-24 text-xl",
  xxl: "!w-[105px] !h-[105px] text-4xl",
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  size = "md",
  className = "",
  fullname,
  colorStyles,
  upload,
  onFileUpload,
  onFileDelete,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const randomBgColor = React.useMemo(
    () => getRandomColor(bgColorInitials),
    []
  );
  const randomTextColor = React.useMemo(
    () => getRandomColor(textColorInitials, 0, 0),
    []
  );
  const bgColor = bgColorClasses[colorStyles?.bgColor ?? randomBgColor];
  const textColor = textColorClasses[colorStyles?.textColor ?? randomTextColor];
  const sizeClass = sizeClasses[size];
  const textClass = textClasses[size];
  const dimensionSize = sizeMap[size];

  const initials = getInitials(fullname);
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onFileUpload) {
      if (!checkIfFilesAreTooBig(file)) {
        notify.error({
          message: "Upload failed",
          subtitle: "The file you are trying to upload is too large",
        });
        return;
      }
      if (!checkIfImagesAreCorrectType(file)) {
        notify.error({
          message: "Upload failed",
          subtitle: "The file you are trying to upload is not an image",
        });
        return;
      }
      onFileUpload(file);
    }
  };

  const handleFileDelete = () => {
    if (onFileDelete) {
      onFileDelete();
    }
  };
  return (
    <div className="relative inline-block">
      <div
        className={cn(
          `inline-flex items-center justify-center overflow-hidden rounded-full`,
          bgColor,
          sizeClass,
          textColor,
          className
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            width={dimensionSize}
            height={dimensionSize}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className={cn(`font-medium`, textClass)}>{initials}</span>
        )}
        {upload && (
          <>
            <UploadButton
              uploadImgFunc={handleFileUpload}
              deletImgFunc={handleFileDelete}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept="image/*"
            />
          </>
        )}
      </div>
    </div>
  );
};

const UploadButton = ({
  uploadImgFunc,
  deletImgFunc,
}: {
  uploadImgFunc?: () => void;
  deletImgFunc?: () => void;
}) => {
  return (
    <Menu
      menuButton={
        <MenuButton className={"group h-fit w-fit"}>
          <button className="absolute bottom-0 right-0 z-10 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-B50 text-B400 shadow-md">
            <EditBlueIcon />
          </button>
        </MenuButton>
      }
      className={
        "mt-16 [&>ul.szh-menu]:!top-[30px] [&>ul.szh-menu]:!dropdown-menu-box-shadow"
      }
      transition
      align="end"
    >
      <div className={"w-[90vw] max-w-[202px]"}>
        <MenuItem className={"!p-3"} onClick={uploadImgFunc}>
          <Typography variant={"c-m"} color={"N800"} className="">
            Upload Image
          </Typography>
        </MenuItem>
        <MenuItem className={"!p-3"} onClick={deletImgFunc}>
          <Typography variant={"c-m"} color={"R500"} className="">
            Delete
          </Typography>
        </MenuItem>
      </div>
    </Menu>
  );
};
