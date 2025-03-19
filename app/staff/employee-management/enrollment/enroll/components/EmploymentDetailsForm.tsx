import React, { useRef } from "react";
import {
  FormStepJumbotron,
  notify,
  SMSelectDropDown,
  TextField,
} from "@/components";
import { RootState } from "@/redux";
import {
  useAddOrUpdateEmployeeEmployementDetailMutation,
  useGetAllCompaniesByLocationIdQuery,
  useGetAllUnpaginatedDepartmentsQuery,
} from "@/redux/api";
import { useGetAllUnpaginatedBusinessUnitsQuery } from "@/redux/api/businessUnit";
import { setEmploymentDetails } from "@/redux/api/employee/enrollmentForm.slice";
import { IApiError } from "@/redux/api/genericInterface";
import { ISelectItemPropsWithValueGeneric } from "@/redux/api/interface";
import { ISelectResponse } from "@/redux/api/select";
import { getErrorMessage } from "@/utils/getErrorMessges";
import {
  fieldSetterAndClearer,
  formatSelectItems,
  getSelectedOption,
} from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { TAB_QUERIES } from "./constants";
import { employmentDetailsValidationSchema } from "./schema";

export interface IEmploymentDetailsFormData {
  jobTitleId: string;
  jobDesignationId: string;
  companyId: string;
  locationId: string;
  businessUnitId: string;
  departmentId: string;
  hireDate: string;
}

interface ChildFormProps {
  onClick: (step: string) => void;
  jobTitleOptions: ISelectItemPropsWithValueGeneric[];
  jobDesignationOptions: ISelectItemPropsWithValueGeneric[];
  workLocationOptions: ISelectItemPropsWithValueGeneric[];
}

