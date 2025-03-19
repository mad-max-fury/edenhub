import React from "react";
import { Button, FileUploadSingle, notify } from "@/components";
import {
  useGetJobDesignationExcelTemplateMutation,
  useImportJobDesignationMutation,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { importSchema } from "./schema";

interface IAddOrEditProps {
  closeModal: () => void;
}

interface IImportProps {
  file: File;
}

export const ImportJobDesignations = ({ closeModal }: IAddOrEditProps) => {
  const [getJobDesignationExcelTemplate, { isLoading }] =
    useGetJobDesignationExcelTemplateMutation();
  const [importDJobDesignation, { isLoading: isUploading }] =
    useImportJobDesignationMutation();
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(importSchema),
  });
  const onSubmit = (values: IImportProps) => {
    const formData = new FormData();
    formData.append("file", values.file);
    importDJobDesignation(formData)
      .unwrap()
      .then(() => {
        notify.success({
          message: `Upload Complete`,
          subtitle: `Your file was successfully uploaded`,
        });
        closeModal();
      })
      .catch((err: IApiError) => {
        notify.error({
          message: "Action failed",
          subtitle: getErrorMessage(err),
        });
      });
  };

  const handleDownloadExcelTemplate = () => {
    getJobDesignationExcelTemplate()
      .unwrap()
      .then((response) => {
        console.log(response);

        const blob = new Blob([response], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Create a URL for the Blob and trigger the download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "job_designations_template.xlsx"); // The name of the file to download
        document.body.appendChild(link);
        link.click();

        // Clean up
        link.remove();
        window.URL.revokeObjectURL(url); // Release the URL after download
      })
      .catch((err: IApiError) => {
        notify.error({
          message: "Verification failed",
          subtitle: getErrorMessage(err),
        });
      });
  };

  return (
    <form
      className="flex h-full flex-col justify-between"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="p-6">
        <FileUploadSingle
          name="file"
          setValue={setValue}
          error={!!errors.file}
          errorText={errors.file?.message}
        />
      </div>
      <div className="flex justify-end gap-2 border-t border-solid border-N40 bg-N0 px-6 py-4">
        <Button
          variant={"secondary"}
          type="button"
          className="msm:w-full"
          onClick={handleDownloadExcelTemplate}
          loading={isLoading}
        >
          Download excel template
        </Button>
        <Button
          variant={"primary"}
          className="msm:w-full"
          loading={isUploading}
        >
          Upload
        </Button>
      </div>
    </form>
  );
};
