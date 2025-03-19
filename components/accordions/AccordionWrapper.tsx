"use client";

import React from "react";
import { cn } from "@/utils/helpers";

type Props = {
  title: React.ReactNode | string;
  children: React.ReactNode;
  isOpen: boolean;
  toggleAccordion: () => void;
};

const AccordionWrapper: React.FC<Props> = ({
  title,
  children,
  isOpen = false,
  toggleAccordion,
}) => {
  return (
    <div className={cn("group w-full")}>
      <div
        className="flex w-full cursor-pointer items-center justify-between border-b border-solid border-N40 py-4"
        onClick={toggleAccordion}
      >
        {typeof title === "string" ? (
          <h2 className="text-xs font-semibold">{title}</h2>
        ) : (
          title
        )}
        {
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={
                isOpen
                  ? "M14 7.98145H0.230469V6.01855H14V7.98145Z"
                  : "M14 7.98145H8.08203V13.8848H6.13379V7.98145H0.230469V6.01855H6.13379V0.115234H8.08203V6.01855H14V7.98145Z"
              }
              fill="#344563"
            />
          </svg>
        }
      </div>
      <div
        className={cn(
          "grid w-full transition-all duration-300 ease-in-out",
          isOpen
            ? "overflow-[unset] grid-rows-[1fr] pt-2"
            : "grid-rows-[0fr] overflow-hidden p-0",
        )}
      >
        <div className={cn("w-full", isOpen ? "p-1" : "overflow-hidden p-0")}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AccordionWrapper;
