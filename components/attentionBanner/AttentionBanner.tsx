import React from "react";
import { ErrorIcon } from "@/assets/svgs";
import { cn } from "@/utils/helpers";

import { Typography } from "../typography";

const AttentionBanner = ({ title }: { title: string }) => {
  return (
    <div
      className={cn(
        "flex h-[56px] w-full items-center justify-start gap-4 rounded-[3px] bg-R50 p-[18px_26px]",
      )}
    >
      <ErrorIcon />
      <Typography variant={"h-m"} fontWeight={"black"} color="N800">
        {title}
      </Typography>
    </div>
  );
};

export default AttentionBanner;
