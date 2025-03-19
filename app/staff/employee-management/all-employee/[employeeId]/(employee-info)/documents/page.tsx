"use client";

import React, { useMemo } from "react";
import { Jumbotron, NetworkError, PageLoader, Typography } from "@/components";
import { useGetEmployeeDocumentsQuery } from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";

import { EmployeeDocumentRenderer } from "./components";

interface PageProps {
  params: {
    employeeId: string;
  };
}

const getFileNameFromUrl = (url: string) => {
  const matches = url?.match(/resourceedge\/([^/]+)/);
  return matches?.[1];
};

const EmployeeDocumentsPage: React.FC<PageProps> = ({
  params: { employeeId },
}) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetEmployeeDocumentsQuery(employeeId);

  const documentSections = useMemo(() => {
    if (!data?.data) return [];

    return [
      {
        name: "Personal Documents",
        documents: data.data.personalDocuments.map((doc) => ({
          name: getFileNameFromUrl(doc.documentUrl) as string,
          url: doc.documentUrl,
        })),
      },
      {
        name: "Academic Documents",
        documents: data.data.academicDocuments.map((doc) => ({
          name: getFileNameFromUrl(doc.documentUrl) as string,
          url: doc.documentUrl,
        })),
      },
      {
        name: "Professional Qualifications",
        documents: data.data.professionalQualifications.map((doc) => ({
          name: getFileNameFromUrl(doc.documentUrl) as string,
          url: doc.documentUrl,
        })),
      },
      {
        name: "Training Certificate",
        documents: data.data.trainingCertificates.map((doc) => ({
          name: getFileNameFromUrl(doc.documentUrl) as string,
          url: doc.documentUrl,
        })),
      },
    ];
  }, [data]);


  if (isLoading || isFetching) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <NetworkError
        error={error as IApiError}
        isFetching={isFetching}
        refetch={refetch}
      />
    );
  }

  return (
    <Jumbotron
      headerContainer={<Typography variant="h-s">Documents</Typography>}
    >
      <div className="flex flex-col gap-4 px-6">
        {documentSections.map((section) => (
          <div key={section.name}>
            <EmployeeDocumentRenderer document={section} />
          </div>
        ))}
      </div>
    </Jumbotron>
  );
};

export default EmployeeDocumentsPage;
