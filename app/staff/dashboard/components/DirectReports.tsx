import React, { useState } from "react";
import { TabUnderline } from "@/components";
import { WHO_AM_I } from "@/redux/api";

import { DirectReportsTable } from "./DirectReportsTable";
import { HODOrSupervisorTable } from "./HODOrSupervisorTable";

export interface IDirectReportsProps {
  reviewId: string;
  empId: string;
  year: number;
  title?: string;
}
export const DirectReports = ({
  reviewId,
  empId,
  year,
}: IDirectReportsProps) => {
  const [activeTab, setActiveTab] = useState("staff-list");

  const tabs = [
    {
      label: "HOD",
      query: "staff-list",
      content: (
        <HODOrSupervisorTable
          reviewId={reviewId}
          empId={empId}
          whoami={WHO_AM_I.hod}
          year={year}
        />
      ),
    },
    {
      label: "Supervisors",
      query: "roles",
      content: (
        <HODOrSupervisorTable
          reviewId={reviewId}
          empId={empId}
          whoami={WHO_AM_I.appraiser}
          year={year}
        />
      ),
    },
    {
      label: "Direct Reports",
      query: "schools",
      content: (
        <DirectReportsTable
          reviewId={reviewId}
          empId={empId}
          whoami={WHO_AM_I.appraiser}
          year={year}
        />
      ),
    },
  ];
  return (
    <div className="rounded-[8px] border border-N30">
      <TabUnderline
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        noMargin={true}
        className="pb-4 pt-8"
      />
    </div>
  );
};
