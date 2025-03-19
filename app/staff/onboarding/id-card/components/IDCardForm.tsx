import React, { useContext, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConfirmationModal,
  DocumentViewer,
  FileUploadSingle,
  FormStepJumbotron,
  notify,
  TextField,
  Typography,
} from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { UserContext } from "@/layouts/appLayout";
import { useUpdateEmployeeIDCardFormMutation } from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import formatImageToBase64 from "@/utils/formatImageToBase64";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { TAB_QUERIES } from "./constants";
import { shema } from "./schema";

export interface IIDCardFormData {
  passport: File;
  signature: File;
}

export const IDCardForm = () => {
  const user = useContext(UserContext);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const [showPreveiw, setShowPreveiw] = useState(false);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<IIDCardFormData | null>(null);
  const [imageDetails, setImageDetails] = useState<{
    name: string;
    img: string;
  } | null>(null);
  const router = useRouter();
  const [updateIDCardForm, { isLoading }] =
    useUpdateEmployeeIDCardFormMutation();
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IIDCardFormData>({
    resolver: yupResolver(shema),
    mode: "onChange",
  });

  const confirmSubmit = () => {
    if (user?.user?.employeeId && data) {
      const formData = new FormData();
      formData.append("employeeId", user.user.employeeId);
      formData.append("signature", data.signature);
      formData.append("passport", data.passport);
      updateIDCardForm(formData)
        .unwrap()
        .then(() => {
          notify.success({
            message: "Your ID Card form has been submitted successfully.",
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

  const handleFile = async () => {
    const file = watch("passport");
    const img = (await formatImageToBase64(watch("passport"))) as string;
    setImageDetails({ img, name: file.name });
  };

  return (
    <FormStepJumbotron
      title="Personal Information"
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
        message={
          <p>Are you sure you want to submit your Identity card form? </p>
        }
        isLoading={isLoading}
        type="confirm"
        buttonLabel="Submit"
      />
      <DocumentViewer
        triggerType="view"
        showModal={showPreveiw}
        handleClose={() => {
          setShowPreveiw(false);
        }}
        name={imageDetails?.name ?? ""}
        link={imageDetails?.img ?? ""}
      />
      <form
        className="flex w-full flex-col gap-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="items-center md:grid md:grid-cols-12">
          <div className="col-span-3">
            <Typography variant="h-s" fontWeight="medium" color={"N700"}>
              Name
            </Typography>
          </div>
          <div className="col-span-9 grid grid-cols-1 gap-2 lg:grid-cols-2">
            <TextField
              name="firstName"
              inputType="input"
              placeholder="First Name"
              value={user?.user?.firstname}
              disabled
            />
            <TextField
              inputType="input"
              placeholder="Last Name"
              name="lastName"
              value={user?.user?.lastname}
              disabled
            />
          </div>
        </div>
        <div>
          <TextField
            inputType="input"
            type="text"
            placeholder="Enter department"
            label="Department"
            flexStyle="row"
            name="employeeId"
            value={user?.user?.department}
            disabled
          />
        </div>
        <div>
          <TextField
            inputType="input"
            type="text"
            placeholder="Enter job title"
            label="Job Title"
            flexStyle="row"
            name="employeeId"
            value={user?.user?.jobTitle}
            disabled
          />
        </div>
        <div className="md:grid md:grid-cols-12">
          <div className="col-span-3">
            <Typography variant="h-s" fontWeight="medium" color="N700">
              Passport Photograph
            </Typography>
            <Typography variant="p-s" fontWeight="regular" color={"N200"}>
              <label htmlFor={"signature"}>
                To avoid rejection kindly preview the sample passport before
                uploading
              </label>
            </Typography>
          </div>
          <div className="col-span-9">
            <FileUploadSingle
              name={`passport`}
              setValue={setValue}
              error={!!errors?.passport}
              errorText={errors?.passport?.message}
              formats={["jpg", "png", "jpeg"]}
            />
            {watch("passport") && (
              <Typography
                variant="p-m"
                color="B400"
                className="mt-2 cursor-pointer"
                onClick={() => {
                  handleFile();
                  setShowPreveiw(true);
                }}
              >
                Preview sample passport
              </Typography>
            )}
          </div>
        </div>
        <div className="md:grid md:grid-cols-12">
          <div className="col-span-3">
            <Typography variant="h-s" fontWeight="medium" color="N700">
              Signature
            </Typography>
          </div>
          <div className="col-span-9">
            <FileUploadSingle
              name={`signature`}
              setValue={setValue}
              error={!!errors?.signature}
              errorText={errors?.signature?.message}
              formats={["jpg", "png", "jpeg"]}
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

IDCardForm.displayName = "IDCardForm";

export default IDCardForm;
