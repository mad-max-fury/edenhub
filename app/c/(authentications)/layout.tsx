"use client";

import { Footer, GlobalMenu } from "@/components";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <div>
      <GlobalMenu />
      <div className="min-h-[60vh] bg-default w-screen flex justify-center items-center  py-[100px] px-[clamp(12px,_3vw,_24px)]">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default AuthLayout;
