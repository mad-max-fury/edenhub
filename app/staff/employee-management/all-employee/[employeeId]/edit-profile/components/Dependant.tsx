import React from "react";
import { TrashFilledIcon } from "@/assets/svgs";
import {
  OptionType,
  RadioButton,
  SMSelectDropDown,
  TextField,
  Typography,
  ValidationText,
} from "@/components";
import { IDependantProps } from "@/redux/api";
import { ISelectItemPropsWithValueGeneric } from "@/redux/api/interface";
import { cn, fieldSetterAndClearer } from "@/utils/helpers";
import {
  Control,
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import { IDependantsFormData } from "./DependantsForm";

interface DependantProps {
  control: Control<IDependantsFormData>;
  register: UseFormRegister<IDependantsFormData>;
  index: number;
  remove: (index: number) => void;
  allGenders: ISelectItemPropsWithValueGeneric[];
  allRelationships: ISelectItemPropsWithValueGeneric[];
  setValue: UseFormSetValue<IDependantsFormData>;
  clearErrors: UseFormClearErrors<IDependantsFormData>;
  watch: UseFormWatch<IDependantsFormData>;
  errors?: FieldErrors<IDependantProps>;
  onChange?: () => void;
}

export const Dependant: React.FC<DependantProps> = ({
  control,
  index,
  remove,
  register,
  allGenders,
  allRelationships,
  setValue,
  clearErrors,
  watch,
  errors,
  onChange,
}) => {
  const handleChange = () => {
    if (onChange) {
      onChange();
    }
  };

  return (
    <div
      className={cn("flex w-full flex-col gap-6", index > 0 && "border-t pt-6")}
    >
      <div className="flex items-center justify-between">
        <Typography variant="p-m" color="text-light">
          DEPENDANT {index + 1}
        </Typography>
        {index > 0 && (
          <button onClick={() => remove(index)}>
            <TrashFilledIcon />
          </button>
        )}
      </div>
      <div>
        <SMSelectDropDown
          options={allRelationships}
          varient="simple"
          isMulti={false}
          onChange={(selectedOption) => {
            fieldSetterAndClearer({
              value: selectedOption,
              setterFunc: setValue,
              setField: `dependants.${index}.relationshipId`,
              clearErrors,
            });
            handleChange();
          }}
          value={watch(`dependants.${index}.relationshipId`) as OptionType}
          label="Relationship"
          flexStyle="row"
          placeholder="Select a relationship"
          searchable={true}
          isError={!!errors?.relationshipId?.message}
          errorText={errors?.relationshipId?.message}
        />
      </div>
      <div>
        <TextField
          name={`dependants.${index}.name`}
          inputType="input"
          type="text"
          placeholder="Enter name"
          register={register}
          label="Name"
          flexStyle="row"
          error={!!errors?.name?.message}
          errorText={errors?.name?.message}
          onChange={handleChange}
        />
      </div>
      <div>
        <TextField
          name={`dependants.${index}.dateOfBirth`}
          inputType="input"
          type="date"
          placeholder="Enter date of birth"
          label="Date of Birth"
          flexStyle="row"
          register={register}
          error={!!errors?.dateOfBirth?.message}
          errorText={errors?.dateOfBirth?.message}
          onChange={handleChange}
        />
      </div>
      <div className="md:grid md:grid-cols-12">
        <div className="col-span-3">
          <Typography variant="h-s" fontWeight="medium" color="N700">
            Sex
          </Typography>
        </div>
        <div className="col-span-9 grid max-w-[512px] flex-1 grid-cols-1 gap-2">
          {allGenders.map((gender, genderIndex) => (
            <RadioButton
              key={genderIndex}
              name={`dependants.${index}.genderId`}
              value={String(gender.value)}
              label={gender.label}
              control={control}
              onChange={handleChange}
            />
          ))}
          {errors?.genderId?.message && (
            <ValidationText
              status="error"
              message={errors?.genderId?.message}
            />
          )}
        </div>
      </div>
    </div>
  );
};
