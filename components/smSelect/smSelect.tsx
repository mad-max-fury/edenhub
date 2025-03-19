"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import Select, {
  components,
  OptionProps,
  SingleValueProps,
} from "react-select";

import { Avatar } from "../avatar";
import { Typography } from "../typography";
import { ValidationText } from "../validationText";

export interface OptionType {
  label: string; 
  value: string | number;
  icon?: string;
  subLabel?: string;
}

interface SMSelectDropDownProps {
  options?: OptionType[];
  varient?: "simple" | "custom";
  onChange?: (value: OptionType) => void;
  selectWidth?: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  defaultInputValue?: OptionType;
  defaultValue?: OptionType | OptionType[] | null;
  value?: OptionType | OptionType[] | null;
  bgColor?: boolean;
  searchable?: boolean;
  id?: string;
  width?: string;
  isError?: boolean;
  errorText?: string;
  field?: any;
  label?: React.ReactNode | string;
  flexStyle?: "col" | "row";
  isMulti?: boolean;
  name?: string;
}

const selectStyles = ({
  isError,
  bgColor = false,
}: {
  isError: boolean;
  bgColor?: boolean;
}) => ({
  input: (styles: any) => ({
    ...styles,
    "&:not(.aui-no-focusvisible) :focus-visible": {
      boxShadow: "none",
      border: "none",
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    overflowY: "auto",
    scrollbarColor: "transparent",
    scrollbarWidth: "thin",
    "&::-webkit-scrollbar": {
      width: "7px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "transparent !important",
      borderRadius: "2.5px",
      height: "50px",
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent !important",
      borderBottomRightRadius: "16px",
    },
    "&::-webkit-scrollbar-thumb, &::-webkit-scrollbar-track": {
      background: "transparent",
    },
  }),
  control: (
    styles: any,
    { isDisabled, isFocused }: { isDisabled: boolean; isFocused: boolean },
  ) => ({
    ...styles,
    borderRadius: "4px",
    outline: "none",
    cursor: "pointer",
    border: `1px solid ${isError ? "red" : "#dfe1e6"}`,
    minHeight: "40px",
    width: "100%",
    color: isDisabled ? "#97a0af" : "#97a0af",
    backgroundColor: isDisabled || bgColor ? "#f4f5f7" : "#ffffff",
    "&:hover": {
      border: isFocused
        ? "1px solid #0052CC"
        : isError
          ? "1px solid red"
          : "1px solid #dfe1e6",
    },
  }),
  option: (
    styles: any,
    {
      isDisabled,
      isFocused,
      isSelected,
    }: { isDisabled: boolean; isFocused: boolean; isSelected: boolean },
  ) => ({
    ...styles,
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "20px",
    cursor: "pointer",
    color: isDisabled ? "#97a0af" : "#172B4D",
    textWrap: "nowrap",
    whiteSpace: "wrap",
    backgroundColor: isDisabled
      ? "#f4f5f7"
      : isSelected
        ? "#EBECF0"
        : "#ffffff",
    "&:hover": {
      backgroundColor: isSelected ? "#EBECF0" : "#DFE1E6",
    },
  }),
  placeholder: (styles: any) => ({
    ...styles,
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "20px",
    color: "#97a0af",
  }),
  valueContainer: (styles: any) => ({
    ...styles,
    borderLeft: "none",
    fontSize: "14px",
    minHeight: "40px",
  }),
  indicatorSeparator: (styles: any) => ({
    ...styles,
    display: "none",
    fontSize: "14px",
  }),
  dropdownIndicator: (styles: any) => ({
    ...styles,
    color: "#42526E",
    fontSize: "14px",
  }),
  autosizeInput: (styles: any) => ({
    ...styles,
    "&:not(.aui-no-focusvisible) :focus-visible": {
      boxShadow: "none",
    },
  }),
});

export const SMSelectDropDown = forwardRef<any, SMSelectDropDownProps>(
  (
    {
      options = [
        { label: "Un-appraised", value: "Un-appraised" },
        { label: "In-progress", value: "In-progress" },
        { label: "completed", value: "completed" },
      ],
      varient = "simple",
      bgColor = false,
      onChange = () => {},
      defaultValue,
      placeholder,
      disabled,
      loading,
      defaultInputValue,
      value,
      searchable,
      id,
      label,
      flexStyle,
      isError = false,
      errorText = "",
      field,
      isMulti = false,
      name,
    },
    ref,
  ) => {

    const handleChange = async (value: OptionType) => {
      const awaitedValue = await value;
      onChange(awaitedValue);
    };

    const customOption = (props: OptionProps<OptionType>) => (
      <components.Option {...props}>
        <div className="flex items-center gap-1">
          {props.data.icon && (
            <Avatar
              fullname={props?.data?.label}
              src={props?.data?.icon}
              size={"sm"}
            />
          )}

          <span className="whitespace-nowrap">{props.data.label}</span>
        </div>
      </components.Option>
    );

    const customSingleValue = (props: SingleValueProps<OptionType>) => (
      <div className="flex items-center gap-1">
        {props.data.icon && (
          <Avatar
            fullname={props?.data?.label}
            src={props?.data?.icon}
            size={"sm"}
          />
        )}
        <span className="whitespace-nowrap">{props?.data?.label}</span>
      </div>
    );

    return (
      <div
        className={`${flexStyle === "row" ? "items-center md:grid md:grid-cols-12" : "w-full"}`}
      >
        {label && label.toString().length > 0 && (
          <Typography
            variant="h-s"
            fontWeight="medium"
            color={"N700"}
            className={`${flexStyle === "row" ? "col-span-3" : "mb-2"} cursor-pointer`}
          >
            <label>{label}</label>
          </Typography>
        )}
        <div className={`${flexStyle === "row" && "col-span-9"}`}>
          <Select
            ref={ref}
            options={options}
            onChange={handleChange}
            placeholder={placeholder}
            isDisabled={disabled}
            isLoading={loading}
            value={value}
            defaultInputValue={defaultInputValue}
            defaultValue={defaultValue}
            isSearchable={searchable}
            id={id}
            name={name}
            isMulti={isMulti}
            styles={selectStyles({ isError, bgColor })}
            components={
              varient === "simple"
                ? {}
                : { Option: customOption, SingleValue: customSingleValue }
            }
            {...field}
          />
          {errorText.length > 0 && (
            <ValidationText status="error" message={errorText} />
          )}
        </div>
      </div>
    );
  },
);

SMSelectDropDown.displayName = "SMSelectDropDown";