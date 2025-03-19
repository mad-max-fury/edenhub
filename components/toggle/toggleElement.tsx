"use client";

import React from "react";
import Toggle from "@atlaskit/toggle";

export type Size = "regular" | "large";
interface ToggleElementProps {
  label?: string;
  id?: string;
  checked?: boolean;
  size?: Size | undefined;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
  [key: string]: any;
}

const ToggleElement: React.FC<ToggleElementProps> = ({
  label,
  id = "toggle-default",
  checked,
  size = "large",
  onChange = () => {},
  isDisabled = false,
  ...restProps
}) => {
  return (
    <div className="[&>*]:focus-within:!border-none [&>*]:focus-within:!outline-none">
      <Toggle
        id={id}
        isChecked={checked}
        size={size}
        onChange={onChange}
        isDisabled={isDisabled}
        {...restProps}
      />
      {label && (
        <label
          htmlFor={id}
          className="ml-1 cursor-pointer text-base font-bold leading-6"
        >
          {label}
        </label>
      )}
    </div>
  );
};

export { ToggleElement };
