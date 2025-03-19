import React, { useContext, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConfirmationModal,
  FileUploadSingle,
  FormStepJumbotron,
  notify,
  Typography,
} from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { UserContext } from "@/layouts/appLayout";
import { RootState } from "@/redux";
import {
  IDocumentProps,
  IDocumentResponse,
  setInitDocumentState,
  useUpdateEmployeeDocumentsMutation,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import formatImageToBase64 from "@/utils/formatImageToBase64";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { schema } from "./schema";

export interface IDocumentForm {
  documentForm: File;
}
interface ChildFormProps {
  onClick: (step: string) => void;
  document: IDocumentProps;
  index: number;
  tabQueries: string[];
}
export const DcoumentForm = ({
  onClick,
  document,
  tabQueries,
  index,
}: ChildFormProps) => {
  const user = useContext(UserContext);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [updateIDCardForm, { isLoading }] =
    useUpdateEmployeeDocumentsMutation();
  const { document: documentDetails } = useSelector(
    (state: RootState) => state.onboardingForm,
  );
  const dispatch = useDispatch();
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IDocumentForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const isLastItem =
    documentDetails && documentDetails?.employeeDocuments?.length - 1 === index;

  const updateDocumentFile = (
    documentResponse: IDocumentResponse,
    index: number,
    newFile: string,
  ): IDocumentResponse => {
    return {
      ...documentResponse,
      employeeDocuments: documentResponse.employeeDocuments.map((doc, i) =>
        i === index
          ? {
              ...doc,
              file: newFile,
            }
          : doc,
      ),
    };
  };

  const onSubmit = async (data: IDocumentForm) => {
    if (user?.user?.employeeId && data && documentDetails) {
      const formData = new FormData();
      formData.append("employeeId", user.user.employeeId);
      formData.append("requiredDocumentId", document.requiredDocumentId);
      formData.append("documentForm", data.documentForm);
      updateIDCardForm(formData)
        .unwrap()
        .then(async () => {
          notify.success({
            message: "Your Document has been submitted successfully.",
          });
          setOpen(false);
          if (isLastItem) {
            router.replace(AuthRouteConfig.STAFF_ONBOARDING);
            return;
          }

          const newFile = (await formatImageToBase64(
            data.documentForm,
          )) as string;

          const updatedDocumentResponse = updateDocumentFile(
            documentDetails,
            index,
            newFile,
          );

          dispatch(setInitDocumentState(updatedDocumentResponse));
          onClick(tabQueries[index + 1]);
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
    <FormStepJumbotron
      title="Documents"
      currentStep={index + 1}
      totalSteps={tabQueries.length}
      onNext={() => submitButtonRef.current?.click()}
      isLoading={isLoading}
      primaryLabel={isLastItem ? "Submit" : "Next"}
    >
      <ConfirmationModal
        isOpen={open}
        closeModal={() => setOpen(false)}
        handleClick={() => {}}
        formTitle="Confirm Submission"
        message={
          <p>Are you sure you want to submit your Identity card form? </p>
        }
        isLoading={isLoading}
        type="confirm"
        buttonLabel="Submit"
      />
      <form
        className="flex w-full flex-col gap-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="md:grid md:grid-cols-12">
          <div className="col-span-3">
            <Typography variant="h-s" fontWeight="medium" color="N700">
              {document.requiredDocument}
            </Typography>
          </div>
          <div className="col-span-9">
            <FileUploadSingle
              name={`documentForm`}
              setValue={setValue}
              error={!!errors?.documentForm}
              errorText={errors?.documentForm?.message}
              formats={["jpg", "png", "jpeg", "pdf"]}
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

DcoumentForm.displayName = "DcoumentForm";

export default DcoumentForm;
