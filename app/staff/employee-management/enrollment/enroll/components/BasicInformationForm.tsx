"use client";

import React, { useRef } from "react";
import { FormStepJumbotron, notify, TextField, Typography } from "@/components";
import { RootState } from "@/redux";
import { useAddOrUpdateEmployeeEnrollmentMutation } from "@/redux/api";
import {
  setBasicInformation,
  setEmployeeId,
} from "@/redux/api/employee/enrollmentForm.slice";
import { IApiError } from "@/redux/api/genericInterface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { TAB_QUERIES } from "./constants";
import { basicInformationValidationSchema } from "./schema";

export interface IBasicInformationFormData {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
}

interface ChildFormProps {
  onClick: (step: string) => void;
}

export const BasicInformationForm = ({ onClick }: ChildFormProps) => {
  const [addOrUpdateEmployeeEnrollment, { isLoading }] =
    useAddOrUpdateEmployeeEnrollmentMutation();
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const { basicInformation, employeeId } = useSelector(
    (state: RootState) => state.employeeEnrollmentForm,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IBasicInformationFormData>({
    defaultValues: basicInformation as IBasicInformationFormData,
    resolver: yupResolver(basicInformationValidationSchema),
    mode: "onChange",
  });

  const dispatch = useDispatch();

  const onSubmit = async (data: IBasicInformationFormData) => {
    const employeeIdObject = employeeId ? { employeeId } : {};
    try {
      const res = await addOrUpdateEmployeeEnrollment({
        ...data,
        ...employeeIdObject,
      }).unwrap();
      dispatch(setEmployeeId(res.data));
      dispatch(setBasicInformation(data));
      onClick(TAB_QUERIES[1]);
      notify.success({
        message: "Basic information updated successfully",
      });
    } catch (error) {
      notify.error({
        message: "Faild to add or update enrollment",
        subtitle: getErrorMessage(error as IApiError),
      });
    }
  };

  return (
    <FormStepJumbotron
      title="Basic Information"
      currentStep={1}
      totalSteps={TAB_QUERIES.length}
      onNext={() => submitButtonRef.current?.click()}
      isLoading={isLoading}
    >
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}
      >
        <Typography variant="p-m" color="text-light">
          Tell us the name of your new hire and their email, and we’ll invite
          them to set up their employee account. You can always delete their
          profile if you decide not to hire them after all.
        </Typography>
        <fieldset className="items-center md:grid md:grid-cols-12">
          <div className="col-span-3">
            <Typography variant="h-s" fontWeight="medium" color="N700">
              Full Name
            </Typography>
          </div>
          <div className="col-span-9 grid grid-cols-1 gap-2 md:grid-cols-3 lg:mx-auto lg:grid-cols-3">
            <TextField
              name="firstName"
              inputType="input"
              placeholder="First Name"
              error={!!errors.firstName}
              errorText={errors.firstName?.message}
              register={register}
            />
            <TextField
              inputType="input"
              placeholder="Middle Name"
              name="middleName"
              error={!!errors.middleName}
              errorText={errors.middleName?.message}
              register={register}
            />
            <TextField
              inputType="input"
              placeholder="Last Name"
              name="lastName"
              error={!!errors.lastName}
              errorText={errors.lastName?.message}
              register={register}
            />
          </div>
        </fieldset>

        <fieldset>
          <TextField
            inputType="input"
            type="email"
            label="Email"
            placeholder="email@tenece.com"
            name="email"
            flexStyle="row"
            error={!!errors.email}
            errorText={errors.email?.message}
            register={register}
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
