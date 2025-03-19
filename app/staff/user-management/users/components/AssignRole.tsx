import React from "react";
import {
  Avatar,
  Button,
  EmployeeOptionType,
  EmployeeSMSelectDropDown,
  notify,
  SMSelectDropDown,
  Typography,
} from "@/components";
import { IUserProps, useAddUserToRoleMutation } from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import {
  ISelectItemProps,
  ISelectItemPropsWithValueGeneric,
} from "@/redux/api/interface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { fieldSetterAndClearer } from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { assignRoleSchema } from "./schema";

interface AssignRoleSchemaProps {
  role: ISelectItemProps;
}
interface IAssignRoleProps {
  closeModal: () => void;
  editData?: IUserProps | null;
  allRoles: ISelectItemPropsWithValueGeneric[];
}

export const AssignRole = ({
  closeModal,
  editData,
  allRoles,
}: IAssignRoleProps) => {
  console.log(allRoles);
  const adjustedRoleOptions = allRoles.map((role) => ({
    label: role.label,
    value: role.label,
  }));
  const [addUserToRole, { isLoading }] = useAddUserToRoleMutation();
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
    watch,
    setValue,
    clearErrors,
  } = useForm<AssignRoleSchemaProps>({
    resolver: yupResolver(assignRoleSchema),
    defaultValues: {
      role: { label: String(editData?.role), value: String(editData?.role) },
    },
  });

  const onSubmit = (values: AssignRoleSchemaProps) => {
    addUserToRole({
      userName: String(editData?.email),
      role: values.role.label,
    })
      .unwrap()
      .then(() => {
        notify.success({
          message: `Role Assigned`,
          subtitle: `You have successfully assigned ${values.role.label} role to ${editData?.firstname} ${editData?.lastname}`,
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
        <div className="mb-4 grid grid-cols-1 justify-between gap-2 md:grid-cols-4">
          <Typography
            variant="h-s"
            fontWeight="medium"
            color={"N700"}
            className={`col-span-1 cursor-pointer mmd:my-[unset]`}
          >
            Role
          </Typography>
          <div className="col-span-3 grid grid-cols-1 gap-4">
            <div>
              <SMSelectDropDown
                options={adjustedRoleOptions}
                varient="simple"
                onChange={(selectedOption) => {
                  fieldSetterAndClearer({
                    value: selectedOption,
                    setterFunc: setValue,
                    setField: "role",
                    clearErrors,
                  });
                }}
                value={watch("role")}
                placeholder="Assign role"
                searchable={true}
                isError={!!errors.role}
                errorText={errors.role?.message}
              />
            </div>
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
        <Button variant={"primary"} className="msm:w-full" loading={isLoading}>
          {editData ? "Save" : "Assign Role"}
        </Button>
      </div>
    </form>
  );
};
