"use client";

import { ConfirmationModal, TextField } from "@/components";
import { BasicInformation } from "@/redux/api";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";

interface RejectFormInputs {
  comment: string;
}

export const RejectForm = ({
  showRejectModal,
  setShowRejectModal,
  rejectAction,
  basicInformation,
  formType,
  isLaoding,
}: {
  showRejectModal: boolean;
  setShowRejectModal: (value: boolean) => void;
  rejectAction: (data: RejectFormInputs) => void;
  basicInformation: BasicInformation;
  formType: string;
  isLaoding: boolean;
}) => {
  const validationSchema = Yup.object().shape({
    comment: Yup.string()
      .required("Comment is required")
      .min(30, "Comment must be at least 30 characters"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RejectFormInputs>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<RejectFormInputs> = (data) => {
    rejectAction(data);
  };

  return (
    <ConfirmationModal
      isOpen={showRejectModal}
      closeModal={() => setShowRejectModal(false)}
      handleClick={handleSubmit(onSubmit)}
      formTitle={`Reject ${formType}`}
      message={
        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="mb-4">
            Are you sure you want to Reject{" "}
            <b>{basicInformation?.fullname}’s</b> <b>{formType}</b>? You can
            explain why you are rejecting it and{" "}
            <b>{basicInformation?.fullname}</b> will be notified via email for
            correction. Please leave comments below.
          </p>
          <TextField
            inputType="textarea"
            name="comment"
            register={register}
            errorText={errors.comment?.message}
            placeholder="Comment"
            error={!!errors.comment}
          />
        </form>
      }
      isLoading={isLaoding}
      type="delete"
      buttonLabel="Yes, Reject"
    />
  );
};
