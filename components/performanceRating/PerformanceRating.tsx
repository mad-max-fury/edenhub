"use client";

import React, { useState } from "react";
import { cn } from "@/utils/helpers";

import { Typography } from "../typography";
import { ValidationText } from "../validationText";

interface IPerformanceRatingOption {
  label: string;
  value: string;
}

type PerformanceRatingProps = {
  name: string;
  options: IPerformanceRatingOption[];
  errorText?: string;
  disabled?: boolean;
  defaultValue?: string;
  onChange?: (value: string) => void;
  value?: string;
};

export const PerformanceRating: React.FC<PerformanceRatingProps> = ({
  name,
  options,
  errorText = "",
  disabled = false,
  defaultValue = "",
  onChange,
  value,
}) => {
  const [internalValue, setInternalValue] = useState(value || defaultValue);

  const handleChange = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const currentValue = value !== undefined ? value : internalValue;
  const isActive = (val: string) => (currentValue === val ? "N700" : "N80");

  return (
    <>
      <div className="flex w-full">
        {options.map((option, index, array) => (
          <div
            key={option.value}
            className="flex h-[72px] w-full max-w-[116px] items-center gap-2 border [&:not(:last-child)]:border-r-0"
          >
            <input
              type="radio"
              id={option.value}
              name={name}
              value={option.value}
              checked={currentValue === option.value}
              disabled={disabled}
              className="sr-only"
              onChange={(e) => {
                handleChange(e.target.value);
              }}
            />
            <label
              htmlFor={option.value}
              className={cn(
                `h-full w-full cursor-pointer px-[32.5px] py-[16px]`,
                currentValue === option.value
                  ? index + 1 <= array.length / 2 || index === array.length - 1
                    ? "bg-B50"
                    : "bg-G50"
                  : "bg-N0",
              )}
            >
              <Typography
                className="flex h-full flex-col !items-center !justify-center text-center"
                variant="p-m"
                fontWeight="medium"
                color={isActive(option.value)}
              >
                {index !== array.length - 1 && (
                  <span className="w-fit !text-inherit">{option.value}</span>
                )}
                <span className="w-fit !text-inherit">{option.label}</span>
              </Typography>
            </label>
          </div>
        ))}
      </div>
      {errorText && <ValidationText status="error" message={errorText} />}
    </>
  );
};
