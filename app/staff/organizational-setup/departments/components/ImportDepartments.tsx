import { Button, FileUploadSingle, notify } from "@/components";
import {
  useGetDepartmentExcelTemplateMutation,
  useImportDepartmentMutation,
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

export const ImportDepartments = ({ closeModal }: IAddOrEditProps) => {
  const [getDepartmentExcelTemplate, { isLoading }] =
    useGetDepartmentExcelTemplateMutation();
  const [importDepartment, { isLoading: isUploading }] =
    useImportDepartmentMutation();
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
    importDepartment(formData)
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
    getDepartmentExcelTemplate()
      .unwrap()
      .then((response) => {
        console.log(response);

        const blob = new Blob([response], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "departments_template.xlsx");
        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);
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
