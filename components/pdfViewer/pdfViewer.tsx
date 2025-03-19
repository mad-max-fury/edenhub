"use client";

import { Viewer, Worker } from "@react-pdf-viewer/core";

import { InputFileViewTriggerButton } from "../documentViewer/InputFileViewTriggerButton";
import { Modal } from "../modal/modal";

import "@react-pdf-viewer/core/lib/styles/index.css";

import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import { useState } from "react";

interface Props {
  name: string;
  link: string;
}

export const PdfViewer = ({ name, link }: Props) => {
  const [showModal, setShowModal] = useState(false);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div>
      <InputFileViewTriggerButton
        onClick={handleOpen}
        name={name}
        link={link}
      />
      <Modal
        isOpen={showModal}
        closeModal={handleClose}
        title="Pdf Viewer"
        mobileLayoutType={"full"}
      >
        <div className="h-[90vh] max-h-[80vh] w-[90vw] max-w-full">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer
              defaultScale={1}
              fileUrl={link}
              plugins={[defaultLayoutPluginInstance]}
            />
          </Worker>
        </div>
      </Modal>
    </div>
  );
};
