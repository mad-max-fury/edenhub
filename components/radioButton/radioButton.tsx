import React from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";

import { Typography } from "../typography";
import { ValidationText } from "../validationText";

interface RadioButtonProps<T extends FieldValues> {
  name: Path<T>;
  value: string;
  label: string;
  control: Control<T>;
  errorText?: string;
  disabled?: boolean;
  defaultChecked?: boolean;
  onChange?: (value: string) => void;
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
}

export const RadioButton = <T extends FieldValues>({
  name,
  value,
  label,
  control,
  errorText = "",
  disabled = false,
  defaultChecked = false,
  onChange,
  onClick,
}: RadioButtonProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={
        defaultChecked
          ? (value as PathValue<T, Path<T>>)
          : ("" as PathValue<T, Path<T>>)
      }
      render={({ field }) => (
        <>
          <div className="flex items-center gap-2">
            <input
              {...field}
              type="radio"
              value={value}
              id={value}
              checked={field.value === value}
              disabled={disabled}
              className="cursor-pointer accent-[#0052CC]"
              onChange={(e) => {
                field.onChange(e);
                if (onChange) onChange(e.target.value);
              }}
              onClick={onClick}
            />
            <Typography fontWeight="regular" variant="p-m">
              <label htmlFor={value} className="cursor-pointer">
                {label}
              </label>
            </Typography>
          </div>
          {errorText && <ValidationText status="error" message={errorText} />}
        </>
      )}
    />
  );
};
