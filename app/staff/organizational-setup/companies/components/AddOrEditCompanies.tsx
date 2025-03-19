import React from "react";
import { Button, notify, TextField } from "@/components";
import {
  ICompanyProps,
  ICreateCompayPayload,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { schema } from "./schema";

interface IAddOrEditProps {
  closeModal: () => void;
  editData?: ICompanyProps | null;
}

export const AddOrEditCompanies = ({
  closeModal,
  editData,
}: IAddOrEditProps) => {
  const [createCompany, { isLoading }] = useCreateCompanyMutation();
  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateCompayPayload>({
    defaultValues: {
      name: editData?.name,
      code: editData?.code,
    },
    resolver: yupResolver(schema),
  });
  const onSubmit = (values: ICreateCompayPayload) => {
    const formattedValues = {
      name: values.name,
      code: values.code.toUpperCase(),
    };
    if (!editData) {
      createCompany(formattedValues)
        .unwrap()
        .then(() => {
          notify.success({
            message: `Added Successfully`,
            subtitle: `You have successfully created ${formattedValues.name}`,
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
      updateCompany({ id: editData.id, ...formattedValues })
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
        <div className="mb-10">
          <TextField
            name="name"
            label="Company Name"
            placeholder="Genesys"
            flexStyle="row"
            register={register}
            error={!!errors.name}
            errorText={errors.name && errors.name.message}
          />
        </div>
        <div className="mb-4">
          <TextField
            name="code"
            label="Company Code"
            placeholder="GEN"
            flexStyle="row"
            register={register}
            error={!!errors.code}
            errorText={errors.code && errors.code.message}
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
          {editData ? "Save" : "Add Company"}
        </Button>
      </div>
    </form>
  );
};
