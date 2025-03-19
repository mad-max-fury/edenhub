import React, { useRef, useState } from "react";
import { Button, FormStepJumbotron, notify, Typography } from "@/components";
import { RootState } from "@/redux";
import {
  IDependantProps,
  useUpdateEmployeeDependantMutation,
} from "@/redux/api";
import { setDependants } from "@/redux/api/employee/bioDataForm.slice";
import { IApiError } from "@/redux/api/genericInterface";
import {
  ISelectItemProps,
  ISelectItemPropsWithValueGeneric,
} from "@/redux/api/interface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  SubmitHandler,
  useFieldArray,
  useForm,
  UseFormClearErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { TAB_QUERIES } from "./constants";
import { Dependant } from "./Dependant";
import { dependantsSchema } from "./schema";

export interface IDependantsFormData {
  dependants?: IDependantProps[];
}

interface ChildFormProps {
  onClick: (step: string) => void;
  allRelationships: ISelectItemPropsWithValueGeneric[];
  allGenders: ISelectItemPropsWithValueGeneric[];
}

export const DependantsForm: React.FC<ChildFormProps> = ({
  onClick,
  allRelationships,
  allGenders,
}) => {
  const { dependants, employeeId } = useSelector(
    (state: RootState) => state.bioDataForm,
  );

  const [hasChanges, setHasChanges] = useState(false);
  const [updateDependants, { isLoading }] =
    useUpdateEmployeeDependantMutation();
  const dispatch = useDispatch();
  const defaultValues = {
    relationshipId: allRelationships[0] as ISelectItemProps,
    name: "",
    dateOfBirth: "",
    genderId: "",
  };
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  const {
    control,
    handleSubmit,
    register,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<IDependantsFormData>({
    defaultValues: {
      dependants:
        (dependants?.dependants?.length as number) > 0
          ? dependants?.dependants
          : [defaultValues],
    },
    resolver: yupResolver(dependantsSchema),
    mode: "onChange",
    context: { hasChanges },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "dependants",
  });

  const onSubmit: SubmitHandler<IDependantsFormData> = (data) => {
    if (employeeId) {
      const apiData = {
        employeeId,
        employeeDependent: (data?.dependants as IDependantProps[]).map(
          (item) => {
            return {
              ...item,
              employeeId,
              relationshipId: item?.relationshipId?.value as string,
            };
          },
        ),
        oldUser: true,
      };

      updateDependants(apiData)
        .unwrap()
        .then(() => {
          dispatch(
            setDependants({ dependants: data.dependants as IDependantProps[] }),
          );
          notify.success({ message: "Dependants updated successfully" });
          onClick(TAB_QUERIES[2]);
        })
        .catch((err: IApiError) => {
          notify.error({
            message: "Action failed",
            subtitle: getErrorMessage(err),
          });
        });
    }
  };

  const handleAddDependant = () => {
    setHasChanges(true);
    append(defaultValues);
  };

  const handleRemoveDependant = (index: number) => {
    remove(index);
    if (fields.length <= 1) {
      setHasChanges(false);
    }
  };

  const handleFieldChange = () => {
    setHasChanges(true);
  };

  const handleSkip = () => {
    dispatch(setDependants({ dependants: [] }));
    onClick(TAB_QUERIES[2]);
  };

  return (
    <FormStepJumbotron
      title="Dependant"
      currentStep={2}
      totalSteps={TAB_QUERIES.length}
      onBack={() => onClick(TAB_QUERIES[0])}
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
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-6"
      >
        {fields.map((field, index) => (
          <Dependant
            key={field.id}
            control={control}
            index={index}
            remove={() => {
              handleRemoveDependant(index);
            }}
            register={register}
            setValue={setValue as UseFormSetValue<IDependantsFormData>}
            clearErrors={clearErrors as UseFormClearErrors<IDependantsFormData>}
            watch={watch as UseFormWatch<IDependantsFormData>}
            allGenders={allGenders}
            allRelationships={allRelationships}
            errors={errors.dependants?.[index]}
            onChange={handleFieldChange}
          />
        ))}
        <div className="flex justify-end">
          <Typography
            variant="p-m"
            color="B400"
            className="cursor-pointer"
            onClick={handleAddDependant}
          >
            Add Dependant
          </Typography>
        </div>
        <button type="submit" ref={submitButtonRef} className="sr-only">
          Submit
        </button>
      </form>
    </FormStepJumbotron>
  );
};
