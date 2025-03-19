import React, { useContext, useRef } from "react";
import { useRouter } from "next/navigation";
import { FormStepJumbotron, notify, RowView, Typography } from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { UserContext } from "@/layouts/appLayout";
import { RootState } from "@/redux";
import {
  useGetAllCompaniesByLocationIdQuery,
  useGetAllUnpaginatedDepartmentsQuery,
  useTriggerEmployeeEmploymentMutation,
} from "@/redux/api";
import { useGetAllUnpaginatedBusinessUnitsQuery } from "@/redux/api/businessUnit";
import { resetState } from "@/redux/api/employee/enrollmentForm.slice";
import { IApiError } from "@/redux/api/genericInterface";
import { ISelectItemPropsWithValueGeneric } from "@/redux/api/interface";
import { ISelectResponse } from "@/redux/api/select";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { findLabelFromOptions, formatSelectItems } from "@/utils/helpers";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { IBasicInformationFormData } from "./BasicInformationForm";
import { TAB_QUERIES } from "./constants";
import { IEmploymentDetailsFormData } from "./EmploymentDetailsForm";
import { IEmploymentTypeFormData } from "./EmploymentTypeForm";
import { IEnrollmentReviwerFormData } from "./EnrollmentReviewer";
import { IOnboardingSetupFormData } from "./OnboardingSetup";

export interface IEmploymentFormPreviewData
  extends IBasicInformationFormData,
    IEmploymentTypeFormData,
    IEmploymentDetailsFormData,
    IOnboardingSetupFormData {}

interface ChildFormProps {
  onClick: (step: string) => void;
  jobTitleOptions: ISelectItemPropsWithValueGeneric[];
  jobDesignationOptions: ISelectItemPropsWithValueGeneric[];
  workLocationOptions: ISelectItemPropsWithValueGeneric[];
  employmentTypeOptions: ISelectItemPropsWithValueGeneric[];
  requiredDocs: ISelectItemPropsWithValueGeneric[];
  requiredForms: ISelectItemPropsWithValueGeneric[];
}

