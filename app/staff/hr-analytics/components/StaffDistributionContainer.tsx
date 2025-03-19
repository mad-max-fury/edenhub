import React, { useMemo, useState } from "react";
import { SMSelectDropDown, Typography, TypographyColors } from "@/components";
import { useGetStaffCountQuery } from "@/redux/api";
import { ISelectItemPropsWithValueGeneric } from "@/redux/api/interface";

import { StaffDistributionChart } from "./StaffDistributionChart";

export interface ILegendProps {
  title: string;
  color: TypographyColors;
  count: number;
}

interface IStaffDistributionProps {
  allCompanies: ISelectItemPropsWithValueGeneric[];
}

export const StaffDistributionContainer = ({
  allCompanies,
}: IStaffDistributionProps) => {
  const [companyId, setCompanyId] = useState("");
  const { data, isFetching } = useGetStaffCountQuery({
    companyId,
  });

  const legends: ILegendProps[] = useMemo(
    () => [
      { title: "Full Staff", color: "B200", count: data?.data?.fullStaff ?? 0 },
      {
        title: "In-house contract",
        color: "G300",
        count: data?.data?.inHouseContract ?? 0,
      },
      {
        title: "Outsourced contract",
        color: "P300",
        count: data?.data?.outsourcedContract ?? 0,
      },
      { title: "NYSC", color: "N700", count: data?.data?.nysc ?? 0 },
      { title: "Intern", color: "Y400", count: data?.data?.intern ?? 0 },
    ],
    [data?.data],
  );
  const companyOptions = [
    { label: "All Companies", value: "" },
    ...allCompanies,
  ];

  return (
    <div
      className="h-full w-full rounded-[8px] border border-N30 px-6 py-5"
      style={{
        filter: isFetching ? "blur(5px)" : "none",
      }}
    >
      <div className="flex items-center justify-between">
        <Typography variant="c-xl" fontWeight="bold" color="N900">
          Employees
        </Typography>
        <div className="w-[205px]">
          <SMSelectDropDown
            options={companyOptions}
            searchable={false}
            defaultValue={companyOptions[0]}
            placeholder="All Companies"
            onChange={(e) => setCompanyId(String(e.value))}
          />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 items-center gap-6 sm:grid-cols-2">
        <div>
          {data?.data && (
            <StaffDistributionChart
              data={legends}
              total={
                data?.data?.total ?? 0
              }
            />
          )}
        </div>
        <div className="flex flex-row flex-wrap gap-3 sm:flex-col">
          {legends.map((legend, index) => (
            <Legend key={index} {...legend} />
          ))}
        </div>
      </div>
    </div>
  );
};

const Legend: React.FC<ILegendProps> = ({ title, color, count }) => {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-[2px] bg-${color}`} />
      <Typography variant="p-s" fontWeight="regular" color="N700">
        {title}
      </Typography>
      <Typography variant="p-m" fontWeight="bold" color="N700">
        {count}
      </Typography>
    </div>
  );
};