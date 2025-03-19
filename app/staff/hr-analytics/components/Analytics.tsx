import React from "react";
import {
  ArrpwUpRightIcon,
  BusinessUnitIcon,
  CompanyIcon,
  CompanyLocationIcon,
  DepartmentIcon,
} from "@/assets/svgs";
import { Typography, TypographyColors } from "@/components";
import { IHRDashboardProps } from "@/redux/api";

interface IAnalyticsProps {
  data: IHRDashboardProps;
}
interface IGenderProps {
  gender: string;
  count: number;
  color: TypographyColors;
}

interface IOrganizationInfoProps {
  title: string;
  count: number;
  icon: React.ReactNode;
}

export const Analytics = ({ data }: IAnalyticsProps) => {
  const infos: IOrganizationInfoProps[] = [
    {
      title: "Companies",
      count: data?.companies?.companies || 0,
      icon: <CompanyIcon />,
    },
    {
      title: "Departments",
      count: data?.companies?.departments || 0,
      icon: <DepartmentIcon />,
    },
    {
      title: "Business Units",
      count: data?.companies?.businessUnits || 0,
      icon: <BusinessUnitIcon />,
    },
    {
      title: "Locations",
      count: data?.companies?.locations || 0,
      icon: <CompanyLocationIcon />,
    },
  ];
  return (
    <div className="mt-5 grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-4">
        <EmployeeSummary data={data} />
      </div>
      {infos.map((info) => (
        <div
          key={info.title}
          className="col-span-6 sm:col-span-3 lg:col-span-2"
        >
          <OrgizationalInfo
            title={info.title}
            count={info.count}
            icon={info.icon}
          />
        </div>
      ))}
    </div>
  );
};

const EmployeeSummary = ({ data }: IAnalyticsProps) => {
  return (
    <div className="flex h-[180px] flex-col justify-between rounded-[8px] border border-N30 p-5">
      <div className="flex justify-between">
        <div>
          <Typography variant="p-l" fontWeight="regular" color="N500">
            Total Employees
          </Typography>
          <Typography
            variant="h-xl"
            fontWeight="medium"
            color="N900"
            className="mt-2"
          >
            {data?.employeeCounts?.total || 0}
          </Typography>
        </div>
        <ArrowBox />
      </div>
      <div className="flex flex-col gap-1">
        <GenderInfo
          gender="Male"
          count={data?.employeeCounts?.male || 0}
          color="B400"
        />
        <GenderInfo
          gender="Female"
          count={data?.employeeCounts?.female || 0}
          color="R75"
        />
      </div>
    </div>
  );
};

const ArrowBox = () => {
  return (
    <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] border border-N20">
      <ArrpwUpRightIcon />
    </div>
  );
};

const GenderInfo = ({ gender, count, color }: IGenderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`h-[8px] w-[8px] rounded-full bg-${color}`} />
        <Typography variant="p-l" fontWeight="regular" color="N500">
          {gender}
        </Typography>
      </div>
      <Typography variant="p-l" fontWeight="regular" color="N500">
        {count}
      </Typography>
    </div>
  );
};

const OrgizationalInfo = ({ title, icon, count }: IOrganizationInfoProps) => {
  return (
    <div className="flex h-[180px] flex-col justify-between rounded-[8px] border border-N30 px-5 pb-6 pt-5">
      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] bg-N10">
        {icon}
      </div>
      <div className="mt-6">
        <Typography variant="p-l" fontWeight="regular" color="N500">
          {title}
        </Typography>
        <div className="mt-2 flex items-center justify-between">
          <Typography variant="h-xl" fontWeight="medium" color="N900">
            {count}
          </Typography>
          <ArrowBox />
        </div>
      </div>
    </div>
  );
};
