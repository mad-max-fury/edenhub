"use client";

import React, { ForwardedRef, Ref, useState } from "react";
import { PassLock } from "@/assets/svgs";
import clsx from "clsx";
import {
  FieldValues,
  InternalFieldName,
  Path,
  UseFormRegisterReturn,
} from "react-hook-form";

import { Typography } from "../typography";
import { ValidationText } from "../validationText";
import { ITextFieldProps } from "./types";

const TextFieldComponent = <FV extends FieldValues>(
  props: ITextFieldProps<FV>,
  ref?: ForwardedRef<HTMLInputElement>
) => {
  const {
    type = "text",
    inputType = "input",
    error = false,
    errorText = "",
    placeholder,
    icon = null,
    name,
    className,
    labelSubText,
    label,
    register,
    flexStyle = "col",
    ...rest
  } = props;

  // React hook form register
  const registerInput: UseFormRegisterReturn<Path<FV>> | object = register
    ? register(name, { required: rest.required })
    : {};

  const [showPassword, setShowPassword] = useState(false);

  const classes = clsx(
    className,
    `block w-full text-sm bg-transparent text-N700 placeholder:text-N80 border rounded py-2 px-3 focus:outline-B100 focus:border-2 disabled:cursor-not-allowed disabled:bg-N20 disabled:text-N70  ${error ? "border-R400 border-2" : "border-N40"}`
  ); //generic styles for input

  const passwordClasses = clsx(`grow focus:outline-none`, className); //special styles for password input

  const iconInputsClasses = clsx(`grow focus:outline-none`, className); //special; styles for icon inputs

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Call the register's onChange if it exists
    if ("onChange" in registerInput) {
      (registerInput as UseFormRegisterReturn<Path<FV>>).onChange(e);
    }
    // Call the prop onChange if it exists
    rest.onChange?.(e);
  };

  const renderInput = () => {
    if (!icon) {
      //If TextField isn't expecting an icon
      return (
        <div
          className={`font-clashDisplay ${flexStyle === "row" && "md:grid md:grid-cols-12 md:items-center "}`}
        >
          {label && label.toString().length > 0 && (
            <div
              className={`${flexStyle === "row" ? "mb-2 md:col-span-3 md:mb-0" : "mb-2"}`}
            >
              <Typography
                variant="h-s"
                fontWeight="medium"
                color={"N700"}
                className={`cursor-pointer`}
              >
                <label htmlFor={name}>{label}</label>
              </Typography>
              {labelSubText && (
                <Typography variant="p-s" fontWeight="regular" color={"N500"}>
                  <label htmlFor={name}>{labelSubText}</label>
                </Typography>
              )}
            </div>
          )}
          <div className={`${flexStyle === "row" && "col-span-9"}`}>
            <input
              className={classes}
              id={name}
              type={type}
              placeholder={placeholder}
              {...rest}
              ref={ref}
              {...registerInput}
              onChangeCapture={handleChange}
            />
            {errorText.length > 0 && (
              <ValidationText
                message={errorText}
                status={error ? "error" : "success"}
              />
            )}
          </div>
        </div>
      );
    } else {
      //If Textfield is expecting an icon
      return (
        <div
          className={`font-clashDisplay ${flexStyle === "row" && "md:grid md:grid-cols-12 md:items-center"}`}
        >
          {label && label.toString().length > 0 && (
            <Typography
              variant="h-s"
              fontWeight="medium"
              color={"N700"}
              className={`${flexStyle === "row" ? "mb-2 md:col-span-3 md:mb-0" : "mb-2"} cursor-pointer`}
            >
              <label htmlFor={name}>{label}</label>
            </Typography>
          )}
          <div
            className={`mb-2 flex w-full items-center justify-normal rounded border px-3 py-2 focus-within:border-2 focus-within:border-B100 ${error ? "border-2 border-R400" : "border-N40"}`}
          >
            <input
              className={iconInputsClasses}
              type={type}
              id={name}
              placeholder={placeholder}
              ref={ref}
              {...rest}
              {...registerInput}
              onChangeCapture={handleChange}
            />
            <span className="cursor-pointer">{icon}</span>
          </div>
        </div>
      );
    }
  };
  return (
    <div className="font-clashDisplay">
      {inputType === "input" ? (
        type === "password" ? (
          <div
            className={`${flexStyle === "row" && "md:grid md:grid-cols-12 md:items-center"}`}
          >
            {label && label.toString().length > 0 && (
              <Typography
                variant="h-s"
                fontWeight="medium"
                color={"N700"}
                className={`${flexStyle === "row" ? "col-span-3" : "mb-2"} cursor-pointer`}
              >
                <label htmlFor={name}>{label}</label>
              </Typography>
            )}
            <div className={`${flexStyle === "row" && "col-span-9"}`}>
              <div
                className={`mb-2 flex w-full items-center justify-normal rounded border px-3 py-2 focus-within:border-2 focus-within:border-B100 ${error ? "border-2 border-R400" : "border-N40"}`}
              >
                <input
                  className={passwordClasses}
                  id={name}
                  type={showPassword ? "text" : type}
                  placeholder={placeholder}
                  ref={ref}
                  {...rest}
                  {...registerInput}
                  onChangeCapture={handleChange}
                />
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  <PassLock />
                </span>
              </div>
              {errorText.length > 0 && (
                <ValidationText
                  message={errorText}
                  status={error ? "error" : "success"}
                />
              )}
            </div>
          </div>
        ) : (
          renderInput()
        )
      ) : inputType === "textarea" ? (
        <div className={`${flexStyle === "row" && "md:grid md:grid-cols-12"}`}>
          {label && label.toString().length > 0 && (
            <Typography
              variant="h-s"
              fontWeight="medium"
              color={"N700"}
              className={`${flexStyle === "row" ? "col-span-3" : "mb-2"} cursor-pointer`}
            >
              <label htmlFor={name}>{label}</label>
            </Typography>
          )}
          <div className={`${flexStyle === "row" && "col-span-9"}`}>
            <textarea
              id={name}
              className={classes}
              placeholder={placeholder}
              rows={3}
              ref={ref as Ref<HTMLTextAreaElement>}
              {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
              {...registerInput}
              // onChangeCapture={handleChange}
            />
            {errorText.length > 0 && (
              <ValidationText
                message={errorText}
                status={error ? "error" : "success"}
              />
            )}
          </div>
        </div>
      ) : inputType === "searchable" ? (
        <div className="">
          <input
            className={classes}
            type={type}
            placeholder={placeholder}
            ref={ref}
            {...rest}
            {...registerInput}
            onChangeCapture={handleChange}
          />
        </div>
      ) : null}
    </div>
  );
};

export type InputComponentType = <
  FV extends FieldValues,
  TFieldName extends InternalFieldName,
>(
  props: ITextFieldProps<FV> & {
    ref?:
      | React.ForwardedRef<HTMLInputElement>
      | UseFormRegisterReturn<TFieldName>;
  }
) => ReturnType<typeof TextFieldComponent>;

const TextField = React.forwardRef(TextFieldComponent) as InputComponentType;
export { TextField };
export * from "./types";
