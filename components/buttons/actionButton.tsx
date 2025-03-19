import React from "react";
import { EditBlueIcon, TrashIcon } from "@/assets/svgs";

interface IActionButtonProps {
  variant: "info" | "danger";
  disabled?: boolean;
  onClick: () => void;
}
const buttonStyles = {
  info: "hover:bg-B50 text-B400",
  danger: "hover:bg-R50 text-R400",
};
const icons = {
  info: <EditBlueIcon />,
  danger: <TrashIcon />,
};
export const ActionButton = ({
  variant,
  disabled,
  onClick,
}: IActionButtonProps) => {
  return (
    <button
      className={`${buttonStyles[variant]} duration-600 flex h-[40px] w-[40px] items-center justify-center rounded-[4px] transition-all ease-in-out disabled:cursor-not-allowed disabled:bg-N0 disabled:text-N50`}
      disabled={disabled}
      onClick={onClick}
    >
      {icons[variant]}
    </button>
  );
};
