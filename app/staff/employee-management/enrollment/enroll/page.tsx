"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  ButtonDropdown,
  notify,
  PageHeader,
  SideTab,
} from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { RootState } from "@/redux";
import {
  useDeleteEmployeeMutation,
  useGetAllUnpaginatedJobDesignationsQuery,
  useGetAllUnpaginatedJobTitlesQuery,
} from "@/redux/api";
import { resetState } from "@/redux/api/employee/enrollmentForm.slice";
import { IApiError } from "@/redux/api/genericInterface";
import { useGetAllUnPaginatedLocationsQuery } from "@/redux/api/location";
import {
  ISelectResponse,
  useGetEmploymentTypesQuery,
  useGetRequiredDocsTypesQuery,
  useGetRequiredFormTypesQuery,
} from "@/redux/api/select";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { formatSelectItems } from "@/utils/helpers";
import { useDispatch, useSelector } from "react-redux";

import { Breadcrumbs } from "@/components/breadCrumbs/breadCrumbs";

import {
  BasicInformationForm,
  EmploymentDetailsForm,
  EmploymentFormPreview,
  EmploymentTypeForm,
  EnrollmentReviewer,
  OnboardingSetupForm,
  TAB_QUERIES,
} from "./components";

const CRUMBS = [
  { name: "Enrollment", path: AuthRouteConfig.EMPLOYEE_MANAGEMENT_ENROLLMENT },
  {
    name: "Add Employee",
    path: AuthRouteConfig.EMPLOYEE_MANAGEMENT_ENROLLMENT_CREATE,
  },
];

const findTabIndex = (query: string) => TAB_QUERIES.indexOf(query);

interface Tab {
  label: string;
  query: string;
  count?: number;
  content: React.ReactNode;
  isDisabled?: boolean;
}

const EmployeeEnrollmentPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const [cancelEmployee, { isLoading: isLoadingCanceling }] =
    useDeleteEmployeeMutation();
  const { data: employmentTypesData } = useGetEmploymentTypesQuery();
  const { data: jobTitles } = useGetAllUnpaginatedJobTitlesQuery();
  const { data: jobDesignation } = useGetAllUnpaginatedJobDesignationsQuery();
  const { data: workLocations } = useGetAllUnPaginatedLocationsQuery();
  const { data: requiredDocsData } = useGetRequiredDocsTypesQuery();
  const { data: requiredFormsData } = useGetRequiredFormTypesQuery();

  const employmentTypesOptions = formatSelectItems<ISelectResponse>(
    employmentTypesData?.data ?? [],
    "name",
    "id",
  );
  const jobTitleOptions = formatSelectItems<ISelectResponse>(
    jobTitles?.data ?? [],
    "name",
    "id",
  );
  const jobDesignationOptions = formatSelectItems<ISelectResponse>(
    jobDesignation?.data ?? [],
    "name",
    "id",
  );
  const workLocationOptions = formatSelectItems<ISelectResponse>(
    workLocations?.data ?? [],
    "name",
    "id",
  );

  const requiredDocs = formatSelectItems<ISelectResponse>(
    requiredDocsData?.data ?? [],
    "name",
    "id",
  );
  const requiredForms = formatSelectItems<ISelectResponse>(
    requiredFormsData?.data ?? [],
    "name",
    "id",
  );

  const activeTab = searchParams.get("t") || TAB_QUERIES[0];
  const activeTabIndex = findTabIndex(activeTab);

  const {
    basicInformation,
    employmentTypeFormData,
    employmentDetailsFormData,
    enrollmentReviewerFormData,
    onboardingSetupFormData,
    employeeId,
  } = useSelector((state: RootState) => state.employeeEnrollmentForm);

  const filledTabSeq = [
    !!basicInformation,
    !!employmentTypeFormData,
    !!employmentDetailsFormData,
    !!onboardingSetupFormData,
    !!enrollmentReviewerFormData,
  ];

  const handleTabChange = (query: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("t", query);
    router.push(`?${newSearchParams.toString()}`, { scroll: true });
  };

  const isTabAccessible = (tabIndex: number) => {
    return filledTabSeq.slice(0, tabIndex).every((isComplete) => isComplete);
  };

  const tabs: Tab[] = [
    {
      label: "Basic Information",
      query: TAB_QUERIES[0],
      content: (
        <BasicInformationForm onClick={(query) => handleTabChange(query)} />
      ),
      isDisabled: false,
    },
    {
      label: "Employment Type",
      query: TAB_QUERIES[1],
      content: (
        <EmploymentTypeForm
          employmentTypeOptions={employmentTypesOptions}
          onClick={(query) => handleTabChange(query)}
        />
      ),
      isDisabled: !isTabAccessible(1),
    },
    {
      label: "Employment Details",
      query: TAB_QUERIES[2],
      content: (
        <EmploymentDetailsForm
          jobTitleOptions={jobTitleOptions}
          jobDesignationOptions={jobDesignationOptions}
          workLocationOptions={workLocationOptions}
          onClick={(query) => handleTabChange(query)}
        />
      ),
      isDisabled: !isTabAccessible(2),
    },
    {
      label: "Onboarding Setup",
      query: TAB_QUERIES[3],
      content: (
        <OnboardingSetupForm
          requiredDocs={requiredDocs}
          requiredForms={requiredForms}
          onClick={(query) => handleTabChange(query)}
        />
      ),
      isDisabled: !isTabAccessible(3),
    },
    {
      label: "Enrollment Reviewer",
      query: TAB_QUERIES[4],
      content: (
        <EnrollmentReviewer onClick={(query) => handleTabChange(query)} />
      ),
      isDisabled: !isTabAccessible(4),
    },
    {
      label: "Preview",
      query: TAB_QUERIES[5],
      content: (
        <EmploymentFormPreview
          jobTitleOptions={jobTitleOptions}
          jobDesignationOptions={jobDesignationOptions}
          workLocationOptions={workLocationOptions}
          requiredDocs={requiredDocs}
          requiredForms={requiredForms}
          employmentTypeOptions={employmentTypesOptions}
          onClick={(query) => handleTabChange(query)}
        />
      ),
      isDisabled: !isTabAccessible(5),
    },
  ];

  const buttonGroups = [
    {
      name: "Cancel Enrollment",
      onClick: async () => {
        try {
          await cancelEmployee(employeeId as string).unwrap();
          dispatch(resetState());
          router.push(AuthRouteConfig.EMPLOYEE_MANAGEMENT_ENROLLMENT);
          notify.success({ message: "enrollment cancelled" });
        } catch (error) {
          notify.error({
            message: "failed to cancel enrollment",
            subtitle: getErrorMessage(error as IApiError),
          });
        }
      },
    },
  ];

  useEffect(() => {
    if (activeTabIndex !== 0 && !isTabAccessible(activeTabIndex)) {
      const lastValidTabIndex = filledTabSeq.lastIndexOf(true);
      const nextTabIndex = lastValidTabIndex + 1;
      handleTabChange(TAB_QUERIES[nextTabIndex]);
      notify.error({ message: "please complete previous tabs" });
    }
  }, [activeTab]);

  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-[36px]">
      <div className="ml-auto mt-6 w-full max-w-[744px]">
        <Breadcrumbs crumbs={CRUMBS} />
        <PageHeader
          title="Who's your new employee"
          buttonGroup={
            <div className="flex items-center gap-3">
              {activeTab !== TAB_QUERIES[0] && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    dispatch(resetState());
                    notify.success({ message: "Changes are saved" });
                    router.push(AuthRouteConfig.EMPLOYEE_MANAGEMENT_ENROLLMENT);
                  }}
                  disabled={isLoadingCanceling}
                >
                  Continue Later
                </Button>
              )}
              <ButtonDropdown
                isLoading={isLoadingCanceling}
                colored
                buttonGroup={buttonGroups}
              />
            </div>
          }
        />
      </div>
      <div className="ml-auto w-full max-w-[996px]">
        <SideTab
          tabs={tabs}
          onChange={(query) => {
            const reqTabIndex = findTabIndex(query);
            if (isTabAccessible(reqTabIndex)) {
              handleTabChange(query);
            } else {
              notify.error({ message: "please complete previous tabs first" });
            }
          }}
          title="Enrollment Checklist"
          activeTab={activeTab}
        />
      </div>
    </div>
  );
};

export default EmployeeEnrollmentPage;
