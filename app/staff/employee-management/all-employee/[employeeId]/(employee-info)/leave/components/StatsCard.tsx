import React from "react";
import { LeaveStatsIcon } from "@/assets/svgs";
import { Typography } from "@/components";
import { ILeaveStats } from "@/redux/api";
import { cn } from "@/utils/helpers";

interface StatsCardProps {
  title: string;
  values?: ILeaveStats;
}
export const StatsCard: React.FC<StatsCardProps> = ({ title, values }) => {
  return (
    <div className="flex h-full items-center gap-6 rounded-[8px] border border-N30 px-5 py-6">
      {/* <div className={cn("", iconColor && iconColor)}>
        <LeaveStatsIcon />
      </div> */}
      <div className="flex flex-col gap-1">
        <Typography variant="h-m" fontWeight="medium" color="N900">
          {title}
        </Typography>
        <Typography variant="p-m" fontWeight="regular" color="text-light">
          {/* {value} */}
        </Typography>
        <ul>
          <li className="flex whitespace-nowrap">
            {" "}
            <Typography variant="p-m" color={"N400"} fontWeight={"regular"}>
              {" "}
              Annual Leave -{" "}
              <b className="text-neutral-700">{values?.annualLeave} days</b>
            </Typography>
          </li>
          <li>
            <Typography variant="p-m" color={"N400"} fontWeight={"regular"}>
              Maternity Leave -{" "}
              <b className="text-neutral-700">{values?.maternityLeave} days</b>
            </Typography>{" "}
          </li>
          <li>
            <Typography variant="p-m" color={"N400"} fontWeight={"regular"}>
              Sick Leave -{" "}
              <b className="text-neutral-700">{values?.sickLeave} days</b>
            </Typography>{" "}
          </li>
        </ul>
      </div>
    </div>
  );
};
