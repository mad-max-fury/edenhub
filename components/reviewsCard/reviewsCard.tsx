import React, { FC } from "react";
// import { IAppraiserStatus } from "@/redux/api/interface";

import { cn } from "@/utils/helpers"; // Assuming you have a cn utility for className merging

import { Avatar } from "../avatar";
import { Button, ButtonDropdown, ButtonDropdownItem } from "../buttons";
import { Typography } from "../typography";

interface QuarterlyCards {
  title: string;
  status: string;
  description: string;
  isMini?: boolean;
  dropdownItems: ButtonDropdownItem[];
}

interface ReviewCardsProps extends Omit<QuarterlyCards, "dropdownItems"> {
  reviewd: number;
  users: Array<{ firstName: string; lastName: string }>;
}

export const ReviewCard: FC<ReviewCardsProps> = ({
  description,
  status,
  title,
  reviewd,
  users,
  isMini = false,
}) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-N40 bg-N0",
        isMini ? "max-w-[264px] p-4 px-6" : "p-6",
      )}
    >
      <div className="flex items-center justify-between">
        <Typography
          className={cn("font-semibold", isMini ? "text-sm" : "text-xl")}
        >
          {title}
        </Typography>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <Typography className="rounded-full bg-B50 px-2 py-1 text-xs font-medium text-N800">
          {status}
        </Typography>
        <Typography className="text-sm font-medium text-N500">
          Reviewed: {reviewd} out of {users.length}
        </Typography>
      </div>

      <p className="mt-4 text-sm text-gray-600">{description}</p>

      <div className={cn(isMini ? "mt-3" : "mt-6", "flex items-center gap-2")}>
        <div className="flex -space-x-1">
          {users
            .map((user, index) => (
              <Avatar
                key={index}
                fullname={`${user.firstName} ${user.lastName}`}
                size="sm"
              />
            ))
            .slice(0, 4)}
        </div>
        <span className="">
          {users.length > 4 && (
            <Typography className="font-medium text-N500">
              +{users.length - 4}
            </Typography>
          )}
        </span>
      </div>

      <Button className={cn(isMini ? "mt-3" : "mt-8")} variant={"primary"}>
        Review Supervisor
      </Button>
    </div>
  );
};

export const QuarterlyCard: FC<QuarterlyCards> = ({
  title,
  status,
  description,
  isMini,
  dropdownItems,
}) => {
  return (
    <div className="bg-N0] max-w-[264px] border border-N20 p-4 pb-6">
      <div className="flex items-center justify-between">
        <Typography
          className={cn("font-semibold", isMini ? "text-sm" : "text-xl")}
        >
          {title}
        </Typography>
        <ButtonDropdown isVertical buttonGroup={dropdownItems} />
      </div>

      <div className="mt-1 flex items-center gap-4">
        <Typography className="rounded-full bg-B50 px-2 py-1 text-xs font-medium text-N800">
          {status}
        </Typography>
      </div>

      <Typography className="mt-3 text-sm text-N500">{description}</Typography>
    </div>
  );
};
