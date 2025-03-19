import React, { LegacyRef } from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

export interface ITextFieldProps<IFormValues extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: Path<IFormValues>;
  id?: string;
  label?: React.ReactNode | string;
  inputType?: "input" | "textarea" | "searchable";
  icon?: React.ReactNode;
  error?: boolean;
  errorText?: string;
  wrapClass?: string;
  ref?: LegacyRef<HTMLInputElement>;
  register?: UseFormRegister<IFormValues>;
  required?: boolean;
  customClassName?: string;
  flexStyle?: "col" | "row";
  labelSubText?: string;
}
