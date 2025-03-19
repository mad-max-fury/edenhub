import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  ConfirmationModal,
  FormStepJumbotron,
  notify,
  SMSelectDropDown,
  TextField,
  Typography,
} from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { RootState } from "@/redux";
import {
  ITaxPensionsProps,
  useUpdateEmployeeTaxAndPensionsMutation,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { ISelectItemPropsWithValueGeneric } from "@/redux/api/interface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { fieldSetterAndClearer } from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { TAB_QUERIES } from "./constants";
import { taxPensionsSchema } from "./schema";

interface ChildFormProps {
  onClick: (step: string) => void;
  allPensionFundAdmins: ISelectItemPropsWithValueGeneric[];
}

export const TaxPensionsForm = ({
  onClick,
  allPensionFundAdmins,
}: ChildFormProps) => {
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const { taxPensions, employeeId } = useSelector(
    (state: RootState) => state.bioDataForm,
  );
  const [hasChanges, setHasChanges] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<ITaxPensionsProps | null>(null);

  const [updateTaxAndPensions, { isLoading }] =
    useUpdateEmployeeTaxAndPensionsMutation();
  // const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<ITaxPensionsProps>({
    defaultValues: taxPensions as ITaxPensionsProps,
    resolver: yupResolver(taxPensionsSchema),
    mode: "onChange",
    context: { hasChanges },
  });
  const confirmSubmit = () => {
    if (employeeId) {
      const apiData = {
        employeeId,
        oldUser: false,
        employeeTaxAndPension: data
          ? {
              ...(data.NHS && {
                NHs: data.NHS,
              }),
              ...(data.taxId && {
                taxId: data.taxId,
              }),
              ...(data.pensionPin && {
                pensionPin: data.pensionPin,
              }),
              ...(data.fundsAdministratorId && {
                fundsAdministratorId: Number(data.fundsAdministratorId.value),
              }),
            }
          : undefined,
      };
      updateTaxAndPensions(apiData)
        .unwrap()
        .then(() => {
          // onClick(TAB_QUERIES[4]);
          notify.success({
            message: "Your Bio-data form has been submitted successfully.",
          });
          router.replace(AuthRouteConfig.PROFILE);
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
  const onSubmit = async (data: ITaxPensionsProps) => {
    setOpen(true);

    setData(data);
  };

  const handleFieldChange = () => {
    setHasChanges(true);
  };

  const handleSkip = () => {
    setData(null);
    setOpen(true);
  };

  return (
    <FormStepJumbotron
      title="Tax & Pensions"
      currentStep={10}
      totalSteps={TAB_QUERIES.length}
      onNext={hasChanges ? () => submitButtonRef.current?.click() : undefined}
      onBack={() => onClick(TAB_QUERIES[7])}
      isPreview={true}
      primaryLabel="Submit"
      additionalActions={
        !hasChanges ? (
          <Button variant="primary" onClick={handleSkip}>
            Submit
          </Button>
        ) : undefined
      }
    >
      <ConfirmationModal
        isOpen={open}
        closeModal={() => setOpen(false)}
        handleClick={confirmSubmit}
        formTitle="Confirm Submission"
        message={<p>Are you sure you want to submit your Bio-data form?</p>}
        isLoading={isLoading}
        type="confirm"
        buttonLabel="Submit"
      />
      <form
        className="flex w-full flex-col gap-6"
        onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}
      >
        <div>
          <TextField
            inputType="input"
            type="text"
            placeholder="Enter ID"
            name="taxId"
            label="Tax ID"
            flexStyle="row"
            error={!!errors.taxId}
            errorText={errors.taxId?.message}
            register={register}
            onChange={handleFieldChange}
          />
        </div>
        <Typography
          variant="p-s"
          fontWeight="medium"
          color={"N100"}
          className="uppercase"
        >
          PENSION DETAILS
        </Typography>
        <div>
          <SMSelectDropDown
            options={allPensionFundAdmins}
            varient="simple"
            isMulti={false}
            label="Funds Administrator"
            flexStyle="row"
            onChange={(selectedOption) => {
              fieldSetterAndClearer({
                value: selectedOption,
                setterFunc: setValue,
                setField: "fundsAdministratorId",
                clearErrors: clearErrors,
              });
              handleFieldChange();
            }}
            value={
              watch("fundsAdministratorId") as { label: string; value: string }
            }
            placeholder="Select an administrator"
            searchable={true}
            isError={!!errors.fundsAdministratorId}
            errorText={errors.fundsAdministratorId?.value?.message}
          />
        </div>
        <div>
          <TextField
            inputType="input"
            type="text"
            placeholder="Enter PIN"
            name="pensionPin"
            label="Pension PIN"
            flexStyle="row"
            error={!!errors.pensionPin}
            errorText={errors.pensionPin?.message}
            register={register}
            onChange={handleFieldChange}
          />
        </div>
        <div>
          <TextField
            inputType="input"
            type="text"
            placeholder="Enter PIN"
            name="NHS"
            label="NHF PIN"
            labelSubText="Optional"
            flexStyle="row"
            // error={!!errors.pensionPin}
            // errorText={errors.pensionPin?.message}
            register={register}
            onChange={handleFieldChange}
          />
        </div>
        {/* Invisible Submit Button */}
        <button type="submit" ref={submitButtonRef} className="sr-only">
          Submit
        </button>
      </form>
    </FormStepJumbotron>
  );
};

TaxPensionsForm.displayName = "TaxPensionsForm";
