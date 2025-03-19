import React, { useEffect, useState } from "react";
import { TrashFilledIcon } from "@/assets/svgs";
import {
  FileUploadSingle,
  OptionType,
  SMSelectDropDown,
  TextField,
  Typography,
} from "@/components";
import { IProfessionalQualificationProps } from "@/redux/api";
import {
  cn,
  fieldSetterAndClearer,
  generateYearOptions,
} from "@/utils/helpers";
import {
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import { ModifiedProfessionalQualificationFormData } from "./ProfessionalQualificationForm";

interface ProfessionalQualificationProps {
  register: UseFormRegister<ModifiedProfessionalQualificationFormData>;
  index: number;
  remove: (index: number) => void;
  setValue: UseFormSetValue<ModifiedProfessionalQualificationFormData>;
  watch: UseFormWatch<ModifiedProfessionalQualificationFormData>;
  errors?: FieldErrors<
    Omit<IProfessionalQualificationProps, "from" | "to"> & {
      from: { label?: string | undefined; value?: number | undefined };
      to: { label?: string | undefined; value?: number | undefined };
    }
  >;
  onChange?: () => void;
  clearErrors: UseFormClearErrors<ModifiedProfessionalQualificationFormData>;
}

const options = generateYearOptions(1960, 2027);

export const ProfessionalQualification: React.FC<
  ProfessionalQualificationProps
> = ({
  index,
  remove,
  register,
  setValue,
  watch,
  errors,
  onChange,
  clearErrors,
}) => {
  const [filteredToYears, setFilteredToYears] = useState(options);

  const handleChange = () => {
    if (onChange) {
      onChange();
    }
  };

  const handleYearChange = (selectedOption: any, field: string) => {
    handleChange();
    fieldSetterAndClearer({
      value: selectedOption,
      setterFunc: () =>
        setValue(
          `professionalQualification.${index}.${field}` as keyof ModifiedProfessionalQualificationFormData,
          selectedOption,
        ),
      setField: `professionalQualification.${index}.${field}`,
      clearErrors,
      clearFields:
        field === "from" ? [`professionalQualification.${index}.to`] : [],
    });
  };

  const filterYears = (selectedFromYear: any) => {
    const yearsAboveSelectedFromYear = options.filter(
      (year) => year.label >= selectedFromYear.label,
    );
    setFilteredToYears(yearsAboveSelectedFromYear.reverse());
  };
  const fromYear = watch(`professionalQualification.${index}.from`);
  const toYear = watch(`professionalQualification.${index}.to`);

  useEffect(() => {
    if (fromYear?.value) {
      filterYears(fromYear);
    } else {
      setFilteredToYears(options);
    }
  }, [fromYear]);

  return (
    <div
      className={cn("flex w-full flex-col gap-6", index > 0 && "border-t pt-6")}
    >
      <div className="flex items-center justify-between">
        <Typography variant="p-m" color="text-light">
          QUALIFICATION {index + 1}
        </Typography>
        {index > 0 && (
          <button onClick={() => remove(index)}>
            <TrashFilledIcon />
          </button>
        )}
      </div>
      <div>
        <TextField
          name={`professionalQualification.${index}.qualification`}
          inputType="input"
          type="text"
          placeholder="Enter a qualification"
          register={register}
          label="Qualification"
          flexStyle="row"
          error={!!errors?.qualification?.message}
          errorText={errors?.qualification?.message}
          onChange={handleChange}
        />
      </div>
      <div>
        <TextField
          name={`professionalQualification.${index}.institution`}
          inputType="input"
          type="text"
          placeholder="Enter institution"
          register={register}
          label="Institution"
          flexStyle="row"
          error={!!errors?.institution?.message}
          errorText={errors?.institution?.message}
          onChange={handleChange}
        />
      </div>
      <div className="md:grid md:grid-cols-12">
        <div className="col-span-3 flex items-center">
          <Typography variant="h-s" fontWeight="medium" color="N700">
            Year Obtained
          </Typography>
        </div>
        <div className="col-span-9 grid max-w-[370px] grid-cols-12 gap-2">
          <div className="col-span-5">
            <SMSelectDropDown
              name={`professionalQualification.${index}.from`}
              options={options}
              placeholder="From"
              onChange={(selectedOption) => {
                filterYears(selectedOption);
                handleYearChange(selectedOption, "from");
              }}
              searchable={true}
              isError={!!errors?.from?.message}
              errorText={errors?.from?.message}
              value={fromYear?.value ? (fromYear as OptionType) : undefined}
            />
          </div>
          <div className="col-span-1 flex items-center justify-center">-</div>
          <div className="col-span-5">
            <SMSelectDropDown
              name={`professionalQualification.${index}.to`}
              options={filteredToYears}
              placeholder="To"
              onChange={(selectedOption) => {
                handleYearChange(selectedOption, "to");
              }}
              searchable={true}
              disabled={!fromYear.value}
              isError={!!errors?.from?.message}
              errorText={errors?.from?.message}
              value={toYear?.value ? (toYear as OptionType) : undefined}
            />
          </div>
        </div>
      </div>
      <div className="md:grid md:grid-cols-12">
        <div className="col-span-3">
          <Typography variant="h-s" fontWeight="medium" color="N700">
            Upload Certificate
          </Typography>
        </div>
        <div className="col-span-9">
          <FileUploadSingle
            name={`professionalQualification.${index}.certificate`}
            setValue={setValue}
            error={!!errors?.certificate}
            errorText={errors?.certificate?.message}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};
