"use client";

import { type ReactNode } from "react";
import { AuthLeft, AuthRight } from "@/assets/svgs";
import { Typography } from "@/components";
import { appraisalAppUrl } from "@/config";

interface LayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <main className="relative flex h-screen w-screen items-center justify-center">
      <aside className="absolute bottom-0 left-0 -z-50 mmd:hidden">
        <AuthLeft />
      </aside>
      <aside className="absolute bottom-0 right-0 -z-50 mmd:hidden">
        <AuthRight />
      </aside>
      <div className="relative z-10">
        {children}

        <Typography
          variant="p-xl"
          fontWeight="regular"
          color="N500"
          className="mt-10 text-center"
        >
          Need to access the appraisal system?{" "}
          <a href={appraisalAppUrl} className="text-B400 hover:underline">
            Click here
          </a>
        </Typography>
      </div>
    </main>
  );
};

export default AuthLayout;
