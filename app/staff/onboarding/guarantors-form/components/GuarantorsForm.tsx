import React, { useContext, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConfirmationModal,
  DocumentViewer,
  FileUploadSingle,
  FormInfoBanner,
  FormStepJumbotron,
  notify,
  RowView,
  Typography,
} from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { UserContext } from "@/layouts/appLayout";
import { useUpdateEmployeeGuarantorsFormMutation } from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { OnboardingEnum } from "@/redux/api/interface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import useGetFormTemplate from "@/utils/useGetFormTemplate";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { TAB_QUERIES } from "./constants";
import { shema } from "./schema";

export interface IIDCardFormData {
  guarantorForm1: File;
  guarantorForm2: File;
}

export const GuarantorsForm = () => {
  const user = useContext(UserContext);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<IIDCardFormData | null>(null);
  const router = useRouter();
  const [updateGuarantorsForm, { isLoading }] =
    useUpdateEmployeeGuarantorsFormMutation();
  const { downloadTemplate, isLoading: isDownloading } = useGetFormTemplate();
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IIDCardFormData>({
    resolver: yupResolver(shema),
    mode: "onChange",
  });

  const confirmSubmit = () => {
    if (user?.user?.employeeId && data) {
      console.log(data);

      const formData = new FormData();
      formData.append("employeeId", user.user.employeeId);
      formData.append("guarantorForms", data.guarantorForm1);
      formData.append("guarantorForms", data.guarantorForm2);
      updateGuarantorsForm(formData)
        .unwrap()
        .then(() => {
          notify.success({
            message: "Your Reference form has been submitted successfully.",
          });
          setOpen(false);
          router.replace(AuthRouteConfig.STAFF_ONBOARDING);
          // dispatch(resetState());
        })
        .catch((err: IApiError) => {
          notify.error({
            message: "Action failed",
            subtitle: getErrorMessage(err),
          });
        });
    }
  };

  const onSubmit = async (data: IIDCardFormData) => {
    setOpen(true);
    setData(data);
  };

  return (
    <FormStepJumbotron
      title="Guarantor’s Form"
      currentStep={1}
      totalSteps={TAB_QUERIES.length}
      onNext={() => submitButtonRef.current?.click()}
      primaryLabel="Submit"
    >
      <ConfirmationModal
        isOpen={open}
        closeModal={() => setOpen(false)}
        handleClick={confirmSubmit}
        formTitle="Confirm Submission"
        message={<p>Are you sure you want to submit your Guarantor’s Form? </p>}
        isLoading={isLoading}
        type="confirm"
        buttonLabel="Submit"
      />
      <form
        className="flex w-full flex-col gap-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <FormInfoBanner
            title="Note:"
            description="You’re to Download Guarantor’s Form, Fill It And Upload the filled copy"
          />
        </div>
        <RowView
          name={"Download Form"}
          value={
            <DocumentViewer
              name="Guarantor's Form.pdf"
              link="https://imgs.search.brave.com/kOdmogNcom0knCa0wLIk5erZ2U88ZfM4vg_bepeht2Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA3LzY5LzE0LzM0/LzM2MF9GXzc2OTE0/MzQxMF9tNndTcEV5/MThyMFk0M0M5ZTRB/WWhIZ2tvbHpwSDJx/My5qcGc"
              customButton={
                <Typography
                  variant="p-m"
                  fontWeight="medium"
                  color="B400"
                  className="cursor-pointer"
                  onClick={() =>
                    downloadTemplate(String(OnboardingEnum.GUARANTORS))
                  }
                >
                  {isDownloading ? "Downloading..." : "Download"}
                </Typography>
              }
            />
          }
        />
        <div className="md:grid md:grid-cols-12">
          <div className="col-span-3">
            <Typography variant="h-s" fontWeight="medium" color="N700">
              Upload Form
            </Typography>
          </div>
          <div className="col-span-9">
            <FileUploadSingle
              name={`guarantorForm1`}
              setValue={setValue}
              error={!!errors?.guarantorForm1}
              errorText={errors?.guarantorForm1?.message}
            />
          </div>
        </div>
        <div className="md:grid md:grid-cols-12">
          <div className="col-span-3">
            <Typography variant="h-s" fontWeight="medium" color="N700">
              Upload Form 2
            </Typography>
          </div>
          <div className="col-span-9">
            <FileUploadSingle
              name={`guarantorForm2`}
              setValue={setValue}
              error={!!errors?.guarantorForm2}
              errorText={errors?.guarantorForm2?.message}
            />
          </div>
        </div>
        {/* Invisible Submit Button */}
        <button type="submit" ref={submitButtonRef} className="sr-only">
          Submit
        </button>
      </form>
    </FormStepJumbotron>
  );
};

GuarantorsForm.displayName = "GuarantorsForm";

export default GuarantorsForm;
