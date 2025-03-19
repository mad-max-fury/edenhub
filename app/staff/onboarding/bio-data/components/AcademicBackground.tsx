import React, { useEffect, useState } from "react";
import { TrashFilledIcon } from "@/assets/svgs";
import {
  Checkbox,
  FileUploadSingle,
  OptionType,
  SMSelectDropDown,
  TextField,
  Typography,
} from "@/components";
import { IAcademicBackgroundProps } from "@/redux/api";
import { ISelectItemPropsWithValueGeneric } from "@/redux/api/interface";
import {
  cn,
  fieldSetterAndClearer,
  generateYearOptions,
} from "@/utils/helpers";
import {
  Control,
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import { ModifiedAcademicBackgroundFormData } from "./AcademicBackgroundForm";
import { FILE_SIZE } from "@/constants/data";

interface AcademicBackgroundProps {
  control: Control<ModifiedAcademicBackgroundFormData>;
  register: UseFormRegister<ModifiedAcademicBackgroundFormData>;
  index: number;
  remove: (index: number) => void;
  allQualifications: ISelectItemPropsWithValueGeneric[];
  setValue: UseFormSetValue<ModifiedAcademicBackgroundFormData>;
  clearErrors: UseFormClearErrors<ModifiedAcademicBackgroundFormData>;
  watch: UseFormWatch<ModifiedAcademicBackgroundFormData>;
  errors?: FieldErrors<
    Omit<IAcademicBackgroundProps, "from" | "to"> & {
      from: { label?: string | undefined; value?: number | undefined };
      to: { label?: string | undefined; value?: number | undefined };
    }
  >;
  onChange?: () => void;
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

const options = generateYearOptions(1960);

export const AcademicBackground: React.FC<AcademicBackgroundProps> = ({
  index,
  remove,
  register,
  allQualifications,
  setValue,
  clearErrors,
  watch,
  errors,
  onChange,
  checked,
  setChecked,
}) => {
  const [filteredToYears, setFilteredToYears] = useState(options);
  const [prevToValue, setPrevToValue] = useState<any>(undefined);

  const handleChange = () => {
    if (onChange) {
      onChange();
    }
  };

  const handleYearChange = (selectedOption: any, field: string) => {
    if (onChange) {
      onChange();
    }
    fieldSetterAndClearer({
      value: selectedOption,
      setterFunc: () =>
        setValue(
          `academicBackground.${index}.${field}` as keyof ModifiedAcademicBackgroundFormData,
          selectedOption,
        ),
      setField: `academicBackground.${index}.${field}`,
      clearErrors,
      clearFields: field === "from" ? [`academicBackground.${index}.to`] : [],
    });
  };

  const filterYears = (selectedFromYear: any) => {
    const yearsAboveSelectedFromYear = options.filter(
      (year) => year.label >= selectedFromYear.label,
    );
    setFilteredToYears(yearsAboveSelectedFromYear.reverse());
  };
  const fromYear = watch(`academicBackground.${index}.from`);
  const toYear = watch(`academicBackground.${index}.to`);

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
          SCHOOL {index + 1}
        </Typography>
        {index > 0 && (
          <button onClick={() => remove(index)}>
            <TrashFilledIcon />
          </button>
        )}
      </div>
      <div>
        <TextField
          name={`academicBackground.${index}.school`}
          inputType="input"
          type="text"
          placeholder="Enter a school"
          register={register}
          label="School"
          flexStyle="row"
          error={!!errors?.school?.message}
          errorText={errors?.school?.message}
          onChange={handleChange}
        />
      </div>
      <div>
        <TextField
          name={`academicBackground.${index}.major`}
          inputType="input"
          type="text"
          placeholder="Enter a major"
          register={register}
          label="Major"
          flexStyle="row"
          error={!!errors?.major?.message}
          errorText={errors?.major?.message}
          onChange={handleChange}
        />
      </div>
      <div>
        <SMSelectDropDown
          name={`academicBackground.${index}.qualificationId`}
          options={allQualifications}
          varient="simple"
          isMulti={false}
          onChange={(selectedOption) => {
            fieldSetterAndClearer({
              value: selectedOption,
              setterFunc: setValue,
              setField: `academicBackground.${index}.qualificationId`,
              clearErrors,
            });
            handleChange();
          }}
          value={
            watch(`academicBackground.${index}.qualificationId`) as OptionType
          }
          label="Degree"
          flexStyle="row"
          placeholder="Select a degree"
          searchable={true}
          isError={!!errors?.qualificationId?.message}
          errorText={errors?.qualificationId?.message}
        />
      </div>
      <div className="md:grid md:grid-cols-12">
        <div className="col-span-3 flex items-center">
          <Typography variant="h-s" fontWeight="medium" color="N700">
            Year Attended
          </Typography>
        </div>
        <div className="col-span-9 grid max-w-[370px] grid-cols-12 gap-2">
          <div className="col-span-5">
            <SMSelectDropDown
              name={`academicBackground.${index}.from`}
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
              name={`academicBackground.${index}.to`}
              options={filteredToYears}
              placeholder="To"
              onChange={(selectedOption) =>
                handleYearChange(selectedOption, "to")
              }
              searchable={true}
              disabled={checked ? true : !fromYear.value}
              isError={!!errors?.from?.message}
              errorText={errors?.from?.message}
              value={toYear?.value ? (toYear as OptionType) : undefined}
            />
          </div>
        </div>
      </div>
      <div className="md:grid md:grid-cols-12">
        <div className="col-span-3"></div>
        <div className="col-span-9 flex">
          <Checkbox
            label=" "
            checked={checked}
            onSelect={() => {
              if (!checked) {
                const previousValue = watch(`academicBackground.${index}.to`);
                setValue(
                  `academicBackground.${index}.to` as keyof ModifiedAcademicBackgroundFormData,
                  undefined,
                );
                clearErrors(`academicBackground.${index}.to`);
                setPrevToValue(previousValue);
              } else {
                setValue(
                  `academicBackground.${index}.to` as keyof ModifiedAcademicBackgroundFormData,
                  prevToValue,
                );
              }
              setChecked((prev) => !prev);
            }}
          />
          <Typography variant="p-m">Currently enrolled</Typography>
        </div>
      </div>
      <div className="md:grid md:grid-cols-12">
        <div className="col-span-3">
          <Typography variant="h-s" fontWeight="medium" color="N700">
            Upload Certificate
          </Typography>

          <Typography
            variant="p-s"
            fontWeight="regular"
            color={"N500"}
            className="mb-2"
          >
            <label>{`Less than ${FILE_SIZE}MB`}</label>
          </Typography>
        </div>
        <div className="col-span-9">
          <FileUploadSingle
            name={`academicBackground.${index}.certificate`}
            setValue={setValue}
            error={!!errors?.certificate}
            errorText={errors?.certificate?.message}
            onChange={handleChange}
            formats={["jpg", "png", "jpeg", "pdf"]}
          />
        </div>
      </div>
    </div>
  );
};
