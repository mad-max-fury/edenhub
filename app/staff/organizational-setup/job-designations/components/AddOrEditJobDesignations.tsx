import React from "react";
import { Button, notify, TextField } from "@/components";
import {
  ICreateJobDesignationPayload,
  IJobDesignationProps,
  useCreateJobDesignationMutation,
  useUpdateJobDesignationMutation,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { schema } from "./schema";

interface IAddOrEditProps {
  closeModal: () => void;
  editData?: IJobDesignationProps | null;
}

export const AddOrEditJobDesignations = ({
  closeModal,
  editData,
}: IAddOrEditProps) => {
  const [createDJobDesignation, { isLoading }] =
    useCreateJobDesignationMutation();
  const [updateJobDesignation, { isLoading: isUpdating }] =
    useUpdateJobDesignationMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateJobDesignationPayload>({
    defaultValues: {
      name: editData?.name,
      leaveDays: editData?.leaveDays,
    },
    resolver: yupResolver(schema),
  });
  const onSubmit = (values: ICreateJobDesignationPayload) => {
    if (!editData) {
      createDJobDesignation(values)
        .unwrap()
        .then(() => {
          notify.success({
            message: `Added Successfully`,
            subtitle: `You have successfully created ${values.name}`,
          });
          closeModal();
        })
        .catch((err: IApiError) => {
          notify.error({
            message: "Action failed",
            subtitle: getErrorMessage(err),
          });
        });
    } else {
      updateJobDesignation({ id: editData.id, ...values })
        .unwrap()
        .then(() => {
          notify.success({
            message: `Edited Successfully`,
            subtitle: `You have successfully edited ${values.name}`,
          });
          closeModal();
        })
        .catch((err: IApiError) => {
          notify.error({
            message: "Action failed",
            subtitle: getErrorMessage(err),
          });
        });
    }
  };
  return (
    <form
      className="flex h-full flex-col justify-between"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="p-6">
        <div className="mb-6">
          <TextField
            name="name"
            label="Job Designation"
            placeholder="Analyst 3"
            flexStyle="row"
            register={register}
            error={!!errors.name}
            errorText={errors.name && errors.name.message}
          />
        </div>
        <div className="mb-6">
          <TextField
            name="leaveDays"
            label="Leave days"
            placeholder="10"
            flexStyle="row"
            register={register}
            error={!!errors.leaveDays}
            errorText={errors.leaveDays && errors.leaveDays.message}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t border-solid border-N40 bg-N0 px-6 py-4">
        <Button
          variant={"secondary"}
          type="button"
          className="msm:w-full"
          onClick={closeModal}
        >
          Cancel
        </Button>
        <Button
          variant={"primary"}
          className="msm:w-full"
          loading={isLoading || isUpdating}
        >
          {editData ? "Save" : "Add Job Designation"}
        </Button>
      </div>
    </form>
  );
};
