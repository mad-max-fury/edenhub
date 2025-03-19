import React, { useState } from "react";
import { SMSelectDropDown, Typography } from "@/components";
import { useGetCompanyYearlyAppraisalResultsQuery } from "@/redux/api";
import { generateYearOptions } from "@/utils/helpers";

import { PerformanceChart } from "./PerformanceChart";

const options = generateYearOptions(2021);
export const PerformanceChartContainer = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const { data, isFetching } = useGetCompanyYearlyAppraisalResultsQuery({
    year,
  });
  return (
    <div
      className="h-full w-full rounded-[8px] border border-N30 px-6 py-5"
      style={{
        filter: isFetching ? "blur(5px)" : "none",
      }}
    >
      <div className="mb-6 flex items-center justify-between">
        <Typography variant="c-l" fontWeight="bold" color="N900">
          Average Performance
        </Typography>
        <div>
          <SMSelectDropDown
            defaultValue={options[0]}
            options={options}
            searchable={false}
            onChange={(e) => setYear(Number(e.value))}
          />
        </div>
      </div>
      <PerformanceChart data={data?.data} />
    </div>
  );
};