export const EmploymentDetailsForm = ({
  onClick,
  jobTitleOptions,
  jobDesignationOptions,
  workLocationOptions,
}: ChildFormProps) => {
  const [addOrUpdateEmployeeEmployementDetail, { isLoading }] =
    useAddOrUpdateEmployeeEmployementDetailMutation();
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const { employmentDetailsFormData, employeeId } = useSelector(
    (state: RootState) => state.employeeEnrollmentForm,
  );
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    watch,
    getValues,
    register,
  } = useForm<IEmploymentDetailsFormData>({
    defaultValues: employmentDetailsFormData as IEmploymentDetailsFormData,
    resolver: yupResolver(employmentDetailsValidationSchema),
    mode: "onChange",
  });

  console.log(employmentDetailsFormData, getValues());

  const dispatch = useDispatch();

  const onSubmit = async (data: IEmploymentDetailsFormData) => {
    try {
      await addOrUpdateEmployeeEmployementDetail({
        ...data,
        employeeId: employeeId as string,
      }).unwrap();
      dispatch(setEmploymentDetails(data));
      onClick(TAB_QUERIES[3]);
      notify.success({
        message: "Employment details updated successfully",
      });
    } catch (error) {
      notify.error({
        message: "Failed to add or update employment details",
        subtitle: getErrorMessage(error as IApiError),
      });
    }
  };

  const {
    data: allCompanies,
    isLoading: isLoadingAllCompanies,
    isFetching: isFetchingAllCompanies,
  } = useGetAllCompaniesByLocationIdQuery(
    {
      locationId: watch("locationId"),
    },
    { skip: !watch("locationId") },
  );

  const {
    data: businessUnits,
    isLoading: isLoadingBusinessUnits,
    isFetching: isFetchingBusinessUnits,
  } = useGetAllUnpaginatedBusinessUnitsQuery({
    companyId: watch("companyId"),
  });

  const {
    data: departments,
    isLoading: isLoadingDepartments,
    isFetching: isFetchingDepartments,
  } = useGetAllUnpaginatedDepartmentsQuery({
    businessUnitId: watch("businessUnitId"),
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

  return (
    <FormStepJumbotron
      title="Employment Details"
      currentStep={3}
      totalSteps={TAB_QUERIES.length}
      onBack={() => onClick(TAB_QUERIES[1])}
      onNext={() => submitButtonRef.current?.click()}
      isLoading={isLoading}
    >
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}
      >
        <fieldset>
          <SMSelectDropDown
            options={jobTitleOptions}
            label="Job Title"
            flexStyle="row"
            varient="simple"
            value={getSelectedOption(jobTitleOptions, watch("jobTitleId"))}
            onChange={(selectedOption) => {
              fieldSetterAndClearer({
                value: selectedOption.value,
                setterFunc: setValue,
                setField: "jobTitleId",
                clearErrors,
              });
            }}
            placeholder="Select Job Title"
            searchable={true}
            isError={!!errors.jobTitleId}
            errorText={errors.jobTitleId?.message}
          />
        </fieldset>

        <fieldset>
          <SMSelectDropDown
            options={jobDesignationOptions}
            value={getSelectedOption(
              jobDesignationOptions,
              watch("jobDesignationId"),
            )}
            label="Job Designation"
            varient="simple"
            onChange={(selectedOption) => {
              fieldSetterAndClearer({
                value: selectedOption.value,
                setterFunc: setValue,
                setField: "jobDesignationId",
                clearErrors,
              });
            }}
            placeholder="Select Job Designation"
            searchable={true}
            isError={!!errors.jobDesignationId}
            errorText={errors.jobDesignationId?.message}
            flexStyle="row"
          />
        </fieldset>

        <fieldset>
          <SMSelectDropDown
            options={workLocationOptions}
            value={getSelectedOption(workLocationOptions, watch("locationId"))}
            label="Work Location"
            varient="simple"
            onChange={(selectedOption) => {
              fieldSetterAndClearer({
                value: selectedOption.value,
                setterFunc: setValue,
                setField: "locationId",
                clearFields: ["companyId", "businessUnitId"],
                clearErrors,
              });
            }}
            placeholder="Select Work Location"
            searchable={true}
            isError={!!errors.locationId}
            errorText={errors.locationId?.message}
            flexStyle="row"
          />
        </fieldset>

        <fieldset>
          <SMSelectDropDown
            options={allCompaniesOptions}
            disabled={
              !watch("locationId") ||
              isLoadingAllCompanies ||
              isFetchingAllCompanies
            }
            value={getSelectedOption(allCompaniesOptions, watch("companyId"))}
            varient="simple"
            onChange={(selectedOption) => {
              fieldSetterAndClearer({
                value: selectedOption.value,
                setterFunc: setValue,
                setField: "companyId",
                clearFields: ["businessUnitId", "departmentId"],
                clearErrors,
              });
            }}
            loading={isLoadingAllCompanies || isFetchingAllCompanies}
            placeholder="Select Company"
            searchable={true}
            isError={!!errors.companyId}
            errorText={errors.companyId?.message}
            label="Company"
            flexStyle="row"
          />
        </fieldset>

        <fieldset>
          <SMSelectDropDown
            options={businessUnitOptions}
            disabled={
              !watch("companyId") ||
              isLoadingBusinessUnits ||
              isFetchingBusinessUnits
            }
            value={getSelectedOption(
              businessUnitOptions,
              watch("businessUnitId"),
            )}
            varient="simple"
            onChange={(selectedOption) => {
              fieldSetterAndClearer({
                value: selectedOption.value,
                setterFunc: setValue,
                setField: "businessUnitId",
                clearFields: ["departmentId"],
                clearErrors,
              });
            }}
            loading={isLoadingBusinessUnits || isFetchingBusinessUnits}
            placeholder="Choose Business Unit"
            searchable={true}
            isError={!!errors.businessUnitId}
            errorText={errors.businessUnitId?.message}
            label="Business Unit"
            flexStyle="row"
          />
        </fieldset>

        <fieldset>
          <SMSelectDropDown
            options={departmentOptions}
            disabled={
              !watch("businessUnitId") ||
              isLoadingDepartments ||
              isFetchingDepartments
            }
            value={getSelectedOption(departmentOptions, watch("departmentId"))}
            varient="simple"
            onChange={(selectedOption) => {
              fieldSetterAndClearer({
                value: selectedOption.value,
                setterFunc: setValue,
                setField: "departmentId",
                clearErrors,
              });
            }}
            loading={isLoadingDepartments || isFetchingDepartments}
            placeholder="Choose Department"
            searchable={true}
            isError={!!errors.departmentId}
            errorText={errors.departmentId?.message}
            label="Department"
            flexStyle="row"
          />
        </fieldset>

        <fieldset>
          <TextField
            name={`hireDate`}
            inputType="input"
            type="date"
            placeholder="Hire Date"
            label="Hire Date"
            register={register}
            error={!!errors?.hireDate?.message}
            errorText={errors?.hireDate?.message}
            flexStyle="row"
          />
        </fieldset>

        {/* Invisible Submit Button */}
        <button type="submit" ref={submitButtonRef} className="sr-only">
          Submit
        </button>
      </form>
    </FormStepJumbotron>
  );
};

EmploymentDetailsForm.displayName = "EmploymentDetailsForm";
export default EmploymentDetailsForm;
