"use client";

import { AdminLogisticsImage, FinanceImage } from "@/assets/images";
import {
  AssetManagementIcon,
  PayrollIcon,
  REVoucherIcon,
  TravelandLogisticsIcon,
} from "@/assets/svgs";

import {
  CompaniesSection,
  ContentSection,
  FooterSection,
  HeroSection,
  HumanResourcesSection,
  Navigation,
} from "./components";

const HomePage = () => {
  const contentsArray = [
    {
      title: "Admin & Logistics",
      description:
        "Manage and track company assets as well as logistics for travelling employees",
      contents: [
        {
          icon: <TravelandLogisticsIcon />,
          title: "Travel & Logistics",
          description:
            "Make travel requests, get approvals, and have access to travel information.",
        },
        {
          icon: <AssetManagementIcon />,
          title: "Asset Management",
          description:
            "Manage the acquisition, assignment, and disposition of assets seamlessly.",
        },
      ],
      image: AdminLogisticsImage,
    },
    {
      title: "Finance",
      description:
        "Generate invoices, track expenditure, and manage complex payrolls for multiple teams and companies",
      contents: [
        {
          icon: <REVoucherIcon />,
          title: "RE Vouchers",
          description:
            "Track and manage expenditure for multiple teams across your organisation using Resource Edge Vouchers.",
        },
        {
          icon: <PayrollIcon />,
          title: "Payroll",
          description:
            "Our easy to use systems takes away the pain of managing complex payrolls for organisations of all sizes.",
        },
      ],
      image: FinanceImage,
    },
  ];

  return (
    <section className="">
      <Navigation />
      <HeroSection />
      <HumanResourcesSection />
      {contentsArray.map((content, index) => (
        <ContentSection data={content} key={index} />
      ))}
      <CompaniesSection />
      <FooterSection />
    </section>
  );
};

export default HomePage;
