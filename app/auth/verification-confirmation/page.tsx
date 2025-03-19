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
          Reset Password
        </Typography>

        <div className="mt-7 flex w-full flex-col items-center gap-4">
          <CheckedCircleIcon />
          <Typography variant="p-s" className="w-[60%] text-center text-N500">
            A recovery email has been sent to your email address.
          </Typography>
        </div>

        <Link
          href={AuthRouteConfig.LOGIN}
          className="flex w-full items-center justify-center border-t border-N40 pt-5 text-center"
        >
          <Typography variant="p-m" color="B400" className="cursor-pointer">
            Back to login
          </Typography>
        </Link>
      </div>
    </AuthWrapper>
  );
};

export default VerificationConfirmation;
