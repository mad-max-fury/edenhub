import React, { useRef, useState } from "react";
import { Button, FormStepJumbotron, notify, Typography } from "@/components";
import { RootState } from "@/redux";
import { IEmploymentHistoryProps, useUpdateEmployeeEmploymentHistoryMutation } from "@/redux/api";
import { setEmploymentHistory } from "@/redux/api/employee/bioDataForm.slice";
import { IApiError } from "@/redux/api/genericInterface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { TAB_QUERIES } from "./constants";
import { EmploymentHistory } from "./EmploymentHistory";
import { employmentHistoriesSchema } from "./schema";

export interface IEmploymentHistoryFormData {
  employmentHistory?: IEmploymentHistoryProps[];
}

export interface ModifiedEmploymentHistoryFormData {
  employmentHistory?: (Omit<IEmploymentHistoryProps, "from" | "to"> & {
    from: { label?: string | undefined; value?: number | undefined };
    to: { label?: string | undefined; value?: number | undefined };
  })[];
}

interface ChildFormProps {
  onClick: (step: string) => void;
}

export const EmploymentHistoryForm = ({ onClick }: ChildFormProps) => {
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const { employmentHistory, employeeId } = useSelector(
    (state: RootState) => state.bioDataForm,
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [updateEmploymentHistory, { isLoading }] =
    useUpdateEmployeeEmploymentHistoryMutation();
  const dispatch = useDispatch();
  const defaultValues = {
    position: "",
    organisation: "",
    from: { label: "", value: undefined },
    to: { label: "", value: undefined },
  };

  const transformedEmploymentHistory =
    employmentHistory?.employmentHistory?.map((item) => ({
      ...item,
      from: item.from
        ? { label: item.from, value: +item.from }
        : { label: "", value: undefined },
      to: item.to
        ? { label: item.to, value: +item.to }
        : { label: "", value: undefined },
    })) || [defaultValues];

  const {
    control,
    handleSubmit,
    register,
    watch,
    formState: { errors },
    setValue,
    clearErrors
  } = useForm<ModifiedEmploymentHistoryFormData>({
    defaultValues: {
      employmentHistory: transformedEmploymentHistory,
    },
    resolver: yupResolver(employmentHistoriesSchema),
    context: { hasChanges },
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "employmentHistory",
  });
  const onSubmit = async (data: ModifiedEmploymentHistoryFormData) => {
    if (employeeId) {
      if (data?.employmentHistory) {
        const apiData = {
          employeeId,
          workHistory: data.employmentHistory?.map((item) => ({
            ...item,
            from: item?.from.label || "",
            to: item?.to.label || "",
          })),
          oldUser: true,
        };
        updateEmploymentHistory(apiData)
          .unwrap()
          .then(() => {
            dispatch(
              setEmploymentHistory({
                employmentHistory:
                  data.employmentHistory as IEmploymentHistoryProps[],
              }),
            );
            onClick(TAB_QUERIES[5]);
            notify.success({
              message: "Employment history info updated successfully",
            });
          })
          .catch((err: IApiError) => {
            notify.error({
              message: "Action failed",
              subtitle: getErrorMessage(err),
            });
          });
      }
    }
  };

  const handleAddEmployeeHistory = () => {
    setHasChanges(true);
    append(defaultValues);
  };

  const handleRemoveEmployeeHistory = (index: number) => {
    remove(index);
    if (fields.length <= 1) {
      setHasChanges(false);
    }
  };
  const handleFieldChange = () => {
    setHasChanges(true);
  };

  const handleSkip = () => {
    dispatch(setEmploymentHistory({ employmentHistory: [] }));
    onClick(TAB_QUERIES[5]);
  };

  return (
    <FormStepJumbotron
      title="Employment History"
      currentStep={5}
      totalSteps={TAB_QUERIES.length}
      onBack={() => onClick(TAB_QUERIES[3])}
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
          <EmploymentHistory
            key={field.id}
            index={index}
            remove={() => {
              handleRemoveEmployeeHistory(index);
            }}
            watch={watch}
            register={register}
            errors={errors.employmentHistory?.[index]}
            onChange={handleFieldChange}
            setValue={setValue}
            clearErrors={clearErrors}
          />
        ))}
        <div className="flex justify-end">
          <Typography
            variant="p-m"
            color="B400"
            className="cursor-pointer"
            onClick={handleAddEmployeeHistory}
          >
            Add Previous Employment
          </Typography>
        </div>
        <button type="submit" ref={submitButtonRef} className="sr-only">
          Submit
        </button>
        {/* Invisible Submit Button */}
        <button type="submit" ref={submitButtonRef} className="sr-only">
          Submit
        </button>
      </form>
    </FormStepJumbotron>
  );
};

EmploymentHistoryForm.displayName = "EmploymentHistoryForm";