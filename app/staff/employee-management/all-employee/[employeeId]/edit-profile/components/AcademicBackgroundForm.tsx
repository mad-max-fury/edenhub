import React, { useRef, useState } from "react";
import { Button, FormStepJumbotron, notify, Typography } from "@/components";
import { RootState } from "@/redux";
import { IAcademicBackgroundProps, useUpdateEmployeeAcademicBackgroundMutation } from "@/redux/api";
import { setAcademicBackground } from "@/redux/api/employee/bioDataForm.slice";
import { IApiError } from "@/redux/api/genericInterface";
import { ISelectItemProps, ISelectItemPropsWithValueGeneric } from "@/redux/api/interface";
import formatImageToBase64 from "@/utils/formatImageToBase64";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AcademicBackground } from "./AcademicBackground";
import { TAB_QUERIES } from "./constants";
import { academicBackgroundsSchema } from "./schema";

export interface IAcademicBackgroundFormData {
  academicBackground?: IAcademicBackgroundProps[];
}

export interface ModifiedAcademicBackgroundFormData {
  academicBackground?: (Omit<IAcademicBackgroundProps, "from" | "to"> & {
    from: { label?: string | undefined; value?: number | undefined };
    to: { label?: string | undefined; value?: number | undefined };
  })[];
}

interface ChildFormProps {
  onClick: (step: string) => void;
  allQualifications: ISelectItemPropsWithValueGeneric[];
}

export const AcademicBackgroundForm = ({
  onClick,
  allQualifications,
}: ChildFormProps) => {
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const { academicBackground, employeeId } = useSelector(
    (state: RootState) => state.bioDataForm,
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [checked, setChecked] = useState(false);
  const [updateAcademicBackground, { isLoading }] =
    useUpdateEmployeeAcademicBackgroundMutation();
  const dispatch = useDispatch();
  const defaultValues = {
    school: "",
    major: "",
    qualificationId: allQualifications[0] as ISelectItemProps,
    from: { label: "", value: undefined },
    to: { label: "", value: undefined },
    certificate: undefined,
  };
  // const defaultValueFromState = academicBackground?.academicBackground.map(
  //   (item, index) => {
  //     // let certificateFile: File | undefined = undefined;

  //     // if (item.certificate) {
  //     //   try {
  //     //     certificateFile = base64ToFile(
  //     //       item.certificate as string,
  //     //       `Academic Certificate ${index}`,
  //     //     );
  //     //   } catch (error) {
  //     //     console.error(`Failed to convert certificate ${index}:`, error);
  //     //   }
  //     // }

  //     return {
  //       ...item,
  //       certificate: undefined,
  //     };
  //   },
  // );

  // const transformedAcademicBackground = academicBackground?.academicBackground?.map(
  //   (item) => ({
  //     console.log(item),
  //     ...item,
  //     certificate: null,
  //     from: item.from
  //       ? { label: item.from, value: +item.from }
  //       : { label: "", value: undefined },
  //     to: item.to
  //       ? { label: item.to, value: +item.to }
  //       : { label: "", value: undefined },
  //   }),
  // ) || [defaultValues];

  const transformedAcademicBackground =
  academicBackground?.academicBackground?.map((item) => {
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
    register,
    handleSubmit,
    control,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<ModifiedAcademicBackgroundFormData>({
    defaultValues: {
      academicBackground: transformedAcademicBackground,
    },
    resolver: yupResolver(academicBackgroundsSchema),
    mode: "onChange",
    context: { hasChanges, checked },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "academicBackground",
  });
  const onSubmit = async (data: ModifiedAcademicBackgroundFormData) => {
    if (employeeId) {
      const academicBackground = [];

      for await (const item of data?.academicBackground ?? []) {
        const certificate = (await formatImageToBase64(
          item.certificate as File,
        )) as string;

        academicBackground.push({
          ...item,
          employeeId,
          qualificationId: item.qualificationId.value as string,
          certificate,
          from: item?.from.label || "",
          to: item?.to.label || "",
        });
      }

      const apiData = {
        employeeId,
        academicBackground,
      };
      updateAcademicBackground(apiData)
        .unwrap()
        .then(async () => {
          const academicBackground = [];

          for await (const item of data.academicBackground ?? []) {
            const certificate = (await formatImageToBase64(
              item.certificate as File,
            )) as string;

            academicBackground.push({
              ...item,
              certificate,
            });
          }
          dispatch(
            setAcademicBackground({ 
              academicBackground: 
                data.academicBackground as IAcademicBackgroundProps[],
              }),
          );
          onClick(TAB_QUERIES[6]);
          notify.success({
            message: "Academic background updated successfully",
          });
        })
        .catch((err: IApiError) => {
          notify.error({
            message: "Action failed",
            subtitle: getErrorMessage(err),
          });
        });

      // console.log("API DATA: ", apiData);
    }
  };

  const handleAddAcademicBackground = () => {
    setHasChanges(true);
    append(defaultValues);
  };

  const handleRemoveAcademicBackground = (index: number) => {
    remove(index);
    if (fields.length <= 1) {
      setHasChanges(false);
    }
  };

  const handleFieldChange = () => {
    setHasChanges(true);
  };

  const handleSkip = () => {
    dispatch(setAcademicBackground({ academicBackground: [] }));
    onClick(TAB_QUERIES[6]);
  };

  return (
    <FormStepJumbotron
      title="Academic Background"
      currentStep={6}
      totalSteps={TAB_QUERIES.length-2}
      onBack={() => onClick(TAB_QUERIES[4])}
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
          <AcademicBackground
            key={field.id}
            control={control}
            index={index}
            remove={() => {
              handleRemoveAcademicBackground(index);
            }}
            register={register}
            watch={watch}
            setValue={setValue}
            clearErrors={clearErrors}
            allQualifications={allQualifications}
            errors={errors.academicBackground?.[index]}
            onChange={handleFieldChange}
            checked={checked}
            setChecked={setChecked}
          />
        ))}
        <div className="flex justify-end">
          <Typography
            variant="p-m"
            color="B400"
            className="cursor-pointer"
            onClick={handleAddAcademicBackground}
          >
            Add School
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

AcademicBackgroundForm.displayName = "AcademicBackgroundForm";