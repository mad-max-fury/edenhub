"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BadCircleIcon, GoodCircleIcon, PendingDotIcon } from "@/assets/svgs";
import { Typography } from "@/components";
import {
  EnrollmentDocumentStatus,
  ISelectItemPropsWithValueGeneric,
} from "@/redux/api/interface";

type Props = {
  item: ISelectItemPropsWithValueGeneric;
  status: EnrollmentDocumentStatus;
  isCompleted: boolean;
};

const OnBoardingFormTask = ({ item, status, isCompleted }: Props) => {
  const pathName = usePathname();
  return (
    <div className="flex items-center justify-between border-b border-solid border-N30 px-[27px] py-[15px] last-of-type:border-none">
      <div className="flex items-center gap-3">
        {status === "Pending" && isCompleted ? (
          <PendingDotIcon />
        ) : status === "Approved" && isCompleted ? (
          <GoodCircleIcon />
        ) : status === "Rejected" && isCompleted ? (
          <BadCircleIcon />
        ) : (
          <div className="h-[28px] w-[28px] rounded-full border border-solid border-N40 bg-N30" />
        )}

        <Typography variant="c-s" fontWeight={"medium"} color="text-default">
          {item.label}
        </Typography>
      </div>
      <div className="">
        {!isCompleted ? (
          <Typography variant="c-s" fontWeight={"medium"} color="N50">
            View
          </Typography>
        ) : (
          <Link href={`${pathName}/${item.value as number}`}>
            <Typography
              variant="c-s"
              className="hover:underline"
              fontWeight={"medium"}
              color="B400"
            >
              View
            </Typography>
          </Link>
        )}
      </div>
    </div>
  );
};

export default OnBoardingFormTask;
