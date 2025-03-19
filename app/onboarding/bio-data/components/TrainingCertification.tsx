import React from "react";
import { TrashFilledIcon } from "@/assets/svgs";
import { FileUploadSingle, OptionType, SMSelectDropDown, TextField, Typography } from "@/components";
import { ITrainingCertificationProps } from "@/redux/api";
import { cn, fieldSetterAndClearer, formatInputDate, generateYearOptions } from "@/utils/helpers";
import { FieldErrors, UseFormClearErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { ModifiedTrainingCertificationFormData } from "./TrainingCertificationForm";

interface TrainingCertificationProps {
  register: UseFormRegister<ModifiedTrainingCertificationFormData>;
  index: number;
  remove: (index: number) => void;
  setValue: UseFormSetValue<ModifiedTrainingCertificationFormData>;
  errors?: FieldErrors<
    Omit<ITrainingCertificationProps, "to"> & {
      to: { label?: string | undefined; value?: number | undefined };
    }
  >;
  onChange?: () => void;
  clearErrors?: UseFormClearErrors<ModifiedTrainingCertificationFormData>;
  watch?: UseFormWatch<ModifiedTrainingCertificationFormData>;
}

const options = generateYearOptions(1960);

export const TrainingCertification: React.FC<TrainingCertificationProps> = ({
  index,
  remove,
  register,
  setValue,
  errors,
  onChange,
  clearErrors,
  watch
}) => {
  const handleChange = () => {
    if (onChange) {
      onChange();
    }
  };

  let toYear;
  watch ? (toYear = watch(`trainingCertification.${index}.to`)) : undefined;

  return (
    <div
      className={cn("flex w-full flex-col gap-6", index > 0 && "border-t pt-6")}
    >
      <div className="flex items-center justify-between">
        <Typography variant="p-m" color="text-light">
          CERTIFICATION {index + 1}
        </Typography>
        {index > 0 && (
          <button onClick={() => remove(index)}>
            <TrashFilledIcon />
          </button>
        )}
      </div>
      <div>
        <TextField
          name={`trainingCertification.${index}.name`}
          inputType="input"
          type="text"
          placeholder="Enter name of certification"
          register={register}
          label="Name of Certification"
          flexStyle="row"
          error={!!errors?.name?.message}
          errorText={errors?.name?.message}
          onChange={handleChange}
        />
      </div>
      <div>
        <TextField
          name={`trainingCertification.${index}.institution`}
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
      <div>
        <TextField
          name={`trainingCertification.${index}.location`}
          inputType="input"
          type="text"
          placeholder="Enter location"
          register={register}
          label="Location"
          flexStyle="row"
          error={!!errors?.location?.message}
          errorText={errors?.location?.message}
          onChange={handleChange}
        />
      </div>
      <div>
       <SMSelectDropDown
          name={`trainingCertification.${index}.to`}
          options={options}
          placeholder="Year" 
          label="Year Obtained"
          flexStyle="row"
          onChange={(selectedOption) => {
            handleChange();
            fieldSetterAndClearer({
              value: selectedOption,
              setterFunc: setValue,
              setField: `trainingCertification.${index}.to`,
              clearErrors,
            });
          }}
          searchable={true}
          isError={!!errors?.to?.message}
          errorText={errors?.to?.message}
          value={toYear?.value ? toYear as OptionType : undefined}
        />
      </div>
      <div className="md:grid md:grid-cols-12">
        <div className="col-span-3">
          <Typography variant="h-s" fontWeight="medium" color="N700">
            Upload Certificate
          </Typography>
        </div>
        <div className="col-span-9">
          <FileUploadSingle
            name={`trainingCertification.${index}.certificate`}
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