"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Avatar,
  notify,
  PageHeader,
  PageLoader,
  SideTab,
  Typography,
} from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { RootState } from "@/redux";
import {
  ICountryProps,
  useGetAllCountriesQuery,
} from "@/redux/api/countryStatesLGA";
import { setBioProfilePicture } from "@/redux/api/employee/bioDataForm.slice";
import {
  ISelectResponse,
  useGetAllDependantsQuery,
  useGetAllGendersQuery,
  useGetAllMaritalStatusesQuery,
  useGetAllQualificationsQuery,
  useGetAllRelationshipsQuery,
  useGetAllReligionsQuery,
} from "@/redux/api/select";
import formatImageToBase64 from "@/utils/formatImageToBase64";
import { formatSelectItems } from "@/utils/helpers";
import { useDispatch, useSelector } from "react-redux";

import { Breadcrumbs } from "@/components/breadCrumbs/breadCrumbs";

import {
  AcademicBackgroundForm,
  DependantsForm,
  EmergencyContactsForm,
  EmploymentHistoryForm,
  NextOfKinForm,
  PersonalInformationForm,
  ProfessionalQualificationForm,
  TrainingCertificationForm,
} from "./components";
import { TAB_QUERIES } from "./components/constants";

const findTabIndex = (query: string) => TAB_QUERIES.indexOf(query);

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
  const activeTab = searchParams.get("t") || TAB_QUERIES[0];
  const activeTabIndex = findTabIndex(activeTab);
  const dispatch = useDispatch();

  const {
    personalInformation,
    dependants,
    emergencyContacts,
    nextOfKin,
    employmentHistory,
    academicBackground,
    professionalQualification,
    trainingCertification,
    profilePicture,
    employee,
    employeeId,
  } = useSelector((state: RootState) => state.bioDataForm);

  const fullname = employee?.fullName;

  const CRUMBS = [
    {
      name: "All Employee",
      path: AuthRouteConfig.EMPLOYEE_MANAGEMEN_ALL_EMPLOYEE,
    },
    {
      name: fullname ?? "",
      path:
        AuthRouteConfig.EMPLOYEE_MANAGEMEN_ALL_EMPLOYEE +
        `/${employeeId}` +
        "/profile",
    },
    {
      name: "Edit Profile",
      path:
        AuthRouteConfig.EMPLOYEE_MANAGEMEN_ALL_EMPLOYEE +
        `/${employeeId}` +
        "/edit-profile",
    },
  ];

  const filledTabSeq = useMemo(
    () => [
      !!personalInformation,
      true,
      !!emergencyContacts,
      !!nextOfKin,
      true,
      true,
      true,
      true,
    ],
    [
      personalInformation,
      dependants,
      emergencyContacts,
      nextOfKin,
      employmentHistory,
      academicBackground,
      professionalQualification,
      trainingCertification,
    ],
  );
  const { data: genders, isLoading } = useGetAllGendersQuery();
  const { data: maritalStatuses, isLoading: isLoadingMaritalStatues } =
    useGetAllMaritalStatusesQuery();
  const { data: countries, isLoading: isLoadingCountries } =
    useGetAllCountriesQuery();
  const { data: relationships, isLoading: isLoadingRelationships } =
    useGetAllRelationshipsQuery();
  const { data: dependents } = useGetAllDependantsQuery();
  const { data: religions, isLoading: isLoadingReligions } =
    useGetAllReligionsQuery();
  const { data: qualifications, isLoading: isLoadingQualifications } =
    useGetAllQualificationsQuery();

  const allCountries = formatSelectItems<ICountryProps>(
    countries?.data || [],
    "name",
    "id",
  );
  const allGenders = formatSelectItems<ISelectResponse>(
    genders?.data || [],
    "name",
    "id",
  );
  const allMaritalStatusess = formatSelectItems<ISelectResponse>(
    maritalStatuses?.data || [],
    "name",
    "id",
  );
  const allRelationships = formatSelectItems<ISelectResponse>(
    relationships?.data || [],
    "name",
    "id",
  );
  const allDependants = formatSelectItems<ISelectResponse>(
    dependents?.data || [],
    "name",
    "id",
  );
  const allReligions = formatSelectItems<ISelectResponse>(
    religions?.data || [],
    "name",
    "id",
  );
  const allQualifications = formatSelectItems<ISelectResponse>(
    qualifications?.data || [],
    "name",
    "id",
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
      return filledTabSeq.slice(0, tabIndex).every((isComplete) => isComplete);
    },

    [filledTabSeq],
  );
  const tabs: Tab[] = [
    {
      label: "Personal Information",
      query: TAB_QUERIES[0],
      content: (
        <PersonalInformationForm
          allGenders={allGenders}
          allCountries={allCountries}
          allMaritalStatusess={allMaritalStatusess}
          allReligions={allReligions}
          onClick={(query) => handleTabChange(query)}
        />
      ),
      isDisabled: false,
    },
    {
      label: "Dependant",
      query: TAB_QUERIES[1],
      content: (
        <DependantsForm
          allRelationships={allDependants}
          allGenders={allGenders}
          onClick={(query) => handleTabChange(query)}
        />
      ),
      isDisabled: false,
    },
    {
      label: "Emergency Contacts",
      query: TAB_QUERIES[2],
      content: (
        <EmergencyContactsForm
          allRelationships={allRelationships}
          onClick={(query) => handleTabChange(query)}
        />
      ),
      isDisabled: !isTabAccessible(2),
    },
    {
      label: "Next of Kin",
      query: TAB_QUERIES[3],
      content: (
        <NextOfKinForm
          allRelationships={allRelationships}
          onClick={(query) => handleTabChange(query)}
        />
      ),
      isDisabled: !isTabAccessible(3),
    },
    {
      label: "Employment History",
      query: TAB_QUERIES[4],
      content: (
        <EmploymentHistoryForm onClick={(query) => handleTabChange(query)} />
      ),
      isDisabled: false,
    },
    {
      label: "Academic Background",
      query: TAB_QUERIES[5],
      content: (
        <AcademicBackgroundForm
          allQualifications={allQualifications}
          onClick={(query) => handleTabChange(query)}
        />
      ),
      isDisabled: false,
    },
    {
      label: "Professional Qualification",
      query: TAB_QUERIES[6],
      content: (
        <ProfessionalQualificationForm
          onClick={(query) => handleTabChange(query)}
        />
      ),
      isDisabled: false,
    },
    {
      label: "Training/Certification",
      query: TAB_QUERIES[7],
      content: (
        <TrainingCertificationForm
          onClick={(query) => handleTabChange(query)}
        />
      ),
      isDisabled: false,
    },
  ];

  const handleFileUpload = async (file: File) => {
    const profileImg = (await formatImageToBase64(file)) as string;
    dispatch(setBioProfilePicture(profileImg));
  };

  const handleFileDelete = () => {
    dispatch(setBioProfilePicture(null));
  };

  useEffect(() => {
    if (activeTabIndex !== 0 && !isTabAccessible(activeTabIndex)) {
      const lastValidTabIndex = filledTabSeq.lastIndexOf(true);

      const nextTabIndex = lastValidTabIndex + 1;
      handleTabChange(TAB_QUERIES[nextTabIndex]);
      notify.error({ message: "Please complete previous tabs" });
    }
  }, [activeTabIndex, isTabAccessible, handleTabChange, filledTabSeq]);

  if ((employeeId?.length as number) < 1)
    router.push(AuthRouteConfig?.EMPLOYEE_MANAGEMEN_ALL_EMPLOYEE);

  if (
    isLoading ||
    isLoadingMaritalStatues ||
    isLoadingCountries ||
    isLoadingRelationships ||
    isLoadingReligions ||
    isLoadingQualifications
  )
    return <PageLoader />;
  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-[36px]">
      <div className="ml-auto mt-6 flex w-full max-w-[865px] flex-col items-start gap-4 md:flex-row md:items-center md:gap-6">
        <Avatar
          fullname={fullname ?? ""}
          src={profilePicture}
          size={"xxl"}
          colorStyles={{ textColor: "N0", bgColor: "R400" }}
          upload={true}
          onFileUpload={handleFileUpload}
          onFileDelete={handleFileDelete}
        />
        <div className="ml-auto w-full max-w-[744px] flex-1">
          <Breadcrumbs crumbs={CRUMBS} />
          <div className="mt-2">
            <PageHeader title={fullname} />
          </div>
          <Typography variant="p-m" gutterBottom color="N500" className="mt-4">
            PROFILE
          </Typography>
          <hr />
        </div>
      </div>
      <div className="sticky top-[100px] ml-auto w-full max-w-[936px]">
        <SideTab
          tabs={tabs}
          onChange={(query) => {
            const reqTabIndex = findTabIndex(query);
            if (isTabAccessible(reqTabIndex)) {
              handleTabChange(query);
            } else {
              notify.error({ message: "Please complete previous tabs first" });
            }
          }}
          title="BIO DATA FORM"
          activeTab={activeTab}
        />
      </div>
    </div>
  );
};

export default BioDataPage;
