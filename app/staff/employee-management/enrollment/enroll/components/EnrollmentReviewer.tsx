import { useContext, useEffect, useRef } from "react";
import { FormStepJumbotron, notify, TextField, Typography } from "@/components";
import { UserContext } from "@/layouts/appLayout";
import { RootState } from "@/redux";
import { useAddEnrollmentReviewerMutation } from "@/redux/api";
import { setEnrollmentReviewer } from "@/redux/api/employee/enrollmentForm.slice";
import { IApiError } from "@/redux/api/genericInterface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { TAB_QUERIES } from "./constants";
import { enrollmentReviewerValidationSchema } from "./schema";

export interface IEnrollmentReviwerFormData {
  reviewerUserId: string;
}

interface ChildFormProps {
  onClick: (steps: string) => void;
}

export const EnrollmentReviewer = ({ onClick }: ChildFormProps) => {
  const { employeeId, enrollmentReviewerFormData } = useSelector(
    (state: RootState) => state.employeeEnrollmentForm,
  );

  const [addOrUpdateEnrollmentReviewer, { isLoading }] =
    useAddEnrollmentReviewerMutation();
  const user = useContext(UserContext);
  const dispatch = useDispatch();
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IEnrollmentReviwerFormData>({
    defaultValues: enrollmentReviewerFormData as IEnrollmentReviwerFormData,
    resolver: yupResolver(enrollmentReviewerValidationSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (user?.user?.userId) {
      setValue("reviewerUserId", user.user.userId);
    }
  }, [user?.user?.userId, setValue]);

  const onSubmit = async (data: IEnrollmentReviwerFormData) => {
    try {
      await addOrUpdateEnrollmentReviewer({
        employeeId: employeeId as string,
        reviewerUserId: data.reviewerUserId,
      }).unwrap();
      dispatch(setEnrollmentReviewer({ reviewerUserId: data.reviewerUserId }));
      onClick(TAB_QUERIES[5]);
      notify.success({
        message: "Enrollment of Assignee updated successfully",
      });
    } catch (error) {
      notify.error({
        message: "Failed to add or update Assignee",
        subtitle: getErrorMessage(error as IApiError),
      });
    }
  };

  return (
    <FormStepJumbotron
      title="Enrollment Reviewer"
      currentStep={5}
      totalSteps={TAB_QUERIES.length}
      onBack={() => onClick(TAB_QUERIES[3])}
      onNext={() => submitButtonRef.current?.click()}
      noPadding
      isLoading={isLoading}
    >
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <Typography variant="p-m" color="text-light">
            The enrollment reviewer is responsible for enrolling a new employee
            assigned to them. They have a complete understanding of the
            onboarding requirements and ensure a smooth enrollment process.
          </Typography>
        </div>
        <hr />
        <fieldset className="mx-5">
          <TextField
            flexStyle="row"
            name="reviewerUserId"
            label="Assignee"
            value={`${user?.user?.firstname} ${user?.user?.lastname}`}
            error={!!errors.reviewerUserId}
            errorText={errors.reviewerUserId?.message}
            disabled
          />
        </fieldset>

        <button type="submit" ref={submitButtonRef} className="sr-only">
          Submit
        </button>
      </form>
    </FormStepJumbotron>
  );
};
