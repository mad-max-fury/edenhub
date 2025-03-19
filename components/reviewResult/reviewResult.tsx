import React from "react";

import CircularProgressBar from "../circularProgressBar/CircularProgressbar";
import { Typography } from "../typography";

type Props = {};

export const ReviewResult = (props: Props) => {
  return (
    <div className="flex w-full max-w-[270px] flex-col items-center rounded-md border-2 border-solid pb-[24px] pt-[16px]">
      <Typography variant="p-m" fontWeight="bold" color={"N700"}>
        Review Result
      </Typography>
      <div className="my-[14px] flex items-center justify-center p-[23px]">
        <CircularProgressBar value={3.2} max={5} />
      </div>
      <div className="gap-2] flex items-center gap-2">
        <span className="h-[7px] w-[7px] rounded-full bg-N90" />
        <div className="flex items-center gap-1">
          <Typography color={"text-light"}>Review score</Typography>{" "}
          <Typography color={"text-light"} fontWeight={"bold"}>
            3.2
          </Typography>
        </div>
      </div>
    </div>
  );
};
