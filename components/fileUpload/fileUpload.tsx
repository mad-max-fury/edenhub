"use client";

import React, { ForwardedRef, useState } from "react";
import { FieldValues, Path } from "react-hook-form";

import { UploadIcon } from "../../assets/svgs";
import { ValidationText } from "../validationText";
import { IFileUploadProps } from "./fileUpload.types";
import { FileUploadPreview } from "./fileUploadPreview";

const FileUploadComponent = <FV extends FieldValues>(
  props: IFileUploadProps<FV>,
  ref?: ForwardedRef<HTMLInputElement>,
) => {
  const {
    loader,
    className,
    name,
    onChange,
    disabled,
    errorText,
    setValue,
    clearFieldValue,
    formats = ["pdf", "jpg", "png", "jpeg"],
    uploading = false,
    ...rest
  } = props;

  const [files, setFiles] = useState<File[]>([]);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    const fileList = event.target.files;
    if (fileList) {
      const newFiles = Array.from(fileList);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      // @ts-expect-error this is not assignable
      setValue?.(name as Path<FV>, newFiles, { shouldValidate: true });
    }
  };

  const handleDeleteFile = (fileName: string) => {
    const updatedFiles = files.filter((file) => file.name !== fileName);
    setFiles(updatedFiles);
    if (ref && typeof ref === "object" && ref.current) {
      ref.current.value = "";
    }
    if (updatedFiles.length === 0) {
      clearFieldValue && clearFieldValue();
      // @ts-expect-error this is not assignable
      setValue?.(name as Path<FV>, null, { shouldValidate: true });
    } else {
      // @ts-expect-error this is not assignable
      setValue?.(name as Path<FV>, updatedFiles, { shouldValidate: true });
    }
  };

  return (
    <div>
      <div
        className={`w-full border-2 border-dashed px-2 ${
          errorText ? "border-red-500" : "border-gray-300"
        } relative flex h-40 items-center justify-center rounded ${className}`}
      >
        <div className="flex h-full w-full flex-col items-center justify-center">
          {loader ? "" : ""}
          <UploadIcon />
          <p className="mt-2 text-center text-sm text-gray-500">
            Drag and drop your file(s) or{" "}
            <span className="text-blue-500">browse to upload</span>
          </p>
          <p className="mt-1 text-sm text-gray-500">
            File Format {formats.join(" / ").toUpperCase()}
          </p>
        </div>
        <input
          type="file"
          name={name}
          disabled={disabled}
          onChange={onFileChange}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          {...rest}
          ref={ref}
          accept={formats.map((format) => `.${format}`).join(",")}
        />
      </div>
      {errorText && (
        <div>
          <ValidationText status="error" message={errorText as string} />
        </div>
      )}
      <div className="mt-4 flex flex-col gap-3">
        {files.map((file, index) => (
          <FileUploadPreview
            key={`${file.name}-${index}`}
            file={file}
            uploading={uploading}
            preview={uploading}
            handleDeleteFile={(name) => handleDeleteFile(name as string)}
          />
        ))}
      </div>
    </div>
  );
};

export type FileUploadInputComponentType = <FV extends FieldValues>(
  props: IFileUploadProps<FV> & {
    ref?: React.ForwardedRef<HTMLInputElement>;
  },
) => ReturnType<typeof FileUploadComponent>;

const FileUpload = React.forwardRef(
  FileUploadComponent,
) as FileUploadInputComponentType;

export { FileUpload };

export * from "./fileUpload.types";
