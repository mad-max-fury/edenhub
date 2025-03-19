import React, { useContext, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Checkbox,
  ConfirmationModal,
  DocumentViewer,
  FormStepJumbotron,
  notify,
  RowView,
  TextField,
  Typography,
} from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { UserContext } from "@/layouts/appLayout";
import { useUpdateEmployeeAttestationFormMutation } from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { Assestation } from "@/redux/api/interface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import useGetDocumentTemplate from "@/utils/useGetDocumentTemplate";

import { TAB_QUERIES } from "./constants";

export const AttestationForm = () => {
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [name, setName] = useState("");
  const [currentId, setCurrentId] = useState("");
  const router = useRouter();
  const [updateAttestationForm, { isLoading }] =
    useUpdateEmployeeAttestationFormMutation();
  const { downloadDocumentTemplate, isLoading: isDownloading } =
    useGetDocumentTemplate();
  const data = useContext(UserContext);

  const confirmSubmit = () => {
    if (data?.user?.employeeId && data) {
      const apiData = {
        employeeId: data?.user?.employeeId,
        signed: true,
      };
      updateAttestationForm(apiData)
        .unwrap()
        .then(() => {
          notify.success({
            message: "Your Attestation form has been submitted successfully.",
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
  return (
    <FormStepJumbotron
      title="Employee Attestation Form"
      currentStep={1}
      totalSteps={TAB_QUERIES.length}
      onNext={() => submitButtonRef.current?.click()}
      isLoading={false}
      disabled={
        !checked ||
        !(name?.toLowerCase() === data?.user?.firstname?.toLowerCase())
      }
      primaryLabel="Submit"
      noPadding={true}
    >
      <ConfirmationModal
        isOpen={open}
        closeModal={() => setOpen(false)}
        handleClick={confirmSubmit}
        formTitle="Confirm Submission"
        message={
          <p>
            Are you sure you want to submit your Employee Attestation Form?{" "}
          </p>
        }
        isLoading={isLoading}
        type="confirm"
        buttonLabel="Submit"
      />
      <form className="flex w-full flex-col gap-6">
        <RowView
          name="Code of Conduct"
          value={
            <DocumentViewer
              name="Code of Conduct.pdf"
              link="https://www.google.com"
              customButton={
                <Typography
                  variant="p-m"
                  fontWeight="medium"
                  color="B400"
                  className="cursor-pointer"
                  onClick={() => {
                    setCurrentId(String(Assestation.CODE_OF_CONDUCT));
                    downloadDocumentTemplate(
                      String(Assestation.CODE_OF_CONDUCT),
                    );
                  }}
                >
                  {isDownloading &&
                  currentId == String(Assestation.CODE_OF_CONDUCT)
                    ? "Downloading..."
                    : "Download"}
                </Typography>
              }
            />
          }
        />

        <RowView
          name="Employee Handbook"
          value={
            <DocumentViewer
              name="Employee Handbook.pdf"
              link="https://www.google.com"
              customButton={
                <Typography
                  variant="p-m"
                  fontWeight="medium"
                  color="B400"
                  className="cursor-pointer"
                  onClick={() => {
                    setCurrentId(String(Assestation.EMPLOYEE_HANDBOOK));
                    downloadDocumentTemplate(
                      String(Assestation.EMPLOYEE_HANDBOOK),
                    );
                  }}
                >
                  {isDownloading &&
                  currentId == String(Assestation.EMPLOYEE_HANDBOOK)
                    ? "Downloading..."
                    : "Download"}
                </Typography>
              }
            />
          }
        />
        <div className="border-t border-N40 py-12">
          <div className="flex gap-1">
            <Checkbox
              label=" "
              checked={checked}
              onSelect={() => setChecked(!checked)}
            />
            <Typography variant="p-m" color="N700">
              I accept and will abide by the Tenece Group code of conduct and
              confirm that I have read and understood the Employee Handbook.
            </Typography>
          </div>
          <div className="mt-6">
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
        </div>
        {/* Invisible Submit Button */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          ref={submitButtonRef}
          className="sr-only"
        >
          Submit
        </button>
      </form>
    </FormStepJumbotron>
  );
};

AttestationForm.displayName = "AttestationForm";

export default AttestationForm;
