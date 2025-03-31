"use client";

import React from "react";
import { cn } from "@/utils/helpers";
import { cva } from "class-variance-authority";

import { TypographyProps, variantMapping } from "./types";

const colorClasses = {
  // Light Brown
  LB50: "text-LB50",
  LB75: "text-LB75",
  LB100: "text-LB100",
  LB200: "text-LB200",
  LB300: "text-LB300",
  LB400: "text-LB400",
  LB500: "text-LB500",
  LB600: "text-LB600",
  // Brown
  BR50: "text-BR50",
  BR75: "text-BR75",
  BR100: "text-BR100",
  BR200: "text-BR200",
  BR300: "text-BR300",
  BR400: "text-BR400",
  BR500: "text-BR500",
  // Blue
  B50: "text-B50",
  B75: "text-B75",
  B100: "text-B100",
  B200: "text-B200",
  B300: "text-B300",
  B400: "text-B400",
  B500: "text-B500",

  // Red
  R50: "text-R50",
  R75: "text-R75",
  R100: "text-R100",
  R200: "text-R200",
  R300: "text-R300",
  R400: "text-R400",
  R500: "text-R500",

  // Yellow
  Y50: "text-Y50",
  Y75: "text-Y75",
  Y100: "text-Y100",
  Y200: "text-Y200",
  Y300: "text-Y300",
  Y400: "text-Y400",
  Y500: "text-Y500",

  // Green
  G50: "text-G50",
  G75: "text-G75",
  G100: "text-G100",
  G200: "text-G200",
  G300: "text-G300",
  G400: "text-G400",
  G500: "text-G500",

  // Purple
  P50: "text-P50",
  P75: "text-P75",
  P100: "text-P100",
  P200: "text-P200",
  P300: "text-P300",
  P400: "text-P400",
  P500: "text-P500",

  // Teal
  T50: "text-T50",
  T75: "text-T75",
  T100: "text-T100",
  T200: "text-T200",
  T300: "text-T300",
  T400: "text-T400",
  T500: "text-T500",

  // Neutral (Light)
  N0: "text-N0",
  N10: "text-N10",
  N20: "text-N20",
  N30: "text-N30",
  N40: "text-N40",
  N50: "text-N50",

  // Neutral (Mid)
  N60: "text-N60",
  N70: "text-N70",
  N80: "text-N80",
  N90: "text-N90",
  N100: "text-N100",
  N200: "text-N200",
  N300: "text-N300",
  N400: "text-N400",

  // Neutral (Dark)
  N500: "text-N500",
  N600: "text-N600",
  N700: "text-N700",
  N800: "text-N800",
  N900: "text-N900",

  //Text Colors
  "text-default": "text-text-default",
  "text-light": "text-text-light",
  "text-sec": "text-default",
};

const typography = cva("", {
  variants: {
    intent: {
      "h-xxl": "text-h-xxl mmd:text-h-xl",
      "h-xl": "text-h-xl mmd:text-h-l ",
      "h-l": "text-h-l mmd:text-h-m",
      "h-m": "text-m mmd:text-s",
      "h-s": "text-h-s",
      "h-xs": "text-h-xs",
      "p-xxl": "text-p-xxl mmd:p-xl",
      "p-xl": "text-p-xl mmd:p-l",
      "p-l": "text-p-l",
      "p-m": "text-p-m",
      "p-s": "text-p-s",
      "c-xxl": "text-c-xxl mmd:text-c-xl",
      "c-xl": "text-c-xl mmd:text-c-l",
      "c-l": "text-c-l mmd:text-c-m",
      "c-m": "text-c-m mmd:text-c-s",
      "c-s": "text-c-s",
      span: "",
    },
    font: {
      clashDisplay: "font-clashDisplay",
    },
    color: colorClasses,
    fontWeight: {
      regular: "font-normal",
      medium: "font-medium",
      bold: "font-bold",
      black: "font-black",
    },
    underline: { always: "underline", hover: "hover:underline", none: "" },
    align: {
      center: "text-center",
      start: "text-start",
      end: "text-end",
      left: "text-left",
      right: "text-right",
      justify: "text-justify",
    },
  },
  compoundVariants: [],
});

// Typography component
function Typography(props: TypographyProps) {
  const {
    variant = "p-l",
    tag,
    underline = "none",
    fontWeight = "regular",
    gutterBottom,
    noWrap,
    align = "left",
    color = "N700",
    customClassName = "",
    font = "clashDisplay",
    children,
    className,
    ...rest
  } = props;

  // Resolved tag
  const Tag = (tag ||
    variantMapping[variant] ||
    "p") as keyof JSX.IntrinsicElements;

  // Classes
  const classNameI = cn(
    gutterBottom && "mb-4",
    noWrap && "overflow-hidden text-ellipsis whitespace-nowrap",
    className && className
  );

  return (
    // @ts-expect-error: Temporarily suppressing type error due to tag type
    <Tag
      className={typography({
        intent: variant,
        underline,
        fontWeight,
        color,
        align,
        font,
        className: cn(
          classNameI && classNameI,
          customClassName && customClassName
        ),
      })}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export { Typography };
export * from "./types";
