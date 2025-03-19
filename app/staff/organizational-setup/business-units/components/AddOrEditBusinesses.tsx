import React from "react";
import {
  Button,
  notify,
  SMSelectDropDown,
  TextField,
  Typography,
} from "@/components";
import {
  IBusinessUnitProps,
  ICreateBusinessUnitPayload,
  useCreateBusinessUnitMutation,
  useUpdateBusinessUnitMutation,
} from "@/redux/api/businessUnit";
import { IApiError } from "@/redux/api/genericInterface";
import {
  ISelectItemProps,
  ISelectItemPropsWithValueGeneric,
} from "@/redux/api/interface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { fieldSetterAndClearer } from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";

import { schema } from "./schema";

interface IAddOrEditProps {
  closeModal: () => void;
  editData?: IBusinessUnitProps | null;
  allCompanies: ISelectItemPropsWithValueGeneric[];
  allDepartments: ISelectItemPropsWithValueGeneric[];
}

interface IAddOrEditSchemaProps
  extends Omit<ICreateBusinessUnitPayload, "companyId" | "departmentId"> {
  companyId: ISelectItemProps;
  departmentId: ISelectItemProps[];
}

export const AddOrEditBusinesses = ({
  closeModal,
  editData,
  allCompanies,
  allDepartments,
}: IAddOrEditProps) => {
  const [createBusinessUnit, { isLoading }] = useCreateBusinessUnitMutation();
  const [updateBusinessUnit, { isLoading: isUpdating }] =
    useUpdateBusinessUnitMutation();
  const {
    register,
    watch,
    clearErrors,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<IAddOrEditSchemaProps>({
    defaultValues: {
      name: editData?.name,
      description: editData?.description,
      companyId: editData?.companyId
        ? {
            label: editData?.company,
            value: String(editData?.companyId),
          }
        : undefined,
      departmentId:
        editData?.departments?.map((departmnent) => ({
          label: departmnent.name,
          value: departmnent.id,
        })) ?? [],
    },
    resolver: yupResolver(schema),
  });
  const onSubmit: SubmitHandler<IAddOrEditSchemaProps> = (values) => {
    const apiData = {
      name: values.name,
      description: values.description,
      companyId: values.companyId.value,
      departmentId: values.departmentId.map((item) => String(item.value)),
    };
    if (!editData) {
      createBusinessUnit(apiData)
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
      updateBusinessUnit({ id: editData.id, ...apiData })
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
            label="Business Unit Name"
            placeholder="Shared Services"
            flexStyle="row"
            register={register}
            error={!!errors.name}
            errorText={errors.name && errors.name.message}
          />
        </div>
        <div className="mb-10">
          <TextField
            name="description"
            label="Description"
            placeholder="Short Description"
            flexStyle="row"
            register={register}
            error={!!errors.description}
            errorText={errors.description && errors.description.message}
          />
        </div>
        <div className="mb-10 grid grid-cols-1 justify-between gap-2 md:grid-cols-4">
          <Typography
            variant="h-s"
            fontWeight="medium"
            color={"N700"}
            className={`col-span-1 my-auto cursor-pointer mmd:my-[unset]`}
          >
            Company
          </Typography>
          <div className="col-span-3">
            <SMSelectDropDown
              options={allCompanies}
              varient="simple"
              onChange={(selectedOption) => {
                fieldSetterAndClearer({
                  value: selectedOption,
                  setterFunc: setValue,
                  setField: "companyId",
                  clearErrors,
                });
              }}
              value={watch("companyId")}
              placeholder="Genesys"
              searchable={true}
              isError={!!errors.companyId}
              errorText={errors.companyId?.message}
            />
          </div>
        </div>
        <div className="mb-6 grid grid-cols-1 justify-between gap-2 md:grid-cols-4">
          <Typography
            variant="h-s"
            fontWeight="medium"
            color={"N700"}
            className={`col-span-1 my-auto cursor-pointer mmd:my-[unset]`}
          >
            Departments
          </Typography>
          <div className="col-span-3">
            <SMSelectDropDown
              options={allDepartments}
              varient="simple"
              onChange={(selectedOption) => {
                fieldSetterAndClearer({
                  value: selectedOption,
                  setterFunc: setValue,
                  setField: "departmentId",
                  clearErrors,
                });
              }}
              value={watch("departmentId")}
              placeholder="Add departments"
              searchable={true}
              isMulti
              isError={!!errors.departmentId}
              errorText={errors.departmentId?.message}
            />
          </div>
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
          Save
        </Button>
      </div>
    </form>
  );
};
