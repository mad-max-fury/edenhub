"use client";

import React, { forwardRef } from "react";
import Select, {
  components,
  OptionProps,
  SingleValueProps,
} from "react-select";

import { Avatar } from "../avatar";
import { ValidationText } from "../validationText";

export interface EmployeeOptionType {
  label: string;
  value: string;
  icon?: React.ReactNode;
  jobDesignation?: string;
  department?: string;
}

interface SMSelectDropDownProps {
  options?: EmployeeOptionType[];
  varient?: "simple" | "custom";
  onChange?: (value: EmployeeOptionType) => void;
  selectWidth?: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  defaultInputValue?: EmployeeOptionType;
  defaultValue?: EmployeeOptionType | EmployeeOptionType[] | null;
  value?: EmployeeOptionType | EmployeeOptionType[] | null;
  bgColor?: boolean;
  searchable?: boolean;
  id?: string;
  width?: string;
  isError?: boolean;
  errorText?: string;
  field?: any;
  isMulti?: boolean;
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
    display: "flex",
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

export const EmployeeSMSelectDropDown = forwardRef<any, SMSelectDropDownProps>(
  (
    {
      options = [
        {
          label: "John Smith",
          value: "Jhon Smith",
          icon: <Avatar fullname="John Smith" />,
          jobDesignation: "Software Engineer",
          department: "Engineering",
        },
        {
          label: "Jane Doe",
          value: "Jane Doe",
          icon: <Avatar fullname="Jane Doe" />,
          jobDesignation: "Senior Software Engineer",
          department: "Engineering",
        },
        {
          label: "David Johnson",
          value: "David Johnson",
          icon: <Avatar fullname="David Johnson" />,
          jobDesignation: "Senior Software Engineer",
          department: "Engineering",
        },
      ],
      varient = "simple",
      bgColor = false,
      onChange = () => {},
      selectWidth = "100%",
      placeholder,
      disabled,
      loading,
      defaultInputValue,
      defaultValue,
      value,
      searchable,
      id,
      width,
      isError = false,
      errorText = "",
      field,
      isMulti = false,
    },
    ref,
  ) => {
    const handleChange = async (value: EmployeeOptionType) => {
      const awaitedValue = await value;
      onChange(awaitedValue);
    };

    const customOption = (props: OptionProps<EmployeeOptionType>) => (
      <components.Option {...props}>
        <div className="flex items-start gap-2">
          {props.data.icon && props.data.icon}
          <div className="flex flex-col">
            <span className="whitespace-nowrap text-xs">
              {props.data.label}
            </span>
            <div className="flex items-center gap-2">
              {props.data.jobDesignation && (
                <span className="text-xs text-gray-400">
                  {props.data.jobDesignation}
                </span>
              )}
              <div className="h-[12px] w-[1px] bg-black/70" />
              {props.data.department && (
                <span className="text-xs text-gray-400">
                  {props.data.department}
                </span>
              )}
            </div>
          </div>
        </div>
      </components.Option>
    );

    const customSingleValue = (props: SingleValueProps<EmployeeOptionType>) => (
      <div className="flex items-center gap-2">
        {props.data.icon && props.data.icon}
        <span className="whitespace-nowrap">{props.data.label}</span>
      </div>
    );

    return (
      <div className={`flex flex-col ${width ? `w-${width}` : "w-full"}`}>
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
    );
  },
);

EmployeeSMSelectDropDown.displayName = "EmployeeSMSelectDropDown";
