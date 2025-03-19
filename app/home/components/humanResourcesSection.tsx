"use client";

import Image from "next/image";
import { EmployeesDirectoryImage } from "@/assets/images";
import { HREmployeeMgt, HRPaidTimeOff, HRPerformanceMgt } from "@/assets/svgs";
import { Typography } from "@/components";

const HumanResourcesSection = () => {
  const texts = [
    {
      icon: <HREmployeeMgt />,
      title: "Employee Management",
      description:
        "From Hiring & Onboarding to Retiring, the Resource Edge Employee Management module  eliminates all the complexities & paperwork involved in managing your team.",
    },
    {
      icon: <HRPerformanceMgt />,
      title: "Performance Management",
      description:
        "Manage and track employee performance with our easy-to-use tools for goal setting, performance agreements and performance reviews. ",
    },
    {
      icon: <HRPaidTimeOff />,
      title: "Paid time off",
      description:
        "Employees can request for paid time off, vacations, sick leaves or educational leaves and get approvals all within Resource Edge. HR managers can equally ensure compliance.",
    },
  ];

  return (
    <section className="bg-N20 px-[9.75rem] py-[5rem] mmd:px-[5rem] msm:px-[1.5rem] mxs:px-4">
      <div className="mx-auto max-w-screen-2xl">
        <Typography
          variant="h-xxl"
          fontWeight="bold"
          className="text-[#091E42]"
        >
          Human Resources
        </Typography>
        <Typography
          variant="p-l"
          color="N300"
          fontWeight="medium"
          className="mb-20 mt-6"
        >
          Onboard new employees, manage the employee lifecycle and measure
          employee performance.
        </Typography>
      </div>
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-stretch gap-6 mxl:flex-col">
        {texts.map((text, index) => (
          <div
            className="rounded-2xl bg-white p-8 shadow-[0_18px_31px_#091E420F]"
            key={index}
          >
            <div className="mb-8">{text.icon}</div>
            <Typography
              color={"text-default"}
              fontWeight="bold"
              className="mb-2 text-[20px] leading-8"
            >
              {text.title}
            </Typography>
            <Typography variant="p-m" color={"N70"}>
              {text.description}
            </Typography>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-[112px] flex max-w-screen-2xl items-center justify-center drop-shadow-image-drop-shadow">
        <Image
          src={EmployeesDirectoryImage}
          width={1000}
          height={1000}
          alt="Employees Directory Image"
        />
      </div>
    </section>
  );
};

export default HumanResourcesSection;
