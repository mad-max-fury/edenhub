"use client";

import React, { useContext } from "react";
import { useSearchParams } from "next/navigation";
import { Avatar, PageHeader, SideTab, Typography } from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { UserContext } from "@/layouts/appLayout";

import { Breadcrumbs } from "@/components/breadCrumbs/breadCrumbs";

import { IDCardForm } from "./components";
import { TAB_QUERIES } from "./components/constants";

const CRUMBS = [
  { name: "Dashboard", path: AuthRouteConfig.STAFF_ONBOARDING },
  {
    name: "Identity Card Form",
    path: AuthRouteConfig.STAFF_ONBOARDING_ID_CARD,
  },
];

interface Tab {
  label: string;
  query: string;
  count?: number;
  content: React.ReactNode;
  isDisabled?: boolean;
}

const BioDataPage: React.FC = () => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("t") || TAB_QUERIES[0];
  const data = useContext(UserContext);
  const fullname = `${data?.user?.firstname} ${data?.user?.lastname}`;

  const tabs: Tab[] = [
    {
      label: "Identity Card Form",
      query: TAB_QUERIES[0],
      content: <IDCardForm />,
      isDisabled: false,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-[36px]">
      <div className="ml-auto mt-6 flex w-full max-w-[865px] items-center gap-4">
        <Avatar
          fullname={fullname}
          src={data?.user?.profilePicture}
          size={"xxl"}
        />
        <div className="ml-auto max-w-[744px] flex-1">
          <Breadcrumbs crumbs={CRUMBS} />
          <PageHeader
            title={fullname}
            // buttonGroup={
            //   <Button
            //     variant="secondary"
            //     onClick={() => {
            //       notify.success({ message: "Changes are saved" });
            //       router.push(AuthRouteConfig.STAFF_ONBOARDING);
            //     }}
            //   >
            //     Continue Later
            //   </Button>
            // }
          />
          <Typography variant="p-s" gutterBottom color="N500" className="">
            IDENTITY CARD FORM
          </Typography>
          <hr />
        </div>
      </div>
      <div className="sticky top-[100px] ml-auto w-full max-w-[936px]">
        <SideTab
          tabs={tabs}
          onChange={() => {}}
          title="DATA FORM"
          activeTab={activeTab}
        />
      </div>
    </div>
  );
};

export default BioDataPage;
