"use client";

import React from "react";

import {
  CancelBoldIcon,
  DeleteIcon,
  DownloadIcon,
  ErrorIcon,
  FileIcon,
  LoadingIcon,
} from "../../assets/svgs";

interface FileUploadPreviewProps {
  file: File;
  uploading: boolean;
  preview: boolean;
  handleDeleteFile: (fileName: string | undefined) => void;
}

const FileUploadPreview: React.FC<FileUploadPreviewProps> = ({
  file,
  uploading,
  preview,
  handleDeleteFile,
}) => {
  // Calculate file size in MB
  const fileSizeInMb = file ? file.size / (1024 * 1024) : 0;
  const isGreaterThan1Mb = fileSizeInMb > 1;

  // Determine the state based on file properties and props
  let state: "error" | "download" | "preview" | "loading" = isGreaterThan1Mb
    ? "error"
    : !preview && !uploading
      ? "download"
      : preview && !uploading
        ? "preview"
        : "loading";

  return (
    <div
      className={`min-h-[72px] w-full border-2 border-dashed ${isGreaterThan1Mb ? "border-red-500" : "border-gray-300"} flex items-center gap-2 rounded-md p-3`}
    >
      {state === "loading" ? (
        <div className="relative h-6 w-6">
          <LoadingIcon className="absolute left-[10%] top-[10%] animate-spin" />
        </div>
      ) : state === "download" ? (
        <DownloadIcon />
      ) : state === "preview" ? (
        <FileIcon />
      ) : (
        <ErrorIcon />
      )}
      <div className="flex flex-1 flex-col items-start justify-start">
        <h5 className="-mb-0.5 text-sm font-medium leading-6 text-gray-900">
          {file?.name}
        </h5>
        <small
          className={`text-xs font-normal leading-6 ${isGreaterThan1Mb ? "text-red-500" : "text-gray-500"}`}
        >
          {state === "download" || state === "preview"
            ? `${fileSizeInMb.toFixed(4)} MB`
            : state === "error"
              ? "This file is too big. You can upload files up to 1 MB"
              : "Uploading..."}
        </small>
      </div>
      {!preview && (
        <button
          type="button"
          onClick={() => handleDeleteFile(file?.name)}
          className="cursor-pointer border-none bg-transparent"
        >
          {state === "error" ? <CancelBoldIcon /> : <DeleteIcon />}
        </button>
      )}
    </div>
  );
};

export { FileUploadPreview };
