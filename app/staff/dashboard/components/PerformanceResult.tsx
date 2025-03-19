import React from "react";
import { Typography } from "@/components";

interface IResultProps {
  score: number;
  title: string;
}
export const PerformanceResult: React.FC<IResultProps> = ({ title, score }) => {
  const maxScore = 5;

  // Helper function to get status based on score
  const getStatus = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return "excellent";
    if (percentage >= 80) return "good";
    if (percentage >= 70) return "average";
    if (percentage >= 40) return "poor";
    if (percentage >= 20) return "unacceptable";
    return "poor";
  };

  // Configuration object for different statuses
  const statusConfig: Record<
    "excellent" | "good" | "average" | "poor" | "unacceptable",
    { color: string; emoji: string; message: string }
  > = {
    excellent: {
      color: "var(--color-G400)", // green
      emoji: "🤗",
      message: "High Five!",
    },
    good: {
      color: "var(--color-G200)", // light green
      emoji: "🤗",
      message: "Good job",
    },
    average: {
      color: "var(--color-Y400)", // yellow
      emoji: "😐",
      message: "Okay",
    },
    poor: {
      color: "var(--color-R200)", // red
      emoji: "😠",
      message: "Needs attention",
    },
    unacceptable: {
      color: "var(--color-R400)", // red
      emoji: "😡",
      message: "Unacceptable!",
    },
  };

  const status = getStatus(score, maxScore);
  const { color, emoji, message } = statusConfig[status];

  // Calculate the semi-circle's stroke dash array and offset
  const radius = 80;
  const circumference = Math.PI * radius; // Half-circle circumference
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference * (1 - score / maxScore);

  const noResultsView = (
    <div className="flex h-full flex-col justify-center gap-1">
      <Typography
        variant="h-m"
        fontWeight="medium"
        color="N900"
        align="center"
        customClassName="capitalize"
      >
        no performance results yet
      </Typography>
      <Typography
        variant="p-s"
        fontWeight="regular"
        color="N400"
        align="center"
      >
        Your performance results will appear here once our first appraisal is
        complete.
      </Typography>
    </div>
  );

  const resultsView = (
    <>
      <Typography
        variant="h-s"
        fontWeight="medium"
        color="N900"
        className="text-center"
      >
        {title}
      </Typography>

      <div className="relative mx-auto mb-3 h-36 w-48">
        {/* Semi-circle SVG */}
        <svg viewBox="0 0 200 100">
          {/* Background semi-circle */}
          <path
            d={`M 100,100 m -${radius},0 a ${radius},${radius} 0 1,1 ${radius * 2},0`}
            className="stroke-N30"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress semi-circle */}
          <path
            d={`M 100,100 m -${radius},0 a ${radius},${radius} 0 1,1 ${radius * 2},0`}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray,
              strokeDashoffset,
            }}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Score display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Typography variant="h-xl" fontWeight="bold" color="N900">
            {score.toFixed(2)}
          </Typography>
          <Typography variant="p-s" fontWeight="regular" color="N200">
            out of {maxScore}
          </Typography>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex w-fit items-center justify-center gap-3 rounded-[8px] bg-N10 px-3 py-2">
          <span className="text-4xl">{emoji}</span>
          <Typography variant="p-l" fontWeight="medium" color="N900">
            {message}
          </Typography>
        </div>
      </div>
    </>
  );

  return (
    <div className="h-full rounded-[8px] border border-N30 px-6 py-4">
      {score === 0 ? noResultsView : resultsView}
    </div>
  );
};
