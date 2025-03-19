import React, { useRef } from "react";
import {
  Checkbox,
  FormStepJumbotron,
  notify,
  Typography,
  ValidationText,
} from "@/components";
import { RootState } from "@/redux";
import { useAddOrUpdateEmployeeEmployementOnboardingSetupMutation } from "@/redux/api";
import { setOnboardingSetup } from "@/redux/api/employee/enrollmentForm.slice";
import { IApiError } from "@/redux/api/genericInterface";
import {
  ISelectItemPropsWithValueGeneric,
  OnboardingDocEnum,
  OnboardingEnum,
} from "@/redux/api/interface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { fieldSetterAndClearer } from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { TAB_QUERIES } from "./constants";
import { onboardingSetupValidationSchema } from "./schema";

export interface IOnboardingSetupFormData {
  requiredDocument: string[];
  requiredForm: string[];
}

interface ChildFormProps {
  onClick: (step: string) => void;
  requiredDocs: ISelectItemPropsWithValueGeneric[];
  requiredForms: ISelectItemPropsWithValueGeneric[];
}

export const OnboardingSetupForm = ({
  onClick,
  requiredDocs,
  requiredForms,
}: ChildFormProps) => {
  const [addOrUpdateOnboardingSetup, { isLoading }] =
    useAddOrUpdateEmployeeEmployementOnboardingSetupMutation();

  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  const { onboardingSetupFormData, employeeId } = useSelector(
    (state: RootState) => state.employeeEnrollmentForm,
  );

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
  } = useForm<IOnboardingSetupFormData>({
    defaultValues: onboardingSetupFormData as IOnboardingSetupFormData,
    resolver: yupResolver(onboardingSetupValidationSchema),
    mode: "onChange",
  });

  const dispatch = useDispatch();

  const onSubmit = async (data: IOnboardingSetupFormData) => {
    try {
      await addOrUpdateOnboardingSetup({
        employeeId: employeeId as string,
        requiredDocument: data.requiredDocument.map((id) => ({
          requiredDocumentId: Number(id),
        })),
        requiredForm: data.requiredForm.map((id) => ({
          requiredFormId: Number(id),
        })),
      }).unwrap();
      dispatch(setOnboardingSetup(data));
      onClick(TAB_QUERIES[4]);
      notify.success({
        message: "Onboarding Setup updated successfully",
      });
    } catch (error) {
      notify.error({
        message: "Failed to add or update onboarding documents",
        subtitle: getErrorMessage(error as IApiError),
      });
    }
  };

  const handleSelect = (field: keyof IOnboardingSetupFormData, id: string) => {
    const currentValues = watch(field) || [];
    const index = currentValues.findIndex((value) => value === id);

    const newArray =
      index === -1
        ? [...currentValues, id]
        : currentValues.filter((value) => value !== id);

    fieldSetterAndClearer({
      value: newArray,
      setterFunc: setValue,
      setField: field,
      clearErrors,
    });
  };

  const requiredDisabledForms = [
    OnboardingEnum.BIO_DATA.toString(),
    OnboardingEnum.DOCUMENTS.toString(),
    OnboardingEnum.INTEGRATION.toString(),
    OnboardingEnum.ID_CARD.toString(),
  ];

  const requiredDisabledDoc = [OnboardingDocEnum.CV.toString()];
  return (
    <FormStepJumbotron
      title="Onboarding Setup"
      currentStep={4}
      totalSteps={TAB_QUERIES.length}
      onNext={() => submitButtonRef.current?.click()}
      onBack={() => onClick(TAB_QUERIES[2])}
      noPadding
      isLoading={isLoading}
    >
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <Typography
            fontWeight="medium"
            className="mb-2"
            variant="h-s"
            color="N700"
          >
            Required Documents
          </Typography>
          <Typography variant="p-m" color={"text-light"}>
            Choose the documents needed from your employee to ensure a smooth
            onboarding experience.
          </Typography>

          <div className="mt-5 flex flex-wrap gap-3">
            {requiredDocs.map((doc) => (
              <Checkbox
                key={doc.value}
                checked={
                  (watch("requiredDocument") || []).findIndex(
                    (docR) => docR === doc.value,
                  ) !== -1
                }
                id={doc.value as string}
                label={doc.label}
                value={doc.value as string}
                onSelect={() =>
                  handleSelect("requiredDocument", doc.value as string)
                }
                disabled={requiredDisabledDoc.includes(`${doc.value}`)}
              />
            ))}
          </div>
          {errors.requiredDocument?.message && (
            <ValidationText
              message={errors.requiredDocument?.message}
              status={"error"}
            />
          )}
        </div>
        <hr />
        <div>
          <Typography
            fontWeight="medium"
            className="mb-2"
            variant="h-s"
            color="N700"
          >
            Required Forms
          </Typography>
          <Typography variant="p-m" color={"text-light"}>
            Choose the documents needed from your employee to ensure a smooth
            onboarding experience.
          </Typography>
          <div className="mt-5 flex flex-wrap gap-3">
            {requiredForms.map((form) => {
              return (
                <Checkbox
                  key={form.value}
                  checked={
                    (watch("requiredForm") || []).findIndex(
                      (formR) => formR === form.value,
                    ) !== -1
                  }
                  id={form.value as string}
                  label={form.label}
                  value={form.value as string}
                  onSelect={() =>
                    handleSelect("requiredForm", form.value as string)
                  }
                  disabled={requiredDisabledForms.includes(`${form.value}`)}
                />
              );
            })}
          </div>
          {errors.requiredForm?.message && (
            <ValidationText
              message={errors.requiredForm?.message}
              status={"error"}
            />
          )}
        </div>
        {/* Invisible Submit Button */}
        <button type="submit" ref={submitButtonRef} className="sr-only">
          Submit
        </button>
      </form>
    </FormStepJumbotron>
  );
};
