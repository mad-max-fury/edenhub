"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import { Button } from "../buttons";
import { Modal } from "../modal/modal";
import { notify } from "../notifications/notify";
import { InputFileViewTriggerButton } from "./InputFileViewTriggerButton";

type Props = {
  name: string;
  link: string;
  triggerType?: "inputFileTrigger" | "view" | "button";
  showModal?: boolean;
  handleClose?: () => void;
  customButton?: React.ReactNode;
};

const DocumentViewer = ({
  name,
  link,
  triggerType = "inputFileTrigger",
  showModal,
  handleClose,
  customButton,
}: Props) => {
  const [showFile, setShowFile] = useState<boolean>(false);
  const [fileType, setFileType] = useState<string | null>(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    const fetchFileType = async () => {
      try {
        const response = await fetch(link, { method: "HEAD" });
        const contentType = response.headers.get("Content-Type");
        if (contentType) {
          setFileType(contentType);
        } else {
          setFileType(null);
        }
      } catch (error) {
        console.error("Failed to fetch file type:", error);
        setFileType(null);
      }
    };

    fetchFileType();
  }, [link]);

  const handleOpenFile = () => setShowFile(true);
  const handleCloseFile = () => {
    if (handleClose) {
      handleClose();
      return;
    }
    setShowFile(false);
  };

  const handleDownloadFile = async () => {
    try {
      const response = await fetch(link);
      if (!response.ok) {
        throw new Error("File not found or failed to download.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);

      notify.success({
        message: "File downloaded successfully",
        subtitle: name,
      });
    } catch (error) {
      notify.error({
        message: "Failed to download file",
        subtitle: "Please check the link and try again",
      });
    }
  };

  const renderTriggerType = () => {
    switch (triggerType) {
      case "inputFileTrigger":
        return (
          <InputFileViewTriggerButton
            onClick={handleOpenFile}
            name={name}
            link={link}
            customButton={customButton}
          />
        );
      case "button":
        return (
          <button className="w-full" onClick={handleOpenFile}>
            {customButton}
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {renderTriggerType()}
      <Modal
        closeModal={handleCloseFile}
        mobileLayoutType={"full"}
        isOpen={showModal || showFile}
        title="Document Viewer"
        footerData={
          <div className="flex w-full items-center justify-end gap-2 bg-N0">
            <Button variant="secondary" onClick={handleCloseFile}>
              Close
            </Button>
            <Button variant="primary" onClick={handleDownloadFile}>
              Download
            </Button>
          </div>
        }
      >
        <div className="relative mx-auto aspect-square w-[90vw] max-w-[614px]">
          {fileType?.includes("image") || fileType?.includes("jpg") ? (
            <Image alt={name} src={link} fill objectFit="contain" />
          ) : fileType === "application/pdf" ? (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                defaultScale={1}
                fileUrl={link}
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>
          ) : (
            <p className="text-center my-auto text-gray-500">Unsupported file type</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export { DocumentViewer };
