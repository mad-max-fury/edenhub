import React from "react";
import {
  Avatar,
  Button,
  EmployeeOptionType,
  EmployeeSMSelectDropDown,
  notify,
  TextField,
  Typography,
} from "@/components";
import { IUserProps, useUpdateStaffIDMutation } from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { addStaffIDSchema } from "./schema";

interface AssignStaffIDSchemaProps {
  newStaffId: string;
  oldUserId: string;
}
interface IAssignStaffIDProps {
  closeModal: () => void;
  editData?: IUserProps | null;
}

export const AssignStaffID = ({
  closeModal,
  editData,
}: IAssignStaffIDProps) => {
  const [updateStaffId, { isLoading }] = useUpdateStaffIDMutation();
  const employeeOptions: EmployeeOptionType[] = [
    {
      label: `${editData?.firstname} ${editData?.lastname}`,
      value: editData?.email as string,
      icon: (
        <Avatar
          size="sm"
          fullname={`${editData?.firstname} ${editData?.lastname}`}
          src={editData?.profilePicture}
        />
      ),
      department: editData?.department,
    },
  ];

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<AssignStaffIDSchemaProps>({
    resolver: yupResolver(addStaffIDSchema),
    defaultValues: {
      oldUserId: editData?.staffId,
    },
  });

  const onSubmit = (values: AssignStaffIDSchemaProps) => {
    updateStaffId({
      userId: String(editData?.userId),
      newStaffId: values.newStaffId.toUpperCase(),
    })
      .unwrap()
      .then(() => {
        notify.success({
          message: `ID Number Updated`,
          subtitle: `You have successfully assigned ID Number ${values.newStaffId.toUpperCase()} to ${editData?.firstname} ${editData?.lastname}`,
        });
        closeModal();
      })
      .catch((err: IApiError) => {
        notify.error({
          message: "Action failed",
          subtitle: getErrorMessage(err),
        });
      });
  };

  return (
    <form
      className="flex h-full flex-col justify-between"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="p-6">
        <div className="mb-4 grid grid-cols-1 justify-between gap-2 md:grid-cols-4">
          <Typography
            variant="h-s"
            fontWeight="medium"
            color={"N700"}
            className={`col-span-1 my-auto cursor-pointer mmd:my-[unset]`}
          >
            Employee
          </Typography>
          <div className="col-span-3">
            <EmployeeSMSelectDropDown
              options={employeeOptions}
              defaultValue={employeeOptions[0]}
              varient="custom"
              disabled
              placeholder="Select an option"
              isMulti={false}
              searchable={true}
            />
          </div>
        </div>
        <div className="mb-4">
          <TextField
            name="oldUserId"
            label="Former Staff ID"
            placeholder="Staff ID"
            flexStyle="row"
            register={register}
            error={!!errors.oldUserId}
            errorText={errors.oldUserId && errors.oldUserId.message}
            disabled
          />
        </div>
        <div className="mb-4">
          <TextField
            name="newStaffId"
            label="New Staff ID"
            placeholder="Staff ID"
            flexStyle="row"
            register={register}
            error={!!errors.newStaffId}
            errorText={errors.newStaffId && errors.newStaffId.message}
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
        <Button variant={"primary"} className="msm:w-full" loading={isLoading}>
          {"Assign"}
        </Button>
      </div>
    </form>
  );
};
