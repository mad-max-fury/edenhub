import React, { useRef } from "react";
import {
  FormStepJumbotron,
  notify,
  RadioButton,
  Typography,
  ValidationText,
} from "@/components";
import { RootState } from "@/redux";
import { useAddOrUpdateEmployeeEmployementTypeMutation } from "@/redux/api";
import { setEmploymentType } from "@/redux/api/employee/enrollmentForm.slice";
import { IApiError } from "@/redux/api/genericInterface";
import { ISelectItemPropsWithValueGeneric } from "@/redux/api/interface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { TAB_QUERIES } from "./constants";
import { employmentTypeValidationSchema } from "./schema";

export interface IEmploymentTypeFormData {
  employmentType: string;
}

interface ChildFormProps {
  onClick: (step: string) => void;
  employmentTypeOptions: ISelectItemPropsWithValueGeneric[];
}

export const EmploymentTypeForm = ({
  onClick,
  employmentTypeOptions,
}: ChildFormProps) => {
  const [addOrUpdateEmployeeEmploymentType, { isLoading }] =
    useAddOrUpdateEmployeeEmployementTypeMutation();
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const { employmentTypeFormData, employeeId } = useSelector(
    (state: RootState) => state.employeeEnrollmentForm,
  );
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<IEmploymentTypeFormData>({
    defaultValues: employmentTypeFormData as IEmploymentTypeFormData,
    resolver: yupResolver(employmentTypeValidationSchema),
    mode: "onChange",
  });

  const dispatch = useDispatch();

  const onSubmit = async (data: IEmploymentTypeFormData) => {
    try {
      await addOrUpdateEmployeeEmploymentType({
        employmentTypeId: data.employmentType,
        employeeId: employeeId as string,
      }).unwrap();
      dispatch(setEmploymentType(data));
      onClick(TAB_QUERIES[2]);
      notify.success({
        message: "Employment type updated successfully",
      });
    } catch (error) {
      notify.error({
        message: "Faild to add or update employment type",
        subtitle: getErrorMessage(error as IApiError),
      });
    }
  };

  const employmentTypes = employmentTypeOptions.map((item) => (
    <RadioButton<IEmploymentTypeFormData>
      name="employmentType"
      value={String(item.value) as string}
      label={item.label}
      key={item.label}
      control={control}
    />
  ));

  return (
    <FormStepJumbotron
      title="Employment Type"
      currentStep={2}
      totalSteps={TAB_QUERIES.length}
      onNext={() => submitButtonRef.current?.click()}
      onBack={() => onClick(TAB_QUERIES[0])}
      isLoading={isLoading}
    >
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="items-center md:grid md:grid-cols-12">
          <div className="col-span-3 mb-auto grid grid-cols-1">
            <Typography variant="h-s" fontWeight="medium">
              Employment Type
            </Typography>
          </div>
          <div className="col-span-9 grid grid-cols-1 gap-2 lg:mx-auto">
            {employmentTypes}
            {errors.employmentType?.message && (
              <ValidationText
                status="error"
                message={errors.employmentType?.message}
              />
            )}
          </div>
        </fieldset>

        {/* Invisible Submit Button */}
        <button type="submit" ref={submitButtonRef} className="sr-only">
          Submit
        </button>
      </form>
    </FormStepJumbotron>
  );
};
