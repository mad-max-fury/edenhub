"use client";

import { useState } from "react";
import { notFound, useRouter } from "next/navigation";
import {
  BubbleQuillEditor,
  Button,
  ConfirmationModal,
  Jumbotron,
  notify,
  PageHeader,
  Typography,
} from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { RootState } from "@/redux";
import {
  ICreateDocumntTemplatePayload,
  useAddOrUpdateDocumentTemplateMutation,
} from "@/redux/api/documentTemplate";
import { clearDocumentTemplateForm } from "@/redux/api/documentTemplate/document.slice";
import { IApiError } from "@/redux/api/genericInterface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { useDispatch, useSelector } from "react-redux";

import { Breadcrumbs } from "@/components/breadCrumbs/breadCrumbs";

const PreviewPage = () => {
  const dispatch = useDispatch();
  const { push, back } = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { documentTemplate } = useSelector(
    (state: RootState) => state.documentTemplateForm,
  );
  const [addOrUpdateDocumentTemplate, { isLoading }] =
    useAddOrUpdateDocumentTemplateMutation();

  const CRUMBS = [
    {
      name: "Document Templates",
      path: AuthRouteConfig.EMPLOYEE_MANAGEMENT_DOCUMENT_TEMPLATES,
    },
    {
      name: documentTemplate?.name ?? "",
      path: AuthRouteConfig.EMPLOYEE_MANAGEMENT_DOCUMENT_PREVIEW,
    },
  ];

  const onSaveTemplate = async (data: ICreateDocumntTemplatePayload) => {
    try {
      await addOrUpdateDocumentTemplate({
        ...data,
        isCompleted: true,
      }).unwrap();
      notify.success({ message: "Document saved successfully" });
      setShowConfirmation(false);
      push(AuthRouteConfig.EMPLOYEE_MANAGEMENT_DOCUMENT_TEMPLATES);
      dispatch(clearDocumentTemplateForm());
    } catch (error) {
      notify.error({
        message: "Failed to save document",
        subtitle: getErrorMessage(error as IApiError),
      });
    }
  };

  return (
    <>
      <div>
        <div className="mx-auto flex w-full max-w-[870px] flex-col gap-4">
          <Breadcrumbs crumbs={CRUMBS} />

          <PageHeader
            title={documentTemplate?.name}
            buttonGroup={
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  types="filled"
                  onClick={() => {
                    back();
                  }}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  types="filled"
                  onClick={() => setShowConfirmation(true)}
                >
                  Save
                </Button>
              </div>
            }
          />

          <Jumbotron
            headerContainer={
              <div className="flex justify-between">
                <Typography variant="h-m" color="text-default">
                  {documentTemplate?.name}
                </Typography>
              </div>
            }
          >
            <div className="flex w-full flex-col gap-4 [&>*]:border-none">
              <BubbleQuillEditor
                value={documentTemplate?.template ?? ""}
                onChange={() => null}
                readOnly={true}
              />
            </div>
          </Jumbotron>
        </div>
      </div>
      <ConfirmationModal
        isOpen={showConfirmation}
        formTitle="Save template"
        message={
          <Typography>
            Are you sure you want to save this template ? The changes you make
            will be saved to the database.
          </Typography>
        }
        handleClick={() =>
          onSaveTemplate(documentTemplate as ICreateDocumntTemplatePayload)
        }
        isLoading={isLoading}
        type="confirm"
        buttonLabel="Save"
        closeModal={() => setShowConfirmation(false)}
      />
    </>
  );
};

export default PreviewPage;
