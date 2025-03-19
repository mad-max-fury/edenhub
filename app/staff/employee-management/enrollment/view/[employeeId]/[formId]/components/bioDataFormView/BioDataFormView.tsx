import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SideTab } from "@/components";
import { IBioDataProps } from "@/redux/api";

import { BIO_DATA_FORM_VIEW_TAB_QUERIES as TAB_QUERIES } from "../constants";
import {
  AcademicBackgroundView,
  BankDetails,
  DependantView,
  EmergencyView,
  EmploymentHistoryView,
  NextOfKinView,
  PersonalInfoView,
  ProfessionalQualificationView,
  TaxAndPensionView,
  TrainingCertificationView,
} from "./components";

type Props = {
  bioData: IBioDataProps;
  staffId?: string;
};

interface Tab {
  label: string;
  query: string;
  count?: number;
  content: React.ReactNode;
  isDisabled?: boolean;
}

export const BioDataFormView = ({ bioData, staffId }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("t") || TAB_QUERIES[0];


  const tabs: Tab[] = [
    {
      label: "Personal Information",
      query: TAB_QUERIES[0],
      content: (
        <PersonalInfoView
          personalData={bioData?.basicInformation}
          staffId={String(bioData?.staffId ? bioData?.staffId : staffId)}
          onClick={(query) => handleTabChange(query)}
        />
      ),
      isDisabled: false,
    },
    {
      label: "Dependant",
      query: TAB_QUERIES[1],
      content: (
        <DependantView
          dependantsForm={bioData?.employeeDependent}
          onClick={(query) => handleTabChange(query)}
        />
      ),
      isDisabled: false,
    },
    {
      label: "Emergency Contact",
      query: TAB_QUERIES[2],
      content: (
        <EmergencyView
          emergencyData={bioData.employeeEmergencyContact}
          onClick={(query) => handleTabChange(query)}
        />
      ),
      isDisabled: false,
    },
    {
      label: "Next of Kin",
      query: TAB_QUERIES[3],
      content: (
        <NextOfKinView
          nextOfKinData={bioData.employeeNextOfKin}
          onClick={(query) => handleTabChange(query)}
        />
      ),
      isDisabled: false,
    },
    {
      label: "Employment History",
      query: TAB_QUERIES[4],
      content: (
        <EmploymentHistoryView
          employmentHistoryData={bioData?.employeeEmploymenHistory}
          onClick={(query) => handleTabChange(query)}
        />
      ),
      isDisabled: false,
    },
    {
      label: "Academic Background",
      query: TAB_QUERIES[5],
      content: (
        <AcademicBackgroundView
          academicBackgroundData={bioData?.employeeAcademicBackground}
          onClick={(query) => handleTabChange(query)}
        />
      ),
      isDisabled: false,
    },
    {
      label: "Professional Qualification",
      query: TAB_QUERIES[6],
      content: (
        <ProfessionalQualificationView
          // @ts-expect-error TODO
          professionalQualificationData={
            bioData?.employeeProfessionaQualification
          }
          onClick={(query) => handleTabChange(query)}
        />
      ),
      isDisabled: false,
    },
    {
      label: "Training/Certification",
      query: TAB_QUERIES[7],
      content: (
        <TrainingCertificationView
          onClick={(query) => handleTabChange(query)}
          trainingCertificationData={bioData?.employeeTrainingCertificate}
        />
      ),
      isDisabled: false,
    },
    {
      label: "Bank Details",
      query: TAB_QUERIES[8],
      content: (
        <BankDetails
          BankDetailsView={bioData?.employeeBankDetails}
          onClick={(query) => handleTabChange(query)}
        />
      ),
      isDisabled: false,
    },
    {
      label: "Tax and Pension",
      query: TAB_QUERIES[9],
      content: (
        <TaxAndPensionView
          taxAndPensionData={bioData?.employeeTaxAndPension}
          onClick={(query) => handleTabChange(query)}
        />
      ),
      isDisabled: false,
    },
  ];
  const handleTabChange = (query: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("t", query);
    router.push(`?${newSearchParams.toString()}`, { scroll: true });
  };
  return (
    <div className="ml-auto mt-4 flex w-full">
      <SideTab
        tabs={tabs}
        onChange={(query) => {
          handleTabChange(query);
        }}
        title="Bio Data Form"
        activeTab={activeTab}
      />
    </div>
  );
};
