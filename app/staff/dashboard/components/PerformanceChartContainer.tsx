import React, { useContext, useState } from "react";
import { SMSelectDropDown, Typography, TypographyColors } from "@/components";
import { CURRENT_YEAR } from "@/constants/data";
import { UserContext } from "@/layouts/appLayout";
import { useGetEmployeeYearlyAppraisalResultsQuery } from "@/redux/api";
import { cn, findValueAndLabel, generateYearOptions } from "@/utils/helpers";

import { PerformanceChart } from "./PerformanceChart";

const options = generateYearOptions(2021);
interface ILegendProps {
  title: string;
  color: TypographyColors;
}
export const PerformanceChartContainer = () => {
  const [year, setYear] = useState(CURRENT_YEAR);
  const user = useContext(UserContext);
  const { data, isFetching } = useGetEmployeeYearlyAppraisalResultsQuery({
    year,
    employeeId: user?.user?.employeeId ?? "",
  });

  const noScoreView = (
    <div className="flex h-full flex-col items-center justify-center">
      <Typography
        variant="h-m"
        fontWeight="medium"
        color="N900"
        align="center"
        customClassName="capitalize"
      >
        no performance scores yet
      </Typography>
      <Typography
        variant="p-s"
        fontWeight="regular"
        color="N400"
        align="center"
        customClassName="sm:w-2/4 "
      >
        Your performance scores will appear here once our first appraisal is
        complete.
      </Typography>
    </div>
  );

  const isDataAvailable = data?.data.result.length;

  return (
    <div
      className={cn(
        "h-full w-full rounded-[8px] border border-N30 px-6 py-5",
        !isDataAvailable && "flex flex-col",
      )}
      style={{
        filter: isDataAvailable && isFetching ? "blur(5px)" : "none",
      }}
    >
      <div className="mb-0 flex items-center justify-between sm:mb-6">
        <Typography variant="c-l" fontWeight="bold" color="N900">
          Performance
        </Typography>
        {isDataAvailable ? (
          <div className="hidden items-center gap-2 sm:flex">
            <Legend title="Personal score" color="N90" />
            <Legend title="Appraiser score" color="B75" />
          </div>
        ) : (
          <></>
        )}
        <div>
          <SMSelectDropDown
            defaultValue={findValueAndLabel(CURRENT_YEAR, options)}
            options={options}
            searchable={false}
            onChange={(e) => setYear(Number(e.value))}
          />
        </div>
      </div>
      {isDataAvailable ? (
        <PerformanceChart data={data?.data?.result} />
      ) : (
        noScoreView
      )}
      {isDataAvailable ? (
        <div className="mt-6 flex items-center justify-center gap-2 sm:hidden">
          <Legend title="Personal score" color="N90" />
          <Legend title="Appraiser score" color="B75" />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

const Legend: React.FC<ILegendProps> = ({ title, color }) => {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full bg-${color}`} />
      <Typography variant="p-s" fontWeight="regular" color="N700">
        {title}
      </Typography>
    </div>
  );
};
