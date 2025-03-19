import React from "react";
import { cn } from "@/utils/helpers";

interface ISpinner {
  height?: string;
  width?: string;
  color?: string;
}
export const Spinner = ({
  height = "100%",
  width = "100%",
  color,
}: ISpinner) => {
  return (
    <div className="flex items-center justify-center" style={{ height, width }}>
      <div
        className={cn(
          "inline-block h-10 w-10 animate-spin rounded-full border-t-2 border-[inherit]",
          color ?? `border-B400`,
        )}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};
