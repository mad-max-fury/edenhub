import React from "react";
import {
  Button,
  notify,
  OptionType,
  RadioButton,
  SMSelectDropDown,
  TextField,
  Typography,
  ValidationText,
} from "@/components";
import { IApiError } from "@/redux/api/genericInterface";
import {
  ICreateLeavePayload,
  ILeaveProps,
  useCreateLeaveTypeMutation,
  useUpdateLeaveTypeMutation,
} from "@/redux/api/leave";
import { ISelectResponse } from "@/redux/api/select";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { fieldSetterAndClearer, formatSelectItems } from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { schema } from "./schema";

interface IAddOrEditProps {
  closeModal: () => void;
  editData?: ILeaveProps | null;
  leaveDaysOptions: ISelectResponse[];
  leaveTypesId: ISelectResponse[];
}

export const AddOrEditLeaveType = ({
  closeModal,
  editData,
  leaveDaysOptions,
  leaveTypesId
}: IAddOrEditProps) => {
  const [createLeaveType, { isLoading }] = useCreateLeaveTypeMutation();
  const [updateLeaveType, { isLoading: isUpdating }] =
    useUpdateLeaveTypeMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    clearErrors,
    setValue,
  } = useForm<
    Omit<ICreateLeavePayload, "requiredDocument" | "document"> & {
      requiredDocument: string;
      document?: string;
    }
  >({
    defaultValues: {
      name: editData?.name || "",
      numberOfDays: editData?.numberOfDays || 0,
      requiredDocument: editData?.requiredDocument ? "Yes" : "No",
      document: editData?.document ?? undefined,
      leaveDaysOptionId: {
        label: editData?.leaveDaysOption as string,
        value: String(editData?.leaveDaysOptionId as number),
      },
      leaveTypeId: String(editData?.leaveTypeId as number),
    },
    resolver: yupResolver(schema),
  });

  const allLeaveTypes = formatSelectItems<ISelectResponse>(
    leaveTypesId,
    "name",
    "id",
  );
  const allLeaveDaysOptions = formatSelectItems<ISelectResponse>(
    leaveDaysOptions,
    "name",
    "id",
  );

  const onSubmit = (
    values: Omit<ICreateLeavePayload, "requiredDocument" | "document"> & {
      requiredDocument: string;
      document?: string;
    },
  ) => {
    const formattedValues: Omit<ICreateLeavePayload, "leaveDaysOptionId"> & {
      leaveDaysOptionId: string;
      leaveTypeId: string;
    } = {
      name: values.name,
      numberOfDays: values.numberOfDays,
      requiredDocument: values.requiredDocument === "Yes",
      document:
        values.requiredDocument === "Yes" ? (values?.document as string) : null,
      leaveDaysOptionId: values.leaveDaysOptionId.value,
      leaveTypeId: values.leaveTypeId,
    };
    if (!editData) {
      createLeaveType(formattedValues)
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
      updateLeaveType({ id: editData.leaveId, ...formattedValues })
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
            label="Name"
            placeholder="Sick Leave"
            flexStyle="row"
            register={register}
            error={!!errors.name}
            errorText={errors.name && errors.name.message}
          />
        </div>

        <div className="mb-4 md:grid md:grid-cols-12">
          <div className="col-span-3">
            <Typography variant="h-s" fontWeight="medium" color="N700">
              Leave type <sup>*</sup>
            </Typography>
          </div>
          <div className="col-span-9 grid max-w-[512px] flex-1 grid-cols-1 gap-2">
            {allLeaveTypes.map((item) => (
              <RadioButton
                key={item.value}
                name={`leaveTypeId`}
                value={item.value as string}
                label={item.label}
                control={control}
              />
            ))}
            {errors.leaveTypeId && (
              <ValidationText
                status="error"
                message={errors?.leaveTypeId?.message ?? ""}
              />
            )}
          </div>
        </div>
        <div className="mb-4">
          <TextField
            name="numberOfDays"
            label="No of Days"
            placeholder="0"
            flexStyle="row"
            register={register}
            error={!!errors.numberOfDays}
            errorText={errors.numberOfDays && errors.numberOfDays.message}
          />
        </div>
        <div className="mb-4">
          <SMSelectDropDown
            label="Public Holidays & Weekends"
            options={allLeaveDaysOptions}
            varient="simple"
            isMulti={false}
            onChange={(selectedOption) => {
              fieldSetterAndClearer({
                value: selectedOption,
                setterFunc: setValue,
                setField: `leaveDaysOptionId`,
                clearErrors,
              });
            }}
            value={watch(`leaveDaysOptionId`) as OptionType}
            flexStyle="row"
            placeholder="Select leave day"
            searchable={true}
            isError={!!errors?.leaveDaysOptionId?.message}
            errorText={errors?.leaveDaysOptionId?.message}
          />
        </div>
        <div className="md:grid md:grid-cols-12">
          <div className="col-span-3">
            <Typography variant="h-s" fontWeight="medium" color="N700">
              Document <br />
              requirement
            </Typography>
          </div>
          <div className="col-span-9 grid max-w-[512px] flex-1 grid-cols-1 gap-2">
            <RadioButton
              name={`requiredDocument`}
              value={"Yes"}
              label={"Yes"}
              control={control}
            />
            <RadioButton
              name={`requiredDocument`}
              value={"No"}
              label={"No"}
              control={control}
            />
            {errors.requiredDocument && (
              <ValidationText
                status="error"
                message={errors?.requiredDocument?.message ?? ""}
              />
            )}
          </div>
        </div>
        {watch("requiredDocument") === "Yes" && (
          <div className="my-4">
            <TextField
              name="document"
              label="Document name"
              placeholder="Medical Certificate"
              flexStyle="row"
              register={register}
              error={!!errors.document}
              errorText={errors.document && errors.document.message}
            />
          </div>
        )}
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
          {editData ? "Save" : "Add Leave"}
        </Button>
      </div>
    </form>
  );
};
