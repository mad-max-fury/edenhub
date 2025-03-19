import React from "react";
import { useRouter } from "next/navigation";
import { Button, notify, TextField } from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import {
  IGetEmployeeLeaveItem,
  useApproveOrRejectLeaveApplictionMutation,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { schema } from "./schema";

interface IAddOrEditProps {
  closeModal: () => void;
  editData?: IGetEmployeeLeaveItem | null;
}
interface IRejectProps {
  reason: string;
}
export const RejectLeaveApplication = ({
  closeModal,
  editData,
}: IAddOrEditProps) => {
  const [approveOrReject, { isLoading: isUpdating }] =
    useApproveOrRejectLeaveApplictionMutation();
  const history = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRejectProps>({
    resolver: yupResolver(schema),
  });
  const onSubmit = (values: IRejectProps) => {
    approveOrReject({
      leaveId: editData?.leaveId ?? "",
      status: false,
      reason: values.reason,
    })
      .unwrap()
      .then(() => {
        notify.success({
          message: `Rejected Successfully`,
          subtitle: `You have successfully rejected ${editData?.employeeName}'s leave!`,
        });
        closeModal();
        history.push(AuthRouteConfig.STAFF_LEAVE_MY_DIRECT_REPORT);
      })
      .catch((err: IApiError) => {
        notify.error({
          message: "Rejection failed",
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
        <div className="mb-4">
          <TextField
            name="reason"
            label="Provide a reason for rejecting this leave request"
            inputType="textarea"
            placeholder="Enter reason"
            flexStyle="row"
            register={register}
            error={!!errors.reason}
            errorText={errors.reason && errors.reason.message}
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
        <Button variant={"primary"} className="msm:w-full" loading={isUpdating}>
          Reject
        </Button>
      </div>
    </form>
  );
};
