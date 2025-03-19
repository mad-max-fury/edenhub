"use client";

import React from "react";
import { cn } from "@/utils/helpers";
import { cva, type VariantProps } from "class-variance-authority";

import { Typography } from "../typography";

const badgeVariants = cva(
  "inline-flex items-center rounded-[4px] px-[8px] py-[4px]",
  {
    variants: {
      variant: {
        blue: "bg-B50",
        red: "bg-R50",
        yellow: "bg-Y75",
        green: "bg-G50",
        purple: "bg-P50",
        teal: "bg-T50",
        gray: "bg-N20",
      },
    },
    defaultVariants: {
      variant: "blue",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  text?: string;
}

const Badge: React.FC<BadgeProps> = ({
  className,
  variant,
  text,
  ...props
}) => {
  const getDefaultText = (variant: string): string => {
    switch (variant) {
      case "yellow":
        return "Pending";
      case "green":
        return "Active";
      case "blue":
        return "In Progress";
      default:
        return "";
    }
  };

  // const getTextColor = (variant: string): string => {
  //   switch (variant) {
  //     case "blue":
  //       return "B500";
  //     case "red":
  //       return "R500";
  //     case "yellow":
  //       return "Y500";
  //     case "green":
  //       return "G500";
  //     case "purple":
  //       return "P500";
  //     case "teal":
  //       return "T500";
  //     case "gray":
  //       return "text-default";
  //     default:
  //       return "B500";
  //   }
  // };

  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      <Typography variant="p-s" color={"N700"} fontWeight="regular">
        {text || getDefaultText(variant || "blue")}
      </Typography>
    </span>
  );
};

export { Badge, badgeVariants };
