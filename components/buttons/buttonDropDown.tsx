"use client";

import React, { useEffect, useRef, useState } from "react";
import { EllipsisIcon } from "@/assets/svgs";
import { cn } from "@/utils/helpers";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";

import { Typography, TypographyColors } from "../typography";
import { Button } from "./button";

export type ButtonDropdownItem = {
  name: string;
  textColor?: TypographyColors;
  onClick: () => void;
};

interface IButtonDropdown {
  buttonGroup: ButtonDropdownItem[];
}

export const ButtonDropdown = ({
  buttonGroup,
  colored = false,
  isLoading = false,
  isVertical = false,
}: {
  buttonGroup: ButtonDropdownItem[];
  colored?: boolean;
  isLoading?: boolean;
  isVertical?: boolean;
}) => {
  const [showDropdown, toggleShowDropdown] = useState(false);
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null,
  );
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-end",
    modifiers: [{ name: "arrow" }],
  });

  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) {
        toggleShowDropdown(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative w-fit" ref={setReferenceElement}>
      <Button
        variant={"plain"}
        loading={isLoading}
        disabled={isLoading}
        ref={btnRef}
        onClick={() => toggleShowDropdown(!showDropdown)}
        className={cn(
          "flex items-center",
          colored && "rounded bg-N20 p-[12px] hover:bg-N700",
          isLoading && "bg-N700",
        )}
      >
        <div
          className={cn(
            "transition-transform duration-300", // Smooth transition
            isVertical ? "rotate-90" : "rotate-0", // Conditional rotation
          )}
        >
          <EllipsisIcon />
        </div>
      </Button>

      {showDropdown && (
        <DropdownMenu
          buttonGroup={buttonGroup}
          styles={styles.popper}
          attributes={attributes.popper}
          dropRef={setPopperElement}
        />
      )}
    </div>
  );
};

interface IDropdownMenuProps extends IButtonDropdown {
  dropRef: (element: HTMLElement | null) => void;
  styles: React.CSSProperties;
  attributes: any;
}

const DropdownMenu = ({
  buttonGroup,
  dropRef,
  styles,
  attributes,
}: IDropdownMenuProps) => {
  return createPortal(
    <div
      ref={dropRef}
      className="z-[10] w-[191px] border bg-white py-2 shadow-lg"
      style={styles}
      {...attributes}
    >
      {buttonGroup.map((btn, i) => (
        <div
          key={i}
          className="cursor-pointer px-4 py-[10px] hover:bg-N30"
          onClick={() => {
            btn.onClick();
          }}
        >
          <Typography variant={"p-s"} color={btn.textColor}>
            {btn.name}
          </Typography>
        </div>
      ))}
    </div>,
    document.getElementById("portal") as HTMLElement,
  );
};
