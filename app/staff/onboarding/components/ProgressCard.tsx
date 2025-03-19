import React from "react";
import { Typography } from "@/components";
import { IOnboardingTask } from "@/redux/api";

export const ProgressCard = ({ tasks }: { tasks: IOnboardingTask[] }) => {
  return (
    <div className="w-full rounded-[8px] border border-N40 p-4 px-5">
      <Typography
        fontWeight="bold"
        variant="c-l"
        className="text-center text-N800"
      >
        Your Progress
      </Typography>
      <Typography className="text-center font-medium text-N100" variant="p-s">
        Overview of Form Completion
      </Typography>
      <div className="mt-5 flex justify-center">
        <ProgressCircle
          completed={tasks.filter((task) => task.completed).length}
          total={tasks.length}
        />
      </div>
    </div>
  );
};

interface ProgressCircleProps {
  completed: number;
  total: number;
}

export default function ProgressCircle({
  completed,
  total,
}: ProgressCircleProps) {
  const percentage = (completed / total) * 100;
  const strokeDasharray = 283; // Circumference of the circle
  const strokeDashoffset =
    strokeDasharray - (percentage / 100) * strokeDasharray;

  return (
    <div className="relative flex h-[120px] w-[120px] items-center justify-center">
      {/* Background progress circle (grey circle in front) */}
      <svg className="absolute h-full w-full" viewBox="0 0 100 100">
        <circle
          className="text-N30"
          strokeWidth="5"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
      </svg>

      {/* Progress circle behind the main circle */}
      <svg className="absolute h-full w-full" viewBox="0 0 100 100">
        <circle
          className="text-G300 transition-all duration-500 ease-out" // Animates the progress
          strokeWidth="5"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)" // Start at the top
        />
      </svg>

      {/* Text inside the circle */}
      <div className="relative text-center">
        <Typography variant="h-xl" fontWeight="bold" className="text-center">
          {completed}
        </Typography>
        <Typography variant="p-s">out of {total}</Typography>
      </div>
    </div>
  );
}
