import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SideTab } from "@/components";

import { ViewDoc } from "./components";

export interface IDocumentView {
  taskId: number;
  title: string;
  description: string;
  completed: boolean;
  formDetails: IFormDetails;
}

export interface IFormDetails {
  formId: number;
  title: string;
  description: string;
  completed: boolean;
  approved: string;
  dateSubmitted: string;
  dateUpdated: string;
  employeeDocuments: IEmployeeDocument[];
}

export interface IEmployeeDocument {
  requiredDocumentId: number;
  requiredDocument: string;
  document: string;
}

type Props = {
  docs: unknown;
};

interface Tab {
  label: string;
  query: string;
  count?: number;
  content: React.ReactNode;
  isDisabled?: boolean;
}

export const DocumentView = ({ docs }: Props) => {
  const docsData = docs as IFormDetails;
  const router = useRouter();
  const searchParams = useSearchParams();
  const employeeDocs = docsData.employeeDocuments;
  console.log(employeeDocs, "employee documents", docs);

  const TAB_QUERIES =
    employeeDocs?.map((doc) =>
      doc.requiredDocument?.split(" ").join("-").toLocaleLowerCase(),
    ) ?? [];
  const activeTab = searchParams.get("t") ?? TAB_QUERIES[0];
  const activeTabIndex = TAB_QUERIES.findIndex((tab) => tab === activeTab);
  const tabs: Tab[] =
    employeeDocs?.map((doc, index) => ({
      label: doc?.requiredDocument,
      query: TAB_QUERIES[index],
      content: (
        <ViewDoc
          documents={[doc.document]}
          document={doc.requiredDocument}
          tabQuerys={TAB_QUERIES}
          onClick={(query) => handleTabChange(query)}
          currentStep={activeTabIndex + 1}
          prevStep={activeTabIndex}
        />
      ),
      isDisabled: false,
    })) ?? [];
  const handleTabChange = (query: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("t", query);
    router.push(`?${newSearchParams.toString()}`, { scroll: true });
  };
  return (
    <div className="ml-auto mt-4 flex w-full max-w-[996px]">
      <SideTab
        tabs={tabs}
        onChange={(query) => {
          handleTabChange(query);
        }}
        title={docsData?.title}
        activeTab={activeTab}
      />
    </div>
  );
};
