import React from "react";
import { Typography } from "@/components";

interface InfoCardProps {
  title: string;
  value: string;
  subtitle?: string;
}
export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  value,
  subtitle,
}) => {
  return (
    <div className="h-full rounded-[8px] border border-N30 px-2 py-4">
      <Typography
        variant="h-s"
        fontWeight="medium"
        color="N900"
        className="text-center"
      >
        {title}
      </Typography>
      <Typography
        variant="h-xl"
        fontWeight="bold"
        color="N900"
        className="mt-2 text-center"
      >
        {value}
      </Typography>
      <Typography
        variant="p-s"
        fontWeight="regular"
        color="N400"
        className="text-center"
      >
        {subtitle}
      </Typography>
    </div>
  );
};
