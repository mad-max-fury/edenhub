"use client";

import { InfoBlueIcon } from "@/assets/svgs";

import { Typography } from "../typography";

interface IFormInfoBannerProps {
  title: string;
  description: string;
  className?: string;
}
export const FormInfoBanner = ({
  title,
  description,
}: IFormInfoBannerProps) => {
  return (
    <div className="flex gap-4 rounded-[4px] bg-B50 p-4">
      <div>
        <InfoBlueIcon />
      </div>
      <div>
        <Typography variant="p-m" color="N800" fontWeight="bold">
          {title}
        </Typography>
        <Typography
          variant="p-m"
          color="N900"
          fontWeight="regular"
          className="mt-2"
        >
          {description}
        </Typography>
      </div>
    </div>
  );
};
