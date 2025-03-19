import React, { useEffect, useState } from "react";
import { TrashFilledIcon } from "@/assets/svgs";
import { OptionType, SMSelectDropDown, TextField, Typography } from "@/components";
import { IEmploymentHistoryProps } from "@/redux/api";
import { cn, fieldSetterAndClearer, generateYearOptions } from "@/utils/helpers";
import { FieldErrors, UseFormClearErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { ModifiedEmploymentHistoryFormData } from "./EmploymentHistoryForm";

interface EmploymentHistoryProps {
  register: UseFormRegister<ModifiedEmploymentHistoryFormData>;
  index: number;
  remove: (index: number) => void;
  watch: UseFormWatch<ModifiedEmploymentHistoryFormData>;
  errors?: FieldErrors<
    Omit<IEmploymentHistoryProps, "from" | "to"> & {
      from: { label?: string | undefined; value?: number | undefined };
      to: { label?: string | undefined; value?: number | undefined };
    }
  >;
  onChange?: () => void;
  setValue: UseFormSetValue<ModifiedEmploymentHistoryFormData>;
  clearErrors: UseFormClearErrors<ModifiedEmploymentHistoryFormData>;
}

const options = generateYearOptions(1960);

export const EmploymentHistory: React.FC<EmploymentHistoryProps> = ({
  index,
  remove,
  register,
  watch,
  errors,
  onChange,
  setValue,
  clearErrors
}) => {
  const [filteredToYears, setFilteredToYears] = useState(options);

  const handleYearChange = (selectedOption: any, field: string) => {
      fieldSetterAndClearer({
        value: selectedOption,
        setterFunc: () =>
          setValue(
            `employmentHistory.${index}.${field}` as keyof ModifiedEmploymentHistoryFormData,
            selectedOption,
          ),
        setField: `employmentHistory.${index}.${field}`,
        clearErrors: clearErrors,
        clearFields: field === "from" ? [`employmentHistory.${index}.to`] : [],
      });
  
      if (onChange) {
        onChange();
      }
  };

  const filterYears = (selectedFromYear: any) => {
    const yearsAboveSelectedFromYear = options.filter(
      (year) => year.label >= selectedFromYear.label,
    );
    setFilteredToYears(yearsAboveSelectedFromYear.reverse());
  };
  const fromYear = watch(`employmentHistory.${index}.from`);
  const toYear = watch(`employmentHistory.${index}.to`);

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
          PREVIOUS EMPLOYMENT {index + 1}
        </Typography>
        {index > 0 && (
          <button onClick={() => remove(index)}>
            <TrashFilledIcon />
          </button>
        )}
      </div>
      <div>
        <TextField
          name={`employmentHistory.${index}.position`}
          inputType="input"
          type="text"
          placeholder="Enter a position"
          register={register}
          label="Position"
          flexStyle="row"
          error={!!errors?.position?.message}
          errorText={errors?.position?.message}
          onChange={() => onChange && onChange()}
        />
      </div>
      <div>
        <TextField
          name={`employmentHistory.${index}.organisation`}
          inputType="input"
          type="text"
          placeholder="Enter name of organization"
          register={register}
          label="Organization"
          flexStyle="row"
          error={!!errors?.organisation?.message}
          errorText={errors?.organisation?.message}
          onChange={() => onChange && onChange()}
        />
      </div>
      <div className="md:grid md:grid-cols-12">
        <div className="col-span-3 flex items-center">
          <Typography variant="h-s" fontWeight="medium" color="N700">
            Year Employed
          </Typography>
        </div>
        <div className="col-span-9 grid max-w-[370px] grid-cols-12 gap-2">
          <div className="col-span-5">
            <SMSelectDropDown 
              name={`employmentHistory.${index}.from`}
              options={options}
              placeholder="From"
              onChange={(selectedOption) => {
                filterYears(selectedOption);
                handleYearChange(selectedOption, "from")
              }}
              searchable={true}
              isError={!!errors?.from?.message}
              errorText={errors?.from?.message}
              value={fromYear?.value ? fromYear as OptionType : undefined} 
            />
          </div>
          <div className="col-span-1 flex items-center justify-center">-</div>
          <div className="col-span-5">
            <SMSelectDropDown 
              name={`employmentHistory.${index}.to`}
              options={filteredToYears}
              placeholder="To"
              onChange={(selectedOption) => handleYearChange(selectedOption, "to")}
              searchable={true}
              disabled={!fromYear.value}
              isError={!!errors?.to?.message}
              errorText={errors?.to?.message}
              value={toYear?.value ? toYear as OptionType : undefined} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};