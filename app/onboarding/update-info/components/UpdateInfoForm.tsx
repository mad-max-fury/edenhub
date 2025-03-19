import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Jumbotron,
  notify,
  SMSelectDropDown,
  TextField,
} from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import {
  IVerifyUserResponse,
  useAddOrUpdateOldEmployeeEmployementDetailMutation,
  useGetAllCompaniesByLocationIdQuery,
  useGetAllUnpaginatedDepartmentsQuery,
} from "@/redux/api";
import { useGetAllUnpaginatedBusinessUnitsQuery } from "@/redux/api/businessUnit";
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

import { updateInfoFormValidationSchema } from "./schema";

export interface IUpdateInfoFormData {
  staffId: string;
  employmentTypeId: string;
  jobTitleId: string;
  jobDesignationId: string;
  companyId: string;
  locationId: string;
  businessUnitId: string;
  departmentId: string;
  hireDate: string;
}

interface ChildFormProps {
  user: IVerifyUserResponse;
  jobTitleOptions: ISelectItemPropsWithValueGeneric[];
  jobDesignationOptions: ISelectItemPropsWithValueGeneric[];
  workLocationOptions: ISelectItemPropsWithValueGeneric[];
  employmentTypesOptions: ISelectItemPropsWithValueGeneric[];
}

export const UpdateInfoForm = ({
  user,
  jobTitleOptions,
  jobDesignationOptions,
  workLocationOptions,
  employmentTypesOptions,
}: ChildFormProps) => {
  const router = useRouter();

  const [addOrUpdateOldEmployeeEmployementDetail, { isLoading }] =
    useAddOrUpdateOldEmployeeEmployementDetailMutation();
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    watch,
    register,
  } = useForm<IUpdateInfoFormData>({
    defaultValues: {},
    resolver: yupResolver(updateInfoFormValidationSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: IUpdateInfoFormData) => {
    try {
      await addOrUpdateOldEmployeeEmployementDetail({
        ...data,
        employeeId: user.employeeId as string,
        staffId:data?.staffId.toUpperCase(),
        oldUser: true,
      }).unwrap();
      notify.success({
        message: "Employment details updated successfully",
      });
      router.push(AuthRouteConfig.OLD_STAFF_ONBOARDING);
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
  } = useGetAllCompaniesByLocationIdQuery({
    locationId: watch("locationId"),
  });

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
    <form onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}>
      <Jumbotron
        headerText="Employee Information"
        footerContent={
          <div>
            <Button
              ref={submitButtonRef}
              type="submit"
              disabled={isLoading || isFetchingBusinessUnits}
              loading={isLoading}
            >
              Submit
            </Button>
          </div>
        }
      >
        <div className="flex w-full flex-col gap-4 px-6">
          <fieldset>
            <TextField
              inputType="input"
              type="text"
              placeholder="Enter staff ID"
              label="Staff ID"
              flexStyle="row"
              name="staffId"
              error={!!errors.staffId}
              errorText={errors.staffId?.message}
              register={register}
            />
          </fieldset>
          <fieldset>
            <SMSelectDropDown
              options={employmentTypesOptions}
              label="Employee Type"
              flexStyle="row"
              varient="simple"
              value={getSelectedOption(
                employmentTypesOptions,
                watch("employmentTypeId"),
              )}
              onChange={(selectedOption) => {
                fieldSetterAndClearer({
                  value: selectedOption.value,
                  setterFunc: setValue,
                  setField: "employmentTypeId",
                  clearErrors,
                });
              }}
              placeholder="Select Employee Type"
              searchable={true}
              isError={!!errors.employmentTypeId}
              errorText={errors.employmentTypeId?.message}
            />
          </fieldset>
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
              value={getSelectedOption(
                workLocationOptions,
                watch("locationId"),
              )}
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
              value={getSelectedOption(
                departmentOptions,
                watch("departmentId"),
              )}
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
              placeholder="Date of Hire"
              label="Hire Date"
              register={register}
              error={!!errors?.hireDate?.message}
              errorText={errors?.hireDate?.message}
              flexStyle="row"
            />
          </fieldset>
        </div>
      </Jumbotron>
    </form>
  );
};

UpdateInfoForm.displayName = "UpdateInfoForm";
