"use client";

import React from "react";

import { Avatar } from "../avatar";
import { Badge } from "../badge/Badge";
import { Typography } from "../typography";

type EmployeeCardProps = {
  fullname: string;
  isReviewed?: boolean;
  rating?: number;
  profilePicture?: string | null;
};

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  fullname,
  isReviewed = false,
  rating,
  profilePicture = null,
}) => {
  return (
    <div className="mb-10 flex flex-col w-56 items-center gap-10 border px-10 pb-5 pt-5 transition-shadow duration-200 focus-within:shadow-lg hover:shadow-md">
      <div className="relative">
        {isReviewed && rating !== undefined && (
          <span
            className="absolute -right-11 -top-3 z-30 rounded-full border-4 border-white bg-[#F4F5F7] px-3 py-2"
            aria-label={`Rating: ${rating}`}
          >
            {rating.toFixed(2)}
          </span>
        )}

        <Avatar fullname={fullname} size="xl" src={profilePicture} />
      </div>

      <Typography>{fullname}</Typography>

      {isReviewed ? (
        <Badge className="px-7 text-lg" text="Reviewed" variant="green" />
      ) : (
        <Badge text="Pending Review" variant="yellow" />
      )}
    </div>
  );
};
