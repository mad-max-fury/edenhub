"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Badge,
  Button,
  Checkbox,
  ConfirmationModal,
  Jumbotron,
  notify,
  PageHeader,
  SMSelectDropDown,
  SnowQuillEditor,
  TextField,
  Typography,
  ValidationText,
} from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { RootState } from "@/redux";
import {
  ICreateDocumntTemplatePayload,
  useAddOrUpdateDocumentTemplateMutation,
} from "@/redux/api/documentTemplate";
import {
  clearDocumentTemplateForm,
  setDocumentTemplateForm,
} from "@/redux/api/documentTemplate/document.slice";
import { IApiError } from "@/redux/api/genericInterface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import {
  fieldSetterAndClearer,
  formatSelectItems,
  getSelectedOption,
} from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { Breadcrumbs } from "@/components/breadCrumbs/breadCrumbs";

import { documentSchema } from "../components/schema";

const Page = () => {
  const dispatch = useDispatch();
  const { push } = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { documentTemplate } = useSelector(
    (state: RootState) => state.documentTemplateForm,
  );

  const id = documentTemplate?.id ?? undefined;
  const [addOrUpdateDocumentTemplate, { isLoading }] =
    useAddOrUpdateDocumentTemplateMutation();

  const CRUMBS = [
    {
      name: "Document Templates",
      path: AuthRouteConfig.EMPLOYEE_MANAGEMENT_DOCUMENT_TEMPLATES,
    },
    {
      name: id !== undefined ? "Edit Document" : "Create New Document",
      path: AuthRouteConfig.EMPLOYEE_MANAGEMENT_DOCUMENT_CREATE,
    },
  ];

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    watch,
    register,
  } = useForm<ICreateDocumntTemplatePayload>({
    defaultValues: {
      ...(documentTemplate as ICreateDocumntTemplatePayload),
      isCompleted: documentTemplate?.isCompleted ?? false,
      requiresNotification: documentTemplate?.requiresNotification ?? false,
      requiresSigning: documentTemplate?.requiresSigning ?? false,
      requiresUpload: documentTemplate?.requiresUpload ?? false,
    },
    resolver: yupResolver(documentSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ICreateDocumntTemplatePayload) => {
    try {
      const payload: ICreateDocumntTemplatePayload = { ...data };
      dispatch(setDocumentTemplateForm(payload));
      push(AuthRouteConfig.EMPLOYEE_MANAGEMENT_DOCUMENT_PREVIEW);
    } catch (error) {
      notify.error({
        message: "Could not save document",
        subtitle: getErrorMessage(error as IApiError),
      });
    }
  };

  const onContinueLater = async (data: ICreateDocumntTemplatePayload) => {
    try {
      await addOrUpdateDocumentTemplate({
        ...data,
        isCompleted: false,
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

  const renderErrorMessages = () => {
    const errorMessages = [
      errors.requiresSigning?.message,
      errors.requiresUpload?.message,
      errors.requiresNotification?.message,
    ].filter(Boolean);

    return errorMessages.map((msg, idx) => (
      <ValidationText key={idx} message={msg as string} status="error" />
    ));
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mx-auto flex w-full max-w-[870px] flex-col gap-4">
          <Breadcrumbs crumbs={CRUMBS} />

          <PageHeader
            title={id !== undefined ? "Edit Document" : "Add Document"}
            buttonGroup={
              <Button
                type="button"
                variant="secondary"
                types="filled"
                onClick={() => setShowConfirmation(true)}
              >
                {documentTemplate?.isCompleted
                  ? "Convert to draft"
                  : "Continue Later"}
              </Button>
            }
          />

          <Jumbotron
            headerContainer={
              <div className="flex justify-between">
                <Typography variant="h-m" color="text-default">
                  Document Info
                </Typography>
                {!documentTemplate?.isCompleted && (
                  <Badge className="rounded-xl" text="Draft" />
                )}
              </div>
            }
            footerContent={
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  types="filled"
                  type="button"
                  onClick={() =>
                    push(AuthRouteConfig.EMPLOYEE_MANAGEMENT_DOCUMENT_TEMPLATES)
                  }
                >
                  Cancel
                </Button>
                <Button variant="primary" types="filled" type="submit">
                  Preview
                </Button>
              </div>
            }
          >
            <div className="flex w-full flex-col gap-4">
              <div className="flex flex-col gap-5 px-4 pb-12 pt-4">
                <fieldset>
                  <TextField
                    inputType="input"
                    type="text"
                    label="Document Name"
                    placeholder="Document name"
                    name="name"
                    flexStyle="row"
                    error={!!errors.name}
                    errorText={errors.name?.message}
                    register={register}
                  />
                </fieldset>
                <fieldset>
                  <TextField
                    inputType="textarea"
                    type="text"
                    label="Description"
                    placeholder="Document description"
                    name="description"
                    flexStyle="row"
                    error={!!errors.description}
                    errorText={errors.description?.message}
                    register={register}
                  />
                </fieldset>
                <fieldset>
                  <SMSelectDropDown
                    label="Category"
                    varient="simple"
                    placeholder="Select Category"
                    searchable={true}
                    options={[
                      {
                        label: "Onboarding",
                        value: "onboarding",
                      },
                    ]}
                    flexStyle="row"
                    isError={!!errors.documentCategory}
                    errorText={errors.documentCategory?.message}
                    value={getSelectedOption(
                      [
                        {
                          label: "Onboarding",
                          value: "onboarding",
                        },
                      ],
                      watch("documentCategory"),
                    )}
                    onChange={(selectedOption) => {
                      fieldSetterAndClearer({
                        value: selectedOption.value,
                        setterFunc: setValue,
                        setField: "documentCategory",
                        clearErrors,
                      });
                    }}
                  />
                </fieldset>
              </div>
              <hr />

              <div className="px-4 pt-4">
                <PageHeader
                  title="Configurations"
                  subtitle="Does this document require any action from the employee? Kindly Select"
                />
                <div className="mt-6 flex gap-6">
                  <Checkbox
                    checked={watch("requiresSigning")}
                    id="requiresSigning"
                    value={`${watch("requiresSigning")}`}
                    label="Requires Signing"
                    onSelect={() =>
                      fieldSetterAndClearer({
                        value: !watch("requiresSigning"),
                        setterFunc: setValue,
                        setField: "requiresSigning",
                        clearErrors,
                      })
                    }
                  />

                  <Checkbox
                    checked={watch("requiresNotification")}
                    id="requiresNotification"
                    value={`${watch("requiresNotification")}`}
                    label="Employees can be notified of changes"
                    onSelect={() =>
                      fieldSetterAndClearer({
                        value: !watch("requiresNotification"),
                        setterFunc: setValue,
                        setField: "requiresNotification",
                        clearErrors,
                      })
                    }
                  />

                  <Checkbox
                    checked={watch("requiresUpload")}
                    id="requiresUpload"
                    value={`${watch("requiresUpload")}`}
                    label="Requires upload"
                    onSelect={() =>
                      fieldSetterAndClearer({
                        value: !watch("requiresUpload"),
                        setterFunc: setValue,
                        setField: "requiresUpload",
                        clearErrors,
                      })
                    }
                  />
                </div>
                {renderErrorMessages()}
              </div>

              <div>
                <SnowQuillEditor
                  value={watch("template")}
                  onChange={(value) => {
                    fieldSetterAndClearer({
                      value,
                      setterFunc: setValue,
                      setField: "template",
                      clearErrors,
                    });
                  }}
                />
                {errors.template && (
                  <ValidationText
                    message={errors.template.message as string}
                    status="error"
                  />
                )}
              </div>
            </div>
          </Jumbotron>
        </div>
      </form>
      <ConfirmationModal
        isOpen={showConfirmation}
        formTitle="Save template as draft"
        message={
          <Typography>
            Are you sure you want to save this template as a draft? The changes
            you make will be saved to the database.
          </Typography>
        }
        handleClick={handleSubmit(onContinueLater, () => {
          setShowConfirmation(false);
        })}
        isLoading={isLoading}
        type="confirm"
        buttonLabel="Save as Draft"
        closeModal={() => setShowConfirmation(false)}
      />
    </>
  );
};

export default Page;
