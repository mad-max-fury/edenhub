"use client";

import Image from "next/image";
import { HeroImage } from "@/assets/images";
import { Typography } from "@/components";

const HeroSection = () => {
  return (
    <section className="bg-white px-[9.75rem] py-[8rem] mmd:px-[5rem] mmd:py-[2.5rem] msm:px-[1.5rem]">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-center gap-4 bg-transparent mxl:flex-col mxl:items-start mxl:justify-start">
        <div className="w-1/2 mxl:w-full">
          <Typography
            variant="h-xxl"
            fontWeight="bold"
            className="mb-4 text-[#091E42]"
          >
            Throw paperwork into the trash where it belongs.
          </Typography>
          <Typography
            variant="p-l"
            fontWeight="medium"
            className="mb-4 text-[#344563]"
          >
            Eliminate all the hassle involved in managing people operations by
            automating it.
          </Typography>
        </div>
        <div className="w-full grow bg-transparent mlg:mt-6">
          <Image
            src={HeroImage}
            alt="An illustration on the hero section"
            width={500}
            height={500}
            className="h-full w-full object-fill"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
