"use client";

import React, { useState } from "react";
import { PerformanceRating, Typography } from "@/components";

import { ReviewResult } from "@/components/reviewResult/reviewResult";

const PerformanceRatingExample = () => {
  const [selectedRating, setSelectedRating] = useState("");

  const performanceOptions = [
    { value: "1", label: "Poor" },
    { value: "2", label: "Unsatisfactory" },
    { value: "3", label: "Average" },
    { value: "4", label: "Good" },
    { value: "5", label: "Excellent" },
    { value: "0", label: "Not Applicable" },
  ];

  return (
    <div>
      <div className="space-y-8 p-6">
        <Typography
          variant="h-xl"
          fontWeight="bold"
          color="N200"
          gutterBottom
          className="bg-B50 px-4 py-2"
        >
          Performance Rating Examples
        </Typography>

        <div>
          <Typography variant="p-m" className="mb-2">
            Uncontrolled Component:
          </Typography>
          <div className="flex items-center gap-4">
            <PerformanceRating
              name="stateRating"
              options={performanceOptions}
              onChange={(value) => setSelectedRating(value)}
              value={selectedRating}
            />
          </div>
        </div>
      </div>

      <div className="flex w-full p-4">
        <ReviewResult />
      </div>
    </div>
  );
};

export default PerformanceRatingExample;
