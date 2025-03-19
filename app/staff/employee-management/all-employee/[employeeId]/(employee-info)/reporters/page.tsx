"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NetworkError, PageLoader, SideTab } from "@/components";
import { CURRENT_YEAR } from "@/constants/data";
import { useGetAppraisalCycleQuery } from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";

import { DirectsReports, Supervisors } from "./components";
import { REPORTERS_TAB_QUERIES as TAB_QUERIES } from "./constants";

type Props = {
  params: { employeeId: string };
};

interface Tab {
  label: string;
  query: string;
  count?: number;
  content: React.ReactNode;
  isDisabled?: boolean;
}
const Page = (props: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("t") || TAB_QUERIES[0];
  const {
    data: cycle,
    isLoading: isLoadingCycle,
    isFetching,
    error,
    refetch,
  } = useGetAppraisalCycleQuery(CURRENT_YEAR);
  const currentCycle = cycle?.data?.[cycle.data.length - 1];
  const tabs: Tab[] = [
    {
      label: "Supervisors",
      query: TAB_QUERIES[0],
      content: (
        <Supervisors
          reviewId={currentCycle?.id ?? ""}
          empId={props?.params?.employeeId ?? ""}
          year={CURRENT_YEAR}
        />
      ),
    },
    {
      label: "Direct Reports",
      query: TAB_QUERIES[1],
      content: (
        <DirectsReports
          reviewId={currentCycle?.id ?? ""}
          empId={props?.params?.employeeId ?? ""}
          year={CURRENT_YEAR}
        />
      ),
    },
  ];
  const handleTabChange = (query: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("t", query);
    router.push(`?${newSearchParams.toString()}`, { scroll: true });
  };

  if (isLoadingCycle) return <PageLoader />;
  if (error)
    return (
      <NetworkError
        error={error as IApiError}
        refetch={refetch}
        isFetching={isFetching}
      />
    );
  return (
    <div className="ml-auto mt-4 flex w-full">
      <SideTab
        tabs={tabs}
        onChange={(query) => {
          handleTabChange(query);
        }}
        activeTab={activeTab}
      />
    </div>
  );
};

export default Page;
