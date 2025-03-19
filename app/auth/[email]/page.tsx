"use client";

import React from "react";
import Link from "next/link";
import { CheckedCircleIcon } from "@/assets/svgs";
import { Typography } from "@/components";
import { AuthRouteConfig } from "@/constants/routes";

import AuthWrapper from "../components/authWrapper";

const VerificationConfirmation = () => {
  return (
    <AuthWrapper>
      <div className="flex w-full flex-col items-center gap-5">
        <Typography variant="h-l" fontWeight="bold">
          Update Successful!
        </Typography>

        <div className="mt-7 flex w-full flex-col items-center gap-4">
          <CheckedCircleIcon />
          <Typography variant="p-m" className="w-[70%] text-center text-N500">
            Thank you for updating your information. Your account is now fully
            synced with our new system. We’ve sent a follow up email to your
            registered address for login info.
          </Typography>
        </div>

        <Typography
          variant="p-s"
          color={"N300"}
          className="w-[70%] text-center"
        >
          If you don’t see the email within a few minutes, please check your
          spam folder or contact support team.
        </Typography>

        <Link
          href={AuthRouteConfig.LOGIN}
          className="flex w-full items-center justify-center border-t border-N40 pt-5 text-center"
        >
          <Typography variant="p-m" color="B400" className="cursor-pointer">
            Back to Login
          </Typography>
        </Link>
      </div>
    </AuthWrapper>
  );
};

export default VerificationConfirmation;
