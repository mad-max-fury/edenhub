"use client";

import React, { ForwardedRef, useState } from "react";
import { FieldValues, Path } from "react-hook-form";

import { UploadIcon } from "../../assets/svgs";
import { ValidationText } from "../validationText";
import { IFileUploadProps } from "./fileUpload.types";
import { FileUploadPreview } from "./fileUploadPreview";

const FileUploadComponentSingle = <FV extends FieldValues>(
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

  const [file, setFile] = useState<File | null>(null);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const newFile = fileList[0];
      setFile(newFile);
      // @ts-expect-error this is not assignable
      setValue?.(name as Path<FV>, newFile, { shouldValidate: true });
    }
  };

  const handleDeleteFile = () => {
    setFile(null);

    if (ref && "current" in ref && ref.current) {
      ref.current.value = "";
    }

    clearFieldValue?.();
    // @ts-expect-error this is not assignable
    setValue?.(name as Path<FV>, undefined, { shouldValidate: true });
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
            Drag and drop your file or{" "}
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
          multiple={false}
          ref={ref}
        />
      </div>
      {errorText && (
        <div>
          <ValidationText status="error" message={errorText as string} />
        </div>
      )}
      <div className="mt-4">
        {file && (
          <FileUploadPreview
            file={file}
            uploading={uploading}
            preview={uploading}
            handleDeleteFile={() => handleDeleteFile()}
          />
        )}
      </div>
    </div>
  );
};

export type FileUploadInputComponentSingleType = <FV extends FieldValues>(
  props: IFileUploadProps<FV> & {
    ref?: React.ForwardedRef<HTMLInputElement>;
  },
) => ReturnType<typeof FileUploadComponentSingle>;

const FileUploadSingle = React.forwardRef(
  FileUploadComponentSingle,
) as FileUploadInputComponentSingleType;

export { FileUploadSingle };

export * from "./fileUpload.types";
