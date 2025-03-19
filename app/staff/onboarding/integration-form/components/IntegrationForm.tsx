import React, { useContext, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConfirmationModal,
  FormStepJumbotron,
  notify,
  RadioButton,
  TextField,
  Typography,
  ValidationText,
} from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { UserContext } from "@/layouts/appLayout";
import {
  IIntegrationFormData,
  useUpdateEmployeeIntegrationFormMutation,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { TAB_QUERIES } from "./constants";
import { shema } from "./schema";

const allOptions = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

export const IntegrationForm = () => {
  const user = useContext(UserContext);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<IIntegrationFormData | null>(null);
  const [name, setName] = useState("");
  const router = useRouter();
  const [updateIntegrationForm, { isLoading }] =
    useUpdateEmployeeIntegrationFormMutation();
  const {
    handleSubmit,
    setValue,
    control,
    register,
    watch,
    formState: { errors },
  } = useForm<IIntegrationFormData>({
    resolver: yupResolver(shema),
    mode: "onChange",
  });
  const formatSelection = (data: string) => {
    if (data === "true") {
      return true;
    } else {
      return false;
    }
  };
  const confirmSubmit = () => {
    if (user?.user?.employeeId && data) {
      const apiData = {
        employeeId: user?.user?.employeeId,
        introducedToEveryone: formatSelection(data.introducedToEveryone),
        dateIntroducedToEveryone: data.dateIntroducedToEveryone,
        givenEmplyeeDataForm: formatSelection(data.givenEmplyeeDataForm),
        dateGivenEmplyeeDataForm: data.dateGivenEmplyeeDataForm,
        givenHmoRefereeAndGuarantorForm: formatSelection(
          data.givenHmoRefereeAndGuarantorForm,
        ),
        dateGivenHmoRefereeAndGuarantorForm:
          data.dateGivenHmoRefereeAndGuarantorForm,
        laptop: formatSelection(data.laptop),
        laptopDate: data.laptopDate,
        officeSpace: formatSelection(data.officeSpace),
        officeSpaceDate: data.officeSpaceDate,
        orientation: formatSelection(data.orientation),
        orientationDate: data.orientationDate,
        orientationImpact: formatSelection(data.orientationImpact),
        ...(data.impact && { impact: data.impact }),
        employeeHandBook: formatSelection(data.employeeHandBook),
        employeeHandBookDate: data.employeeHandBookDate,
      };
      updateIntegrationForm(apiData)
        .unwrap()
        .then(() => {
          notify.success({
            message: "Your Integration form has been submitted successfully.",
          });
          setOpen(false);
          router.replace(AuthRouteConfig.STAFF_ONBOARDING);
        })
        .catch((err: IApiError) => {
          notify.error({
            message: "Action failed",
            subtitle: getErrorMessage(err),
          });
        });
    }
  };

  const onSubmit = async (data: IIntegrationFormData) => {
    setOpen(true);
    setData(data);
  };

  const watchImpact = watch("orientationImpact");

  return (
    <FormStepJumbotron
      title="Integration Form"
      currentStep={1}
      totalSteps={TAB_QUERIES.length}
      onNext={() => submitButtonRef.current?.click()}
      primaryLabel="Submit"
      disabled={!(name?.toLowerCase() === user?.user?.firstname?.toLowerCase())}
    >
      <ConfirmationModal
        isOpen={open}
        closeModal={() => setOpen(false)}
        handleClick={confirmSubmit}
        formTitle="Confirm Submission"
        message={<p>Are you sure you want to submit your Integration Form?</p>}
        isLoading={isLoading}
        type="confirm"
        buttonLabel="Submit"
      />
      <form
        className="flex w-full flex-col gap-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="gap-6 border-b border-N40 py-10 md:grid md:grid-cols-12">
          <div className="sm-mb-0 col-span-3 mb-4">
            <Typography variant="h-s" fontWeight="medium" color={"N700"}>
              Were you introduced to everyone when you joined?
            </Typography>
          </div>
          <div className="sm-mb-0 col-span-5 mb-4 grid max-w-[512px] flex-1 grid-cols-1 gap-2">
            <div>
              {allOptions.map((option, index) => (
                <RadioButton<IIntegrationFormData>
                  name="introducedToEveryone"
                  value={String(option.value)}
                  label={option.label}
                  key={index}
                  control={control}
                />
              ))}
              {errors.introducedToEveryone?.message && (
                <ValidationText
                  status="error"
                  message={errors.introducedToEveryone?.message}
                />
              )}
            </div>
          </div>
          <div className="col-span-4 grid max-w-[512px] flex-1 grid-cols-1 justify-end">
            <div>
              <TextField
                inputType="input"
                type="date"
                placeholder="Enter dob"
                name="dateIntroducedToEveryone"
                label="Date"
                flexStyle="row"
                error={!!errors.dateIntroducedToEveryone}
                errorText={errors.dateIntroducedToEveryone?.message}
                register={register}
              />
            </div>
          </div>
        </div>
        <div className="gap-6 border-b border-N40 pb-6 md:grid md:grid-cols-12">
          <div className="sm-mb-0 col-span-3 mb-4">
            <Typography variant="h-s" fontWeight="medium" color={"N700"}>
              Were you given an employee data form to fill?
            </Typography>
          </div>
          <div className="sm-mb-0 col-span-5 mb-4 grid max-w-[512px] flex-1 grid-cols-1 gap-2">
            <div>
              {allOptions.map((option, index) => (
                <RadioButton
                  name="givenEmplyeeDataForm"
                  value={String(option.value)}
                  label={option.label}
                  key={index}
                  control={control}
                />
              ))}
              {errors.givenEmplyeeDataForm?.message && (
                <ValidationText
                  status="error"
                  message={errors.givenEmplyeeDataForm?.message}
                />
              )}
            </div>
          </div>
          <div className="col-span-4 grid max-w-[512px] flex-1 grid-cols-1 justify-end">
            <div>
              <TextField
                inputType="input"
                type="date"
                placeholder="Enter dob"
                name="dateGivenEmplyeeDataForm"
                label="Date"
                flexStyle="row"
                error={!!errors.dateGivenEmplyeeDataForm}
                errorText={errors.dateGivenEmplyeeDataForm?.message}
                register={register}
              />
            </div>
          </div>
        </div>
        <div className="gap-6 border-b border-N40 pb-6 md:grid md:grid-cols-12">
          <div className="sm-mb-0 col-span-3 mb-4">
            <Typography variant="h-s" fontWeight="medium" color={"N700"}>
              Were you given HMO, Referee and Guarantor’s forms
            </Typography>
          </div>
          <div className="sm-mb-0 col-span-5 mb-4 grid max-w-[512px] flex-1 grid-cols-1 gap-2">
            <div>
              {allOptions.map((option, index) => (
                <RadioButton
                  name="givenHmoRefereeAndGuarantorForm"
                  value={String(option.value)}
                  label={option.label}
                  key={index}
                  control={control}
                />
              ))}
              {errors.givenHmoRefereeAndGuarantorForm?.message && (
                <ValidationText
                  status="error"
                  message={errors.givenHmoRefereeAndGuarantorForm?.message}
                />
              )}
            </div>
          </div>
          <div className="col-span-4 grid max-w-[512px] flex-1 grid-cols-1 justify-end">
            <div>
              <TextField
                inputType="input"
                type="date"
                placeholder="Enter dob"
                name="dateGivenHmoRefereeAndGuarantorForm"
                label="Date"
                flexStyle="row"
                error={!!errors.dateGivenHmoRefereeAndGuarantorForm}
                errorText={errors.dateGivenHmoRefereeAndGuarantorForm?.message}
                register={register}
              />
            </div>
          </div>
        </div>
        <div className="gap-6 border-b border-N40 pb-6 md:grid md:grid-cols-12">
          <div className="sm-mb-0 col-span-3 mb-4">
            <Typography variant="h-s" fontWeight="medium" color={"N700"}>
              Laptop
            </Typography>
          </div>
          <div className="sm-mb-0 col-span-5 mb-4 grid max-w-[512px] flex-1 grid-cols-1 gap-2">
            <div>
              {allOptions.map((option, index) => (
                <RadioButton
                  name="laptop"
                  value={String(option.value)}
                  label={option.label}
                  key={index}
                  control={control}
                />
              ))}
              {errors.laptop?.message && (
                <ValidationText
                  status="error"
                  message={errors.laptop?.message}
                />
              )}
            </div>
          </div>
          <div className="col-span-4 grid max-w-[512px] flex-1 grid-cols-1 justify-end">
            <div>
              <TextField
                inputType="input"
                type="date"
                placeholder="Enter dob"
                name="laptopDate"
                label="Date"
                flexStyle="row"
                error={!!errors.laptopDate}
                errorText={errors.laptopDate?.message}
                register={register}
              />
            </div>
          </div>
        </div>
        <div className="gap-6 border-b border-N40 pb-6 md:grid md:grid-cols-12">
          <div className="sm-mb-0 col-span-3 mb-4">
            <Typography variant="h-s" fontWeight="medium" color={"N700"}>
              Office Space
            </Typography>
          </div>
          <div className="sm-mb-0 col-span-5 mb-4 grid max-w-[512px] flex-1 grid-cols-1 gap-2">
            <div>
              {allOptions.map((option, index) => (
                <RadioButton
                  name="officeSpace"
                  value={String(option.value)}
                  label={option.label}
                  key={index}
                  control={control}
                />
              ))}
              {errors.officeSpace?.message && (
                <ValidationText
                  status="error"
                  message={errors.officeSpace?.message}
                />
              )}
            </div>
          </div>
          <div className="col-span-4 grid max-w-[512px] flex-1 grid-cols-1 justify-end">
            <div>
              <TextField
                inputType="input"
                type="date"
                placeholder="Enter dob"
                name="officeSpaceDate"
                label="Date"
                flexStyle="row"
                error={!!errors.officeSpaceDate}
                errorText={errors.officeSpaceDate?.message}
                register={register}
              />
            </div>
          </div>
        </div>
        <div className="gap-6 border-b border-N40 pb-6 md:grid md:grid-cols-12">
          <div className="sm-mb-0 col-span-3 mb-4">
            <Typography variant="h-s" fontWeight="medium" color={"N700"}>
              Orientation
            </Typography>
          </div>
          <div className="sm-mb-0 col-span-5 mb-4 grid max-w-[512px] flex-1 grid-cols-1 gap-2">
            <div>
              {allOptions.map((option, index) => (
                <RadioButton
                  name="orientation"
                  value={String(option.value)}
                  label={option.label}
                  key={index}
                  control={control}
                />
              ))}
              {errors.orientation?.message && (
                <ValidationText
                  status="error"
                  message={errors.orientation?.message}
                />
              )}
            </div>
          </div>
          <div className="col-span-4 grid max-w-[512px] flex-1 grid-cols-1 justify-end">
            <div>
              <TextField
                inputType="input"
                type="date"
                placeholder="Enter dob"
                name="orientationDate"
                label="Date"
                flexStyle="row"
                error={!!errors.orientationDate}
                errorText={errors.orientationDate?.message}
                register={register}
              />
            </div>
          </div>
        </div>
        <div className="border-b border-N40 pb-6">
          <div className="gap-6 md:grid md:grid-cols-12">
            <div className="sm-mb-0 col-span-3 mb-4">
              <Typography variant="h-s" fontWeight="medium" color={"N700"}>
                Did the orientation have an impact?
              </Typography>
            </div>
            <div className="sm-mb-0 col-span-5 mb-4 grid max-w-[512px] flex-1 grid-cols-1 gap-2">
              <div>
                {allOptions.map((option, index) => (
                  <RadioButton
                    name="orientationImpact"
                    value={String(option.value)}
                    label={option.label}
                    onChange={() => {
                      setValue("impact", "");
                    }}
                    key={index}
                    control={control}
                  />
                ))}
                {errors.orientationImpact?.message && (
                  <ValidationText
                    status="error"
                    message={errors.orientationImpact?.message}
                  />
                )}
              </div>
            </div>
          </div>
          {watchImpact === "true" && (
            <div className="mt-6">
              <TextField
                inputType="textarea"
                type="text"
                placeholder="Description"
                name="impact"
                label="If yes, describe the impact"
                flexStyle="row"
                error={!!errors.impact}
                errorText={errors.impact?.message}
                register={register}
              />
            </div>
          )}
        </div>
        <div className="gap-6 border-b border-N40 pb-6 md:grid md:grid-cols-12">
          <div className="sm-mb-0 col-span-3 mb-4">
            <Typography variant="h-s" fontWeight="medium" color={"N700"}>
              A hard/soft copy of the employee handbook
            </Typography>
          </div>
          <div className="sm-mb-0 col-span-5 mb-4 grid max-w-[512px] flex-1 grid-cols-1 gap-2">
            <div>
              {allOptions.map((option, index) => (
                <RadioButton
                  name="employeeHandBook"
                  value={String(option.value)}
                  label={option.label}
                  key={index}
                  control={control}
                />
              ))}
              {errors.employeeHandBook?.message && (
                <ValidationText
                  status="error"
                  message={errors.employeeHandBook?.message}
                />
              )}
            </div>
          </div>
          <div className="col-span-4 grid max-w-[512px] flex-1 grid-cols-1 justify-end">
            <div>
              <TextField
                inputType="input"
                type="date"
                placeholder="Enter dob"
                name="employeeHandBookDate"
                label="Date"
                flexStyle="row"
                error={!!errors.employeeHandBookDate}
                errorText={errors.employeeHandBookDate?.message}
                register={register}
              />
            </div>
          </div>
        </div>
        <div className="pb-6">
          <Typography variant="p-m" color="N700">
            Please type in your First name to sign
          </Typography>
          <div className="my-4">
            <TextField
              inputType="input"
              type="text"
              placeholder="Enter firstname"
              label="Signature"
              flexStyle="row"
              name={"signature"}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <Typography variant="p-m" color="N700">
            By signing this document with an electronic signature, I agree that
            such signature will be as valid as handwritten signatures to the
            extent allowed by local law.
          </Typography>
        </div>
        {/* Invisible Submit Button */}
        <button type="submit" ref={submitButtonRef} className="sr-only">
          Submit
        </button>
      </form>
    </FormStepJumbotron>
  );
};

IntegrationForm.displayName = "IntegrationForm";

export default IntegrationForm;
