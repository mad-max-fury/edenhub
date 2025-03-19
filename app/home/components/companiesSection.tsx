"use client";

import { GenesysLogo, PeiwaLogo, TeneceLogo, UNNLogo } from "@/assets/svgs";

const CompaniesSection = () => {
  return (
    <section className="w-[inherit] px-[9.75rem] py-[15rem] msm:p-20 mxs:p-5">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-evenly mxl:flex-col mxl:gap-8">
        <div className="flex items-center justify-between gap-20 mxs:flex-col">
          <UNNLogo />
          <TeneceLogo />
        </div>
        <div className="flex items-center justify-between gap-20 mxs:flex-col">
          <PeiwaLogo />
          <GenesysLogo />
        </div>
      </div>
    </section>
  );
};

export default CompaniesSection;
