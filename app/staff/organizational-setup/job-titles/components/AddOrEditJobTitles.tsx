import React from "react";
import { Button, notify, TextField } from "@/components";
import {
  ICreateJobTitlePayload,
  IJobTitleProps,
  useCreateJobTitleMutation,
  useUpdateJobTitleMutation,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { schema } from "./schema";

interface IAddOrEditProps {
  closeModal: () => void;
  editData?: IJobTitleProps | null;
}

export const AddOrEditJobTitle = ({
  closeModal,
  editData,
}: IAddOrEditProps) => {
  const [createDJobTitle, { isLoading }] = useCreateJobTitleMutation();
  const [updateJobTitle, { isLoading: isUpdating }] =
    useUpdateJobTitleMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateJobTitlePayload>({
    defaultValues: {
      name: editData?.name,
    },
    resolver: yupResolver(schema),
  });
  const onSubmit = (values: ICreateJobTitlePayload) => {
    if (!editData) {
      createDJobTitle(values)
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
      updateJobTitle({ id: editData.id, ...values })
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
            label="Job Title"
            placeholder="Software Developer"
            flexStyle="row"
            register={register}
            error={!!errors.name}
            errorText={errors.name && errors.name.message}
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
          {editData ? "Save" : "Add Job Title"}
        </Button>
      </div>
    </form>
  );
};
