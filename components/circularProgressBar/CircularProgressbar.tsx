import React from "react";

import { Typography } from "../typography";

const CircularProgressBar = ({
  value = 3.2,
  max = 5,
  size = 120,
  strokeWidth = 8,
}) => {
  const percentage = (value / max) * 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center justify-center rounded-full bg-white p-[8px] shadow-[0px_9.88px_14.82px_0px_#091E4226]">
      <div className="relative flex h-[120px] w-[120px] flex-col items-center justify-center rounded-full">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute bottom-0 left-0 right-0 top-0 -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            strokeWidth={strokeWidth}
            stroke="#fff"
            strokeLinecap="round"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            strokeWidth={strokeWidth}
            stroke="#8993A4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <Typography variant={"h-xl"} fontWeight="bold" color={"text-default"}>
          {value}
        </Typography>
        <Typography variant={"c-s"} color={"text-light"}>
          out of {max}
        </Typography>
      </div>
    </div>
  );
};

export default CircularProgressBar;