export const EmploymentFormPreview = ({
  onClick,
  jobTitleOptions,
  jobDesignationOptions,
  workLocationOptions,
  employmentTypeOptions,
  requiredDocs,
  requiredForms,
}: ChildFormProps) => {
  const [triggerEmployeeEmployment, { isLoading }] =
    useTriggerEmployeeEmploymentMutation();
  const router = useRouter();
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const {
    basicInformation,
    employmentTypeFormData,
    employmentDetailsFormData,
    onboardingSetupFormData,
    enrollmentReviewerFormData,
    employeeId,
  } = useSelector((state: RootState) => state.employeeEnrollmentForm);

  const initialData: IEmploymentFormPreviewData = {
    ...(basicInformation as IBasicInformationFormData),
    ...(employmentTypeFormData as IEmploymentTypeFormData),
    ...(employmentDetailsFormData as IEmploymentDetailsFormData),
    ...(onboardingSetupFormData as IOnboardingSetupFormData),
    ...(enrollmentReviewerFormData as IEnrollmentReviwerFormData),
  };

  const { data: allCompanies } = useGetAllCompaniesByLocationIdQuery(
    {
      locationId: (employmentDetailsFormData?.locationId as string) ?? "",
    },
    { skip: !employmentDetailsFormData?.locationId },
  );

  const { data: businessUnits } = useGetAllUnpaginatedBusinessUnitsQuery({
    companyId: (employmentDetailsFormData?.companyId as string) ?? "",
  });
  const { data: departments } = useGetAllUnpaginatedDepartmentsQuery({
    businessUnitId: (employmentDetailsFormData?.businessUnitId as string) ?? "",
  });

  const allCompaniesOptions = formatSelectItems<ISelectResponse>(
    allCompanies?.data ?? [],
    "name",
    "id",
  );

  const businessUnitOptions = formatSelectItems<ISelectResponse>(
    businessUnits?.data ?? [],
    "name",
    "id",
  );
  const departmentOptions = formatSelectItems<ISelectResponse>(
    departments?.data ?? [],
    "name",
    "id",
  );
  const { handleSubmit } = useForm<IEmploymentFormPreviewData>({
    defaultValues: initialData,
  });
  const user = useContext(UserContext);

  const dispatch = useDispatch();

  const onSubmit = async () => {
    try {
      await triggerEmployeeEmployment({
        employeeId: String(employeeId),
      }).unwrap();
      notify.success({
        message: "Enrollment Started Successfully",
        subtitle: `You have successfully initiated onboarding for ${initialData.firstName.toUpperCase()}`,
      });
      dispatch(resetState());
      router.push(AuthRouteConfig.EMPLOYEE_MANAGEMENT_ENROLLMENT);
    } catch (error) {
      notify.error({
        message: "Failed to initiate enrollment",
        subtitle: getErrorMessage(error as IApiError),
      });
    }
  };

  return (
    <FormStepJumbotron
      title="Preview"
      currentStep={5}
      totalSteps={TAB_QUERIES.length}
      onNext={() => submitButtonRef.current?.click()}
      onBack={() => onClick(TAB_QUERIES[3])}
      isLoading={isLoading}
    >
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <RowView
          name={"Full Name"}
          value={`${initialData.firstName} ${initialData.middleName}
            ${initialData.lastName}`}
        />
        <RowView name={"Email"} value={`${initialData.email}`} />

        <Typography
          fontWeight="medium"
          className="mt-2"
          variant="p-l"
          color="N700"
        >
          Employment Types
        </Typography>
        <hr />
        <RowView
          name={"Employment Type"}
          value={`${findLabelFromOptions(employmentTypeOptions, initialData.employmentType)}`}
        />

        <Typography
          fontWeight="medium"
          className="mt-2"
          variant="p-l"
          color="N700"
        >
          Employment Details
        </Typography>
        <hr />
        <RowView
          name={"Job Title"}
          value={`${findLabelFromOptions(jobTitleOptions, initialData.jobTitleId)}`}
        />
        <RowView
          name={"Job Designation"}
          value={`${findLabelFromOptions(jobDesignationOptions, initialData.jobDesignationId)}`}
        />
        <RowView
          name={"Company"}
          value={`${findLabelFromOptions(allCompaniesOptions, initialData.companyId)}`}
        />
        <RowView
          name={"Work Location"}
          value={`${findLabelFromOptions(workLocationOptions, initialData.locationId)}`}
        />
        <RowView
          name={"Business Unit"}
          value={`${findLabelFromOptions(businessUnitOptions, initialData.businessUnitId)}`}
        />
        <RowView
          name={"Department"}
          value={`${findLabelFromOptions(departmentOptions, initialData.departmentId)}`}
        />
        <div className="grid grid-cols-2 gap-8 mmd:grid-cols-1">
          <div>
            {" "}
            <Typography
              fontWeight="medium"
              className="mb-2 mt-2"
              variant="p-l"
              color="N700"
            >
              Required Documents
            </Typography>
            <hr />
            <div className="mt-2 flex flex-col gap-2">
              {initialData.requiredDocument?.map((v) => (
                <Typography key={v} variant="p-m" color={"text-light"}>
                  {findLabelFromOptions(requiredDocs, v)}
                </Typography>
              ))}
            </div>
          </div>
          <div>
            {" "}
            <Typography
              fontWeight="medium"
              className="mb-2 mt-2"
              variant="p-l"
              color="N700"
            >
              Required Forms
            </Typography>
            <hr />
            <div className="mt-2 flex flex-col gap-2">
              {initialData.requiredForm?.map((v) => (
                <Typography key={v} variant="p-m" color={"text-light"}>
                  {findLabelFromOptions(requiredForms, v)}
                </Typography>
              ))}
            </div>
          </div>
        </div>
        <Typography fontWeight="medium" variant="p-l" color="N700">
          Enrollment Reviewer
        </Typography>
        <hr />
        <RowView
          name={"Assignee"}
          value={`${user?.user?.firstname} ${user?.user?.lastname}`}
        />
        <button type="submit" ref={submitButtonRef} className="sr-only">
          Submit
        </button>
      </form>
    </FormStepJumbotron>
  );
};
