"use client";

import Link from "next/link";
import {
  FooterFb,
  FooterIg,
  FooterLin,
  FooterLogo,
  FooterTwt,
} from "@/assets/svgs";
import { Typography } from "@/components";

const FooterSection = () => {
  const socials = [
    { icon: <FooterFb />, href: "" },
    { icon: <FooterTwt />, href: "" },
    { icon: <FooterLin />, href: "" },
    { icon: <FooterIg />, href: "" },
  ];

  return (
    <footer className="w-[inherit] bg-[#091E42] px-[9.75rem] py-[5rem] text-N0 mmd:px-[5rem]">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between mlg:flex-col mlg:gap-16 mlg:p-[3.5rem]">
        <div className="flex flex-col gap-1">
          <FooterLogo />
          <Typography className="text-[18px] font-[450] text-[inherit]">
            Throw paperwork into the trash.
          </Typography>
        </div>
        <div className="flex flex-col gap-2 mlg:gap-12">
          <div className="flex items-center justify-end gap-5 mlg:justify-center">
            {socials.map((social, index) => (
              <Link
                href={social.href}
                key={index}
                className="transition delay-150 duration-150 ease-in-out hover:-translate-y-1"
              >
                {social.icon}
              </Link>
            ))}
          </div>
          <Typography className="text-center text-[18px] text-[inherit]">
            Copyright © Tenece Professional Services. All rights reserved
          </Typography>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
