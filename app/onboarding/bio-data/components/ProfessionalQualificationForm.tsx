import React, { useRef, useState } from "react";
import { Button, FormStepJumbotron, notify, Typography } from "@/components";
import { RootState } from "@/redux";
import { IProfessionalQualificationProps, useUpdateEmployeeProfessionalQualificationMutation } from "@/redux/api";
import { setProfessionalQualification } from "@/redux/api/employee/bioDataForm.slice";
import { IApiError } from "@/redux/api/genericInterface";
import formatImageToBase64 from "@/utils/formatImageToBase64";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { TAB_QUERIES } from "./constants";
import { ProfessionalQualification } from "./ProfessionalQualification";
import { professionalQualificationsSchema } from "./schema";

export interface IProfessionalQualificationFormData {
  professionalQualification?: IProfessionalQualificationProps[];
}

export interface ModifiedProfessionalQualificationFormData {
  professionalQualification?: (Omit<
    IProfessionalQualificationProps,
    "from" | "to"
  > & {
    from: { label?: string | undefined; value?: number | undefined };
    to: { label?: string | undefined; value?: number | undefined };
  })[];
}

interface ChildFormProps {
  onClick: (step: string) => void;
}

export const ProfessionalQualificationForm = ({ onClick }: ChildFormProps) => {
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const { professionalQualification, employeeId } = useSelector(
    (state: RootState) => state.bioDataForm,
  );
  const [updateProfessionalQualification, { isLoading }] =
    useUpdateEmployeeProfessionalQualificationMutation();
  const dispatch = useDispatch();
  const defaultValues = {
    institution: "",
    qualification: "",
    from: { label: "", value: undefined },
    to: { label: "", value: undefined },
    certificate: undefined,
  };

  const transformedProfessionalQualification =
    professionalQualification?.professionalQualification?.map((item) => {
      return {
        ...item,
        certificate: null,
        from: item.from
          ? { label: item.from, value: +item.from }
          : { label: "", value: undefined },
        to: item.to
          ? { label: item.to, value: +item.to }
          : { label: "", value: undefined },
    };
  }) || [defaultValues];

  const {
    control,
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
    trigger,
    clearErrors,
  } = useForm<ModifiedProfessionalQualificationFormData>({
    defaultValues: {
      professionalQualification: transformedProfessionalQualification,
    },
    resolver: yupResolver(professionalQualificationsSchema),
    mode: "onChange",
    context: { hasChanges },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "professionalQualification",
  });

  const onSubmit = async (data: ModifiedProfessionalQualificationFormData) => {
    if (employeeId) {
      const professionalQualification = [];

      for await (const item of data.professionalQualification ?? []) {
        const certificate = (await formatImageToBase64(
          item.certificate as File,
        )) as string;

        professionalQualification.push({
          ...item,
          employeeId,
          certificate,
          from: item?.from.label || "",
          to: item?.to.label || "",
        });
      }

      const apiData = {
        employeeId,
        workHistory: professionalQualification,
        oldUser: true,
      };
      updateProfessionalQualification(apiData)
        .unwrap()
        .then(() => {
          dispatch(setProfessionalQualification({
            professionalQualification: 
              data.professionalQualification as IProfessionalQualificationProps[],
          }));
          onClick(TAB_QUERIES[7]);
          notify.success({
            message: "Professional qualification info updated successfully",
          });
        })
        .catch((err: IApiError) => {
          notify.error({
            message: "Action failed",
            subtitle: getErrorMessage(err),
          });
        });
    }
  };

  const handleAddProfessionalQualification = () => {
    setHasChanges(true);
    append(defaultValues);
  };

  const handleRemoveProfessionalQualification = (index: number) => {
    remove(index);
    if (fields.length <= 1) {
      setHasChanges(false);
    }
  };

  const handleFieldChange = () => {
    setHasChanges(true);
    trigger();
  };

  const handleSkip = () => {
    dispatch(setProfessionalQualification({ professionalQualification: [] }));
    onClick(TAB_QUERIES[7]);
  };

  return (
    <FormStepJumbotron
      title="Professional Qualification"
      currentStep={7}
      totalSteps={TAB_QUERIES.length}
      onBack={() => onClick(TAB_QUERIES[5])}
      onNext={hasChanges ? () => submitButtonRef.current?.click() : undefined}
      isLoading={isLoading}
      additionalActions={
        !hasChanges ? (
          <Button variant="primary" onClick={handleSkip}>
            Skip
          </Button>
        ) : undefined
      }
    >
      <form
        className="flex w-full flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {fields.map((field, index) => (
          <ProfessionalQualification
            key={field.id}
            index={index}
            remove={() => {
              handleRemoveProfessionalQualification(index);
            }}
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors.professionalQualification?.[index]}
            onChange={handleFieldChange}
            clearErrors={clearErrors}
          />
        ))}
        <div className="flex justify-end">
          <Typography
            variant="p-m"
            color="B400"
            className="cursor-pointer"
            onClick={handleAddProfessionalQualification}
          >
            Add Qualification
          </Typography>
        </div>
        {/* Invisible Submit Button */}
        <button type="submit" ref={submitButtonRef} className="sr-only">
          Submit
        </button>
      </form>
    </FormStepJumbotron>
  );
};

ProfessionalQualificationForm.displayName = "ProfessionalQualificationForm";