"use client";

import React from "react";
import { FileIcon } from "@/assets/svgs";

type Props = {
  name: string;
  link: string;
  onClick?: () => void;
  customButton?: React.ReactNode;
};

const InputFileViewTriggerButton = ({ name, onClick, customButton }: Props) => {
  return (
    <div
      className={`flex min-h-[53px] w-full items-center gap-2 rounded-md border-[1px] border-solid border-N40 p-3`}
    >
      <div className="flex flex-1 items-center justify-start gap-3">
        <FileIcon />
        <h5 className="-mb-0.5 text-sm font-medium leading-6 text-gray-900">
          {name}
        </h5>
      </div>
      {customButton ? (
        customButton
      ) : (
        <button type="button" onClick={onClick} className="text-sm text-B400">
          View
        </button>
      )}
    </div>
  );
};

export { InputFileViewTriggerButton };
