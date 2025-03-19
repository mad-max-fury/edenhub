import React, { useRef, useState } from "react";
import { Button, FormStepJumbotron, notify, Typography } from "@/components";
import { RootState } from "@/redux";
import { ITrainingCertificationProps, useUpdateEmployeeTrainingCertificationMutation } from "@/redux/api";
import { setTrainingCertification } from "@/redux/api/employee/bioDataForm.slice";
import { IApiError } from "@/redux/api/genericInterface";
import formatImageToBase64 from "@/utils/formatImageToBase64";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { TAB_QUERIES } from "./constants";
import { trainingCertificationsSchema } from "./schema";
import { TrainingCertification } from "./TrainingCertification";


export interface ITrainingCertificationFormData {
  trainingCertification?: ITrainingCertificationProps[];
}

export interface ModifiedTrainingCertificationFormData {
  trainingCertification?: (Omit<ITrainingCertificationProps, "to"> & {
    to: { label?: string | undefined; value?: number | undefined };
  })[];
}

interface ChildFormProps {
  onClick: (step: string) => void;
}

export const TrainingCertificationForm = ({ onClick }: ChildFormProps) => {
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const { trainingCertification, employeeId } = useSelector(
    (state: RootState) => state.bioDataForm,
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [updateTrainingCertification, { isLoading }] =
    useUpdateEmployeeTrainingCertificationMutation();
  const dispatch = useDispatch();
  const defaultValues = {
    name: "",
    institution: "",
    location: "",
    to: { label: "", value: undefined },
    certificate: undefined,
  };

  const transformedTrainingCertificationQualification = 
    trainingCertification?.trainingCertification?.map((item) => {
      return {
        ...item,
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
    formState: { errors },
    clearErrors,
    watch
  } = useForm<ModifiedTrainingCertificationFormData>({
    defaultValues: {
      trainingCertification: transformedTrainingCertificationQualification
    },
    resolver: yupResolver(trainingCertificationsSchema),
    mode: "onChange",
    context: { hasChanges },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "trainingCertification",
  });

  const onSubmit = async (data: ModifiedTrainingCertificationFormData) => {
    if (employeeId) {
      const trainingCertification = [];

      for await (const item of data.trainingCertification || []) {
        const certificate = (await formatImageToBase64(
          item.certificate as File,
        )) as string;

        trainingCertification.push({
          ...item,
          employeeId,
          certificate,
          to: item?.to.label || ""
        });
      }

      const apiData = {
        employeeId,
        workHistory: trainingCertification
      };

      updateTrainingCertification(apiData)
        .unwrap()
        .then(() => {
          dispatch(setTrainingCertification({
            trainingCertification: data.trainingCertification as ITrainingCertificationProps[],
          }));
          onClick(TAB_QUERIES[8]);
          notify.success({
            message: "Training certification info updated successfully",
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

  const handleAddTrainingCertification = () => {
    setHasChanges(true);
    append(defaultValues);
  };

  const handleRemoveTrainingCertification = (index: number) => {
    remove(index);
    if (fields.length <= 1) {
      setHasChanges(false);
    }
  };

  const handleFieldChange = () => {
    setHasChanges(true);
  };

  const handleSkip = () => {
    dispatch(setTrainingCertification({ trainingCertification: [] }));
    onClick(TAB_QUERIES[8]);
  };

  return (
    <FormStepJumbotron
      title="Training/Certification Obtained"
      currentStep={8}
      totalSteps={TAB_QUERIES.length}
      onBack={() => onClick(TAB_QUERIES[6])}
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
          <TrainingCertification
            key={field.id}
            index={index}
            remove={() => {
              handleRemoveTrainingCertification(index);
            }}
            register={register}
            setValue={setValue}
            errors={errors.trainingCertification?.[index]}
            onChange={handleFieldChange}
            clearErrors={clearErrors}
            watch={watch}
          />
        ))}
        <div className="flex justify-end">
          <Typography
            variant="p-m"
            color="B400"
            className="cursor-pointer"
            onClick={handleAddTrainingCertification}
          >
            Add Certification
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

TrainingCertificationForm.displayName = "TrainingCertificationForm";