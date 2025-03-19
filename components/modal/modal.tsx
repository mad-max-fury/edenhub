"use client";

import React, { Fragment, useEffect } from "react";
import { CloseXIcon } from "@/assets/svgs";
import { cn } from "@/utils/helpers";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";

import { Button } from "../buttons";
import { Typography } from "../typography";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  children?: React.ReactNode;
  title?: string;
  closeOnOutsideClick?: boolean;
  footerData?: React.ReactElement;
  mobileLayoutType: "full" | "normal";
}

function Modal({
  isOpen,
  closeModal,
  children,
  title,
  closeOnOutsideClick = true,
  footerData,
  mobileLayoutType,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    document.body.style.overflow = "";
    closeModal();
  };
  return (
    <Transition appear show={isOpen} as={Fragment} unmount>
      <Dialog
        as="div"
        className="relative z-[100000]"
        onClose={closeOnOutsideClick ? handleClose : () => null}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 z-[99] bg-[#091E428A]" />
        </TransitionChild>

        <div className="fixed inset-0 z-[100] flex w-full items-center justify-center overflow-y-auto hideScrollBar">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel
              className={cn(
                mobileLayoutType === "normal" ? "" : "msm:h-screen",
                "flex max-h-screen w-full max-w-[744px] flex-col bg-N0 shadow-xl md:w-[90%] md:rounded-md",
              )}
            >
              <div className="sticky top-0 flex items-center justify-between rounded-t-[inherit] border-b border-solid border-N40 bg-N0 px-6 py-4">
                <Typography variant="p-l" color="N900">
                  {title}
                </Typography>

                <Button onClick={handleClose} variant={"plain"} size={"plain"}>
                  <CloseXIcon />
                </Button>
              </div>
              <div className="flex-1 flex-grow overflow-y-scroll">{children}</div>
              {footerData && (
                <div className="border-t border-solid border-N40 bg-N0 px-6 py-4">
                  {footerData}
                </div>
              )}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}

export { Modal };
