"use client";

import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Avatar, notify, PageHeader, SideTab, Typography } from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { UserContext } from "@/layouts/appLayout";
import { RootState } from "@/redux";
import { useSelector } from "react-redux";

import { Breadcrumbs } from "@/components/breadCrumbs/breadCrumbs";

import { DcoumentForm } from "./components";

const CRUMBS = [
  { name: "Dashboard", path: AuthRouteConfig.STAFF_ONBOARDING },
  {
    name: "Documents",
    path: AuthRouteConfig.STAFF_ONBOARDING_DOCUMENTS,
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { document } = useSelector((state: RootState) => state.onboardingForm);
  const TAB_QUERIES = useMemo(
    () =>
      document?.employeeDocuments.map((doc) =>
        String(doc.requiredDocumentId),
      ) ?? [],
    [document?.employeeDocuments],
  );

  const activeTab = searchParams.get("t") || TAB_QUERIES[0];
  const data = useContext(UserContext);
  const fullname = `${data?.user?.firstname} ${data?.user?.lastname}`;
  const findTabIndex = (query: string) => TAB_QUERIES.indexOf(query);
  const activeTabIndex = findTabIndex(activeTab);
  const filledTabSeq = useMemo(
    () => document?.employeeDocuments?.map((doc) => Boolean(doc.file)),
    [document?.employeeDocuments],
  );

  const handleTabChange = useCallback(
    (query: string) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("t", query);
      router.push(`?${newSearchParams.toString()}`, { scroll: true });
    },
    [searchParams, router],
  );

  const isTabAccessible = useCallback(
    (tabIndex: number) => {
      return (
        filledTabSeq &&
        filledTabSeq.slice(0, tabIndex).every((isComplete) => isComplete)
      );
    },

    [filledTabSeq],
  );

  useEffect(() => {
    if (
      activeTabIndex !== 0 &&
      !isTabAccessible(activeTabIndex) &&
      filledTabSeq
    ) {
      const lastValidTabIndex = filledTabSeq.lastIndexOf(true);

      const nextTabIndex = lastValidTabIndex + 1;
      handleTabChange(TAB_QUERIES[nextTabIndex]);
      notify.error({ message: "Please complete previous tabs" });
    }
  }, [
    activeTabIndex,
    isTabAccessible,
    handleTabChange,
    filledTabSeq,
    TAB_QUERIES,
  ]);
  const tabs: Tab[] | undefined = document?.employeeDocuments?.map(
    (document, index) => {
      return {
        label: document.requiredDocument,
        query: String(document.requiredDocumentId),
        content: (
          <DcoumentForm
            document={document}
            index={index}
            key={String(document.requiredDocumentId)}
            tabQueries={TAB_QUERIES}
            onClick={(query) => handleTabChange(query)}
          />
        ),
        isDisabled: !isTabAccessible(index),
      };
    },
  );

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
            DOCUMENTS
          </Typography>
          <hr />
        </div>
      </div>
      <div className="sticky top-[100px] ml-auto w-full max-w-[936px]">
        {tabs && (
          <SideTab
            tabs={tabs}
            onChange={(query) => {
              const reqTabIndex = findTabIndex(query);
              if (isTabAccessible(Number(reqTabIndex))) {
                handleTabChange(query);
              } else {
                notify.error({
                  message: "Please complete previous tabs first",
                });
              }
            }}
            title="DOCUMENTS"
            activeTab={activeTab}
          />
        )}
      </div>
    </div>
  );
};

export default BioDataPage;
